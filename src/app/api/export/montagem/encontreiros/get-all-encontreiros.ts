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

function fetchPreferencia(
  listaPreferencias: {
    equipe: { equipeLabel: string }
    posicao: number
  }[],
  posicaoAlvo: number,
): string {
  const item = listaPreferencias.find((item) => item.posicao === posicaoAlvo)
  return item ? item.equipe.equipeLabel : ''
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
          disponibilidade: {
            select: {
              disponibilidade: true,
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

    const preferencia1 = encontreiro.encontreiro
      ? fetchPreferencia(encontreiro.encontreiro.listaPreferencias, 1)
      : ''
    const preferencia2 = encontreiro.encontreiro
      ? fetchPreferencia(encontreiro.encontreiro.listaPreferencias, 2)
      : ''
    const preferencia3 = encontreiro.encontreiro
      ? fetchPreferencia(encontreiro.encontreiro.listaPreferencias, 3)
      : ''

    return {
      nomeCompleto: `${encontreiro.nome} ${encontreiro.sobrenome}`,
      apelido: encontreiro.apelido,
      celular: encontreiro.celular,
      instagram: encontreiro.encontreiro?.instagram || '',
      bairro: encontreiro.endereco.bairro,
      equipes: ultimasEquipes,
      preferencia1,
      preferencia2,
      preferencia3,
      disponibilidae:
        encontreiro.encontreiro?.disponibilidade?.disponibilidade ||
        'Não Preencheu',
      observações: encontreiro.encontreiro?.observacoes || '',
      banda: encontreiro.encontreiro?.obsBanda || '',
    }
  })
  return parsedData
}
