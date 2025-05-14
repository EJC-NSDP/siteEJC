import type {
  EncontreiroQuadrante,
  EquipeBPsQuadrante,
} from '@/@types/quadrante'
import { prisma } from '@/lib/prisma'

export async function getBonsPastoresQuadrante(): Promise<EquipeBPsQuadrante | null> {
  const currentYear = new Date().getFullYear()

  const equipe = await prisma.domainEquipes.findUnique({
    select: {
      equipeLabel: true,
      equipeValue: true,
      description: true,
    },
    where: {
      equipeValue: 'bom_pastor',
    },
  })

  if (!equipe) return null

  const encontreiros = await prisma.lideranca.findMany({
    where: {
      ano: currentYear,
      idFuncao: 'bp',
    },
    orderBy: { pessoa: { nome: 'asc' } },

    select: {
      pessoa: {
        select: {
          nome: true,
          sobrenome: true,
          apelido: true,
          celular: true,
          endereco: {
            select: {
              bairro: true,
            },
          },
          encontreiro: {
            select: {
              instagram: true,
              encontro: {
                select: {
                  numeroEncontro: true,
                },
              },
            },
          },
        },
      },
    },
  })

  const integrantes: EncontreiroQuadrante[] = encontreiros.map(
    (encontreiro) => {
      return {
        nome: `${encontreiro.pessoa.nome} ${encontreiro.pessoa.sobrenome}`,
        apelido: encontreiro.pessoa.apelido || '-',
        celular: encontreiro.pessoa.celular,
        bairro: encontreiro.pessoa.endereco.bairro,
        instagram: encontreiro.pessoa.encontreiro?.instagram || '-',
        encontro:
          encontreiro.pessoa.encontreiro?.encontro?.numeroEncontro.toString() ||
          '?',
        equipe: 'BP',
        coord: true,
      }
    },
  )

  return {
    nome: equipe.equipeLabel,
    descricao: equipe.description || '',
    integrantes,
  }
}
