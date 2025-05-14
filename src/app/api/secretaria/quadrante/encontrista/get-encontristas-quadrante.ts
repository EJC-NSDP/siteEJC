import type { CirculoQuadrante, EncontristaQuadrante } from '@/@types/quadrante'
import { prisma } from '@/lib/prisma'
import { getCurrentEncontro } from '@/utils/fetch-this-encontro'
import { dateToString } from '@/utils/string-to-date'

export async function getEncontristasQuadrante(): Promise<CirculoQuadrante[]> {
  const encontro = await getCurrentEncontro()
  if (!encontro) return []

  const circulos = await prisma.circulo.findMany({
    where: {
      idEncontro: encontro.id,
    },
    orderBy: {
      corCirculo: {
        cor: 'asc',
      },
    },
    select: {
      corCirculo: {
        select: {
          cor: true,
        },
      },
      tioAparente: {
        select: {
          nome: true,
          sobrenome: true,
          apelido: true,
          celular: true,
          encontreiro: {
            select: {
              dataNasc: true,
              instagram: true,
              encontro: {
                select: {
                  numeroEncontro: true,
                },
              },
            },
          },
          endereco: {
            select: {
              bairro: true,
            },
          },
        },
      },
      tioSecreto: {
        select: {
          nome: true,
          sobrenome: true,
          apelido: true,
          celular: true,
          encontreiro: {
            select: {
              dataNasc: true,
              instagram: true,
              encontro: {
                select: {
                  numeroEncontro: true,
                },
              },
            },
          },
          endereco: {
            select: {
              bairro: true,
            },
          },
        },
      },
      encontreiro: {
        orderBy: [
          { pessoa: { nome: 'asc' } },
          { pessoa: { sobrenome: 'asc' } },
        ],
        select: {
          dataNasc: true,
          instagram: true,
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
            },
          },
        },
      },
    },
  })

  return circulos.map((circulo) => {
    const sobrinhos: EncontristaQuadrante[] = circulo.encontreiro.map(
      (encontrista) => ({
        nome: `${encontrista.pessoa.nome} ${encontrista.pessoa.sobrenome}`,
        apelido: encontrista.pessoa.apelido || '-',
        celular: encontrista.pessoa.celular,
        bairro: encontrista.pessoa.endereco.bairro,
        instagram: encontrista.instagram || '-',
        dataNasc: dateToString(encontrista.dataNasc),
        coord: false,
      }),
    )

    return {
      cor: circulo.corCirculo.cor,
      cartazUrl: '',
      integrantes: [
        {
          nome: circulo.tioAparente
            ? `${circulo.tioAparente.nome} ${circulo.tioAparente.sobrenome}`
            : '',
          apelido: circulo.tioAparente?.apelido || '-',
          dataNasc: circulo.tioAparente?.encontreiro
            ? dateToString(circulo.tioAparente.encontreiro.dataNasc)
            : '-',
          celular: circulo.tioAparente?.celular || '-',
          bairro: circulo.tioAparente?.endereco.bairro || '-',
          instagram: circulo.tioAparente?.encontreiro?.instagram || '-',
          coord: true,
        },
        {
          nome: circulo.tioSecreto
            ? `${circulo.tioSecreto.nome} ${circulo.tioSecreto.sobrenome}`
            : '',
          apelido: circulo.tioSecreto?.apelido || '-',
          dataNasc: circulo.tioSecreto?.encontreiro
            ? dateToString(circulo.tioSecreto.encontreiro.dataNasc)
            : '-',
          celular: circulo.tioSecreto?.celular || '-',
          bairro: circulo.tioSecreto?.endereco.bairro || '-',
          instagram: circulo.tioSecreto?.encontreiro?.instagram || '-',
          coord: true,
        },
        ...sobrinhos,
      ],
    }
  })
}
