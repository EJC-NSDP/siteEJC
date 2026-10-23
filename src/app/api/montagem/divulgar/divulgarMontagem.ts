import { prisma } from '@/lib/prisma'

import { getCurrentEncontro } from '../../encontro/atual/[ignorar]/get-current-encontro/get-current-encontro'

export interface DivulgarMontagem {
  montagem: {
    atualizados: number
    deletados: number
  }
  roles: {
    apresentacao: number
    secretaria: number
    externa: number
    recepcao: number
    tiosSecretos: number
    tiosAparentes: number
    bvs: number
    coordenadores: number
  }
}

const ROLES_AJUSTAVEIS = [
  'COORDENADOR',
  'EXTERNA',
  'SECRETARIA',
  'APRESENTACAO',
  'TIOSECRETO',
  'TIOAPARENTE',
  'RECEPCAO',
  'BV',
] as const
type RoleAjustavel = (typeof ROLES_AJUSTAVEIS)[number]

async function aplicarEquipeMontagem() {
  const currentEncontro = await getCurrentEncontro()
  const equipeMontagem = await prisma.equipeMontagem.findMany()
  const dirigentes = await prisma.pessoa.findMany({
    where: {
      roles: { has: 'DIRIGENTE' },
    },
  })
  let upserted = 0
  let removed = 0

  if (!currentEncontro || !equipeMontagem || !dirigentes) return null

  equipeMontagem.forEach(async (encontreiro) => {
    if (encontreiro.valueEquipe === 'nao_participara') {
      const encontreiroFound = await prisma.equipeEncontro.findUnique({
        where: {
          idPessoa_idEncontro: {
            idEncontro: currentEncontro.id,
            idPessoa: encontreiro.idEncontreiro,
          },
        },
      })
      if (encontreiroFound) {
        await prisma.equipeEncontro.delete({
          where: {
            idPessoa_idEncontro: {
              idEncontro: currentEncontro.id,
              idPessoa: encontreiro.idEncontreiro,
            },
          },
        })
      }
      if (encontreiroFound) removed = removed + 1
    } else {
      try {
        await prisma.equipeEncontro.upsert({
          where: {
            idPessoa_idEncontro: {
              idEncontro: currentEncontro.id,
              idPessoa: encontreiro.idEncontreiro,
            },
          },
          create: {
            idEncontro: currentEncontro.id,
            idPessoa: encontreiro.idEncontreiro,
            coordenou: encontreiro.coordenando,
            idEquipe: encontreiro.valueEquipe,
          },
          update: {
            coordenou: encontreiro.coordenando,
            idEquipe: encontreiro.valueEquipe,
          },
        })
        upserted = upserted + 1
      } catch {
        throw new Error(
          `Erro ao atualizar ${encontreiro.idEncontreiro} - ${encontreiro.valueEquipe}`,
        )
      }
    }
  })

  dirigentes.forEach(async (dirigente) => {
    await prisma.equipeEncontro.upsert({
      where: {
        idPessoa_idEncontro: {
          idPessoa: dirigente.id,
          idEncontro: currentEncontro.id,
        },
      },
      create: {
        idPessoa: dirigente.id,
        idEncontro: currentEncontro.id,
        idEquipe: 'dirigente',
        coordenou: true,
      },
      update: {
        idEquipe: 'dirigente',
        coordenou: true,
      },
    })
  })

  return {
    atualizados: upserted,
    deletados: removed,
  }
}

export async function ajustarRoles() {
  const currentEncontro = await getCurrentEncontro()
  if (!currentEncontro) return null

  const equipeEncontro = await prisma.equipeEncontro.findMany({
    where: { idEncontro: currentEncontro.id },
    include: {
      encontreiro: {
        include: { pessoa: true },
      },
    },
  })

  await Promise.all(
    equipeEncontro.map(async (equipe) => {
      const pessoa = equipe.encontreiro.pessoa

      const rolesPreservados = pessoa.roles.filter(
        (r) => !ROLES_AJUSTAVEIS.includes(r as RoleAjustavel),
      )

      let novosRolesAjustaveis: RoleAjustavel[] = []

      if (equipe.idEquipe === 'apresentacao' && equipe.coordenou) {
        novosRolesAjustaveis = ['APRESENTACAO', 'COORDENADOR']
      } else if (equipe.idEquipe === 'secretaria' && equipe.coordenou) {
        novosRolesAjustaveis = ['SECRETARIA', 'COORDENADOR']
      } else if (equipe.idEquipe === 'externa') {
        novosRolesAjustaveis = ['EXTERNA', 'COORDENADOR']
      } else if (equipe.idEquipe === 'recepcao') {
        novosRolesAjustaveis = equipe.coordenou
          ? ['RECEPCAO', 'COORDENADOR']
          : ['RECEPCAO']
      } else if (equipe.idEquipe === 'tio_secreto') {
        novosRolesAjustaveis = ['TIOSECRETO']
      } else if (equipe.idEquipe === 'tio_aparente') {
        novosRolesAjustaveis = ['TIOAPARENTE']
      } else if (equipe.idEquipe === 'boa_vontade') {
        novosRolesAjustaveis = equipe.coordenou ? ['BV', 'COORDENADOR'] : ['BV']
      } else if (equipe.coordenou) {
        novosRolesAjustaveis = ['COORDENADOR']
      }

      const novoRoles = [
        ...new Set([...rolesPreservados, ...novosRolesAjustaveis]),
      ]

      await prisma.pessoa.update({
        where: { id: pessoa.id },
        data: { roles: { set: novoRoles } },
      })
    }),
  )

  const [
    apresentacao,
    secretaria,
    externa,
    recepcao,
    coordenador,
    tiosSecretos,
    tiosAparentes,
    bvs,
  ] = await Promise.all([
    prisma.pessoa.count({ where: { roles: { has: 'APRESENTACAO' } } }),
    prisma.pessoa.count({ where: { roles: { has: 'SECRETARIA' } } }),
    prisma.pessoa.count({ where: { roles: { has: 'EXTERNA' } } }),
    prisma.pessoa.count({ where: { roles: { has: 'RECEPCAO' } } }),
    prisma.pessoa.count({ where: { roles: { has: 'COORDENADOR' } } }),
    prisma.pessoa.count({ where: { roles: { has: 'TIOSECRETO' } } }),
    prisma.pessoa.count({ where: { roles: { has: 'TIOAPARENTE' } } }),
    prisma.pessoa.count({ where: { roles: { has: 'BV' } } }),
  ])

  return {
    apresentacao,
    secretaria,
    externa,
    recepcao,
    tiosSecretos,
    tiosAparentes,
    bvs,
    coordenador,
  }
}

export async function divulgarMontagem(): Promise<DivulgarMontagem> {
  const resultadoMontagem = await aplicarEquipeMontagem()
  const resultadoRoles = await ajustarRoles()

  return {
    montagem: {
      atualizados: resultadoMontagem?.atualizados || 0,
      deletados: resultadoMontagem?.deletados || 0,
    },
    roles: {
      apresentacao: resultadoRoles?.apresentacao || 0,
      secretaria: resultadoRoles?.secretaria || 0,
      externa: resultadoRoles?.externa || 0,
      recepcao: resultadoRoles?.recepcao || 0,
      tiosSecretos: resultadoRoles?.tiosSecretos || 0,
      tiosAparentes: resultadoRoles?.tiosAparentes || 0,
      bvs: resultadoRoles?.bvs || 0,
      coordenadores: resultadoRoles?.coordenador || 0,
    },
  }
}
