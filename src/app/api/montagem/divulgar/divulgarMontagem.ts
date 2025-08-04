import { prisma } from '@/lib/prisma'
import { getCurrentEncontro } from '../../encontro/atual/[ignorar]/get-current-encontro/get-current-encontro'

export interface DivulgarMontagem {
  montagem: {
    atualizados: number
    deletados: number
  }
  roles: {
    secretaria: number
    externa: number
    tiosSecretos: number
    coordenadores: number
  }
}

async function aplicarEquipeMontagem() {
  const currentEncontro = await getCurrentEncontro()
  const equipeMontagem = await prisma.equipeMontagem.findMany()
  const dirigentes = await prisma.pessoa.findMany({
    where: {
      role: 'DIRIGENTE',
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

async function ajustarRoles() {
  const currentEncontro = await getCurrentEncontro()
  if (!currentEncontro) return null
  const equipeEncontro = await prisma.equipeEncontro.findMany({
    where: {
      idEncontro: currentEncontro.id,
    },
  })
  equipeEncontro.forEach(async (encontreiro) => {
    if (encontreiro.idPessoa === 'a1f70688-c397-43ff-bfe5-4e7d3af73be0') {
      await prisma.pessoa.update({
        where: {
          id: encontreiro.idPessoa,
        },
        data: {
          role: 'ADMIN',
        },
      })
    } else if (encontreiro.idEquipe === 'secretaria' && encontreiro.coordenou) {
      await prisma.pessoa.update({
        where: {
          id: encontreiro.idPessoa,
        },
        data: {
          role: 'SECRETARIA',
        },
      })
    } else if (encontreiro.idEquipe === 'externa') {
      await prisma.pessoa.update({
        where: {
          id: encontreiro.idPessoa,
        },
        data: {
          role: 'EXTERNA',
        },
      })
    } else if (encontreiro.idEquipe === 'dirigente') {
      await prisma.pessoa.update({
        where: {
          id: encontreiro.idPessoa,
        },
        data: {
          role: 'DIRIGENTE',
        },
      })
    } else if (encontreiro.idEquipe === 'tio_secreto') {
      await prisma.pessoa.update({
        where: {
          id: encontreiro.idPessoa,
        },
        data: {
          role: 'TIOSECRETO',
        },
      })
    } else if (encontreiro.coordenou) {
      await prisma.pessoa.update({
        where: {
          id: encontreiro.idPessoa,
        },
        data: {
          role: 'COORDENADOR',
        },
      })
    } else {
      await prisma.pessoa.update({
        where: {
          id: encontreiro.idPessoa,
        },
        data: {
          role: 'ENCONTREIRO',
        },
      })
    }
  })

  const secretaria = await prisma.pessoa.count({
    where: {
      role: 'SECRETARIA',
    },
  })

  const externa = await prisma.pessoa.count({
    where: {
      role: 'EXTERNA',
    },
  })

  const coordenador = await prisma.pessoa.count({
    where: {
      role: 'COORDENADOR',
    },
  })

  const tiosSecretos = await prisma.pessoa.count({
    where: {
      role: 'TIOSECRETO',
    },
  })

  return {
    secretaria,
    externa,
    tiosSecretos,
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
      secretaria: resultadoRoles?.secretaria || 0,
      externa: resultadoRoles?.externa || 0,
      tiosSecretos: resultadoRoles?.tiosSecretos || 0,
      coordenadores: resultadoRoles?.coordenador || 0,
    },
  }
}
