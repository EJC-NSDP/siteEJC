import { prisma } from '@/lib/prisma'

import { getCurrentEncontro } from '../get-current-encontro/get-current-encontro'

export interface TioCirculoType {
  id: string
  nome: string
  dataNasc: Date
  tipo: 'Aparente' | 'Secreto'
}

export interface CirculoEncontro {
  id: string
  idCorCirculo: number
  tioAparente: TioCirculoType | undefined
  tioSecreto: TioCirculoType | undefined
}

export interface CirculosResponse {
  order: number
  circulos: CirculoEncontro[]
}

export async function getCirculos() {
  const encontro = await getCurrentEncontro()

  if (!encontro) return null

  const circulos = await prisma.circulo.findMany({
    select: {
      id: true,
      idCorCirculo: true,
      tioAparente: {
        select: {
          id: true,
          nome: true,
          apelido: true,
          encontreiro: {
            select: {
              dataNasc: true,
            },
          },
        },
      },
      tioSecreto: {
        select: {
          id: true,
          nome: true,
          apelido: true,
          encontreiro: {
            select: {
              dataNasc: true,
            },
          },
        },
      },
    },
    where: {
      idEncontro: encontro.id,
    },
  })

  const infoCirculos: CirculoEncontro[] = circulos.map((circulo) => {
    return {
      id: circulo.id,
      idCorCirculo: circulo.idCorCirculo,
      tioAparente: circulo.tioAparente
        ? {
            id: circulo.tioAparente.id,
            nome: circulo.tioAparente.apelido
              ? circulo.tioAparente.apelido
              : circulo.tioAparente.nome,
            dataNasc: circulo.tioAparente.encontreiro!.dataNasc,
            tipo: 'Aparente',
          }
        : undefined,
      tioSecreto: circulo.tioSecreto
        ? {
            id: circulo.tioSecreto.id,
            nome: circulo.tioSecreto.apelido
              ? circulo.tioSecreto.apelido
              : circulo.tioSecreto.nome,
            dataNasc: circulo.tioSecreto.encontreiro!.dataNasc,
            tipo: 'Secreto',
          }
        : undefined,
    }
  })

  if (infoCirculos.length === 0 && encontro.ordemCirculos > 0) {
    const digits = encontro.ordemCirculos
      .toString()
      .split('')
      .map(Number)
      .filter((n) => n >= 1 && n <= 5)

    const virtualCirculos: CirculoEncontro[] = digits.map((n) => ({
      id: String(n),
      idCorCirculo: n,
      tioAparente: undefined,
      tioSecreto: undefined,
    }))

    return { order: encontro.ordemCirculos, circulos: virtualCirculos }
  }

  const response: CirculosResponse = {
    order: encontro.ordemCirculos,
    circulos: infoCirculos,
  }

  return response
}
