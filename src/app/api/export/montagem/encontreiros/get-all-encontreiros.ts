import { prisma } from '@/lib/prisma'

function formatarEquipeEncontro(
  equipeEncontro: {
    encontro: { numeroEncontro: number }
    coordenou: boolean
    equipe: { equipeLabel: string }
  }[],
): string {
  return equipeEncontro
    .map((item) => {
      const numero = item.encontro.numeroEncontro
      const label = item.equipe.equipeLabel
      const coordenou = item.coordenou ? ' (C)' : ''
      return `${numero} - ${label}${coordenou}`
    })
    .join(', ')
}

function formatarListaPreferencias(
  listaPreferencias: {
    equipe: { equipeLabel: string }
    posicao: number
  }[],
): string {
  return listaPreferencias
    .map((item) => {
      return `${item.posicao} - ${item.equipe.equipeLabel}`
    })
    .join(', ')
}

export async function getAllEncontreiros() {
  const encontreiros = await prisma.pessoa.findMany({
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
          equipeEncontro: {
            select: {
              coordenou: true,
              equipe: {
                select: {
                  equipeLabel: true,
                },
              },
              encontro: {
                select: {
                  numeroEncontro: true,
                },
              },
            },
            orderBy: {
              encontro: {
                numeroEncontro: 'desc',
              },
            },
          },
          listaPreferencias: {
            select: {
              posicao: true,
              equipe: {
                select: {
                  equipeLabel: true,
                },
              },
            },
            orderBy: {
              posicao: 'asc',
            },
          },
          observacoes: true,
          obsBanda: true,
        },
      },
    },
    where: {
      NOT: {
        OR: [{ role: 'ENCONTRISTA' }, { role: 'TIOEXTERNA' }],
      },
      encontreiro: {
        NOT: { statusMontagem: 'INATIVO' },
      },
    },
  })

  const parsedData = encontreiros.map((encontreiro) => {
    const ultimasEquipes = encontreiro.encontreiro
      ? formatarEquipeEncontro(encontreiro.encontreiro.equipeEncontro)
      : ''
    const listaPreferencias = encontreiro.encontreiro
      ? formatarListaPreferencias(encontreiro.encontreiro.listaPreferencias)
      : ''

    return {
      nomeCompleto: `${encontreiro.nome} ${encontreiro.sobrenome}`,
      apelido: encontreiro.apelido,
      celular: encontreiro.celular,
      instagram: encontreiro.encontreiro?.instagram || '',
      bairro: encontreiro.endereco.bairro,
      equipes: ultimasEquipes,
      preferencias: listaPreferencias,
      observações: encontreiro.encontreiro?.observacoes || '',
      banda: encontreiro.encontreiro?.obsBanda || '',
    }
  })
  return parsedData
}
