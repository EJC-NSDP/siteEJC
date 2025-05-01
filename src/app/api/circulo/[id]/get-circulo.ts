import type { CirculoFormData } from '@/@types/circulo'
import { prisma } from '@/lib/prisma'

export async function getCirculo(id: string): Promise<CirculoFormData | null> {
  const circulo = await prisma.circulo.findUnique({
    select: {
      id: true,
      nome: true,
      encontro: {
        select: {
          id: true,
          numeroEncontro: true,
        },
      },
      corCirculo: {
        select: {
          cor: true,
        },
      },
      tioAparente: {
        select: {
          id: true,
          nome: true,
          sobrenome: true,
          apelido: true,
          encontreiro: {
            select: {
              encontro: {
                select: {
                  numeroEncontro: true,
                },
              },
            },
          },
        },
      },
      tioSecreto: {
        select: {
          id: true,
          nome: true,
          sobrenome: true,
          apelido: true,
          encontreiro: {
            select: {
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
    where: {
      id,
    },
  })

  if (!circulo) return null

  return {
    id: circulo.id,
    idEncontro: circulo.encontro.id,
    nome: circulo.nome,
    corCirculo: circulo.corCirculo.cor,
    tioAparente: circulo.tioAparente
      ? {
          id: circulo.tioAparente.id,
          numeroEncontro:
            circulo.tioAparente.encontreiro?.encontro?.numeroEncontro.toString() ||
            '0',
          nome: `${circulo.tioAparente.nome} ${circulo.tioAparente.sobrenome} `,
        }
      : null,
    tioSecreto: circulo.tioSecreto
      ? {
          id: circulo.tioSecreto.id,
          numeroEncontro:
            circulo.tioSecreto.encontreiro?.encontro?.numeroEncontro.toString() ||
            '0',
          nome: `${circulo.tioSecreto.nome} ${circulo.tioSecreto.sobrenome} `,
        }
      : null,
  }
}
