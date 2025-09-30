import { prisma } from '@/lib/prisma'

export type CartaSummaryData = {
  id: string
  corLabel: string
  slug: string
  nome: string
  sobrenome: string
  cartasFisicas: number
  cartasVirtuaisTotais: number
  cartasVirtuaisImpressas: number
  tiosExterna: string | null
  categorias: {
    family: number
    companion: number
    friend: number
    other: number
  }
}

export type CartaSummary = {
  pageIndex: number
  totalCount: number
  perPage: number
  encontristas: CartaSummaryData[]
}

type getCartaSummaryProps = {
  page: number
  encontristaName: string | null
}

type getCartaProps = {
  page: number
  perPage: number
  encontristaName: string | null
}

type getTotalEncontristasProps = {
  encontristaName: string | null
}

async function getCartas({ page, perPage, encontristaName }: getCartaProps) {
  const skipData = page * perPage

  if (encontristaName) {
    return await prisma.pessoa.findMany({
      skip: skipData,
      take: perPage,
      select: {
        id: true,
        slug: true,
        nome: true,
        sobrenome: true,
        cartasDigitais: true,
        encontrista: {
          select: {
            cartasFisicas: true,
            carroEncontro: {
              select: {
                carro: {
                  select: {
                    pessoaMotorista: {
                      select: {
                        nome: true,
                        apelido: true,
                      },
                    },
                    pessoaCarona: {
                      select: {
                        nome: true,
                        apelido: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        encontreiro: {
          select: {
            circulo: {
              select: {
                corCirculo: {
                  select: {
                    cor: true,
                  },
                },
              },
            },
          },
        },
      },
      where: {
        role: 'ENCONTRISTA',
        OR: [
          { nome: { contains: encontristaName } },
          { sobrenome: { contains: encontristaName } },
        ],
        encontrista: {
          OR: [
            { idStatus: 'confirmado' },
            { idStatus: 'confirmado_sem_sexta' },
          ],
        },
      },
      orderBy: {
        nome: 'asc',
      },
    })
  }

  return await prisma.pessoa.findMany({
    skip: skipData,
    take: perPage,
    select: {
      id: true,
      slug: true,
      nome: true,
      sobrenome: true,
      cartasDigitais: true,
      encontrista: {
        select: {
          cartasFisicas: true,
          carroEncontro: {
            select: {
              carro: {
                select: {
                  pessoaMotorista: {
                    select: {
                      nome: true,
                      apelido: true,
                    },
                  },
                  pessoaCarona: {
                    select: {
                      nome: true,
                      apelido: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      encontreiro: {
        select: {
          circulo: {
            select: {
              corCirculo: {
                select: {
                  cor: true,
                },
              },
            },
          },
        },
      },
    },
    where: {
      role: 'ENCONTRISTA',
      encontrista: {
        OR: [{ idStatus: 'confirmado' }, { idStatus: 'confirmado_sem_sexta' }],
      },
    },
    orderBy: {
      nome: 'asc',
    },
  })
}

async function getTotal({ encontristaName }: getTotalEncontristasProps) {
  if (encontristaName) {
    return await prisma.pessoa.count({
      where: {
        role: 'ENCONTRISTA',
        OR: [
          { nome: { contains: encontristaName } },
          { sobrenome: { contains: encontristaName } },
        ],
        encontrista: {
          OR: [
            { idStatus: 'confirmado' },
            { idStatus: 'confirmado_sem_sexta' },
          ],
        },
      },
    })
  }

  return await prisma.pessoa.count({
    where: {
      role: 'ENCONTRISTA',
      encontrista: {
        OR: [{ idStatus: 'confirmado' }, { idStatus: 'confirmado_sem_sexta' }],
      },
    },
  })
}

export async function getMensagensSummary({
  page,
  encontristaName,
}: getCartaSummaryProps) {
  const mensagensResponse: CartaSummaryData[] = []
  const perPage = 25

  const totalEncontrista = await getTotal({
    encontristaName,
  })

  const cartasEncontristas = await getCartas({
    page,
    perPage,
    encontristaName,
  })

  if (!cartasEncontristas) {
    return null
  }

  await Promise.all(
    cartasEncontristas.map(async (encontrista) => {
      const cartasImpressas = encontrista.cartasDigitais.filter(
        (carta) => carta.isPrinted,
      )
      const tioExterna = encontrista.encontrista?.carroEncontro
        ? encontrista.encontrista.carroEncontro.carro.pessoaCarona
          ? `${encontrista.encontrista.carroEncontro.carro.pessoaMotorista.apelido || encontrista.encontrista.carroEncontro.carro.pessoaMotorista.nome} e ${encontrista.encontrista.carroEncontro.carro.pessoaCarona.apelido || encontrista.encontrista.carroEncontro.carro.pessoaCarona.nome}`
          : encontrista.encontrista.carroEncontro.carro.pessoaMotorista
              .apelido ||
            encontrista.encontrista.carroEncontro.carro.pessoaMotorista.nome
        : 'Ainda sem carro'
      const cartaResponse: CartaSummaryData = {
        id: encontrista.id,
        slug: encontrista.slug,
        nome: encontrista.nome,
        sobrenome: encontrista.sobrenome,
        cartasFisicas: encontrista.encontrista?.cartasFisicas
          ? encontrista.encontrista.cartasFisicas
          : 0,
        cartasVirtuaisTotais: encontrista.cartasDigitais.length,
        cartasVirtuaisImpressas: cartasImpressas.length,
        corLabel:
          encontrista.encontreiro!.circulo?.corCirculo.cor || 'Não alocado',
        tiosExterna: tioExterna,
        categorias: {
          family: encontrista.cartasDigitais.filter(
            (carta) => carta.idCategoria === 'familia',
          ).length,
          companion: encontrista.cartasDigitais.filter(
            (carta) => carta.idCategoria === 'companheiro',
          ).length,
          friend: encontrista.cartasDigitais.filter(
            (carta) => carta.idCategoria === 'amigo',
          ).length,
          other: encontrista.cartasDigitais.filter(
            (carta) => carta.idCategoria === 'outro',
          ).length,
        },
      }
      mensagensResponse.push(cartaResponse)
      return cartaResponse
    }),
  )
  const response: CartaSummary = {
    totalCount: totalEncontrista,
    pageIndex: page + 1,
    perPage,
    encontristas: mensagensResponse,
  }

  return response
}
