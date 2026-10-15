import {
  getZona,
  type BairroResponse,
} from '@/app/api/domains/bairrosRJ/zona/[bairro]/get-zona'
import { prisma } from '@/lib/prisma'

import { getCurrentEncontro } from '../get-current-encontro/get-current-encontro'

export interface CardEncontristaResponse {
  id: string
  nome: string
  dataNasc: Date
  bairro: string
  rua: string
  endNumero: number | null
  endComplemento: string | null
  zona: string | null
  idCirculo: string | null
  corCirculo: string | null
  idCarro: string | null
}

export async function getConfirmadosCard() {
  const encontro = await getCurrentEncontro()

  if (!encontro) {
    return null
  }
  const encontristas = await prisma.pessoa.findMany({
    select: {
      id: true,
      nome: true,
      sobrenome: true,

      encontreiro: {
        select: {
          dataNasc: true,
          idCirculo: true,
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
      encontrista: {
        select: {
          enderecoEncontro: {
            select: {
              bairro: true,
              rua: true,
              cidade: true,
              estado: true,
            },
          },
          endNumEncontro: true,
          endComplementoEncontro: true,
          idCarroEncontro: true,
        },
      },
    },
    where: {
      OR: [
        {
          encontrista: {
            OR: [
              { idStatus: 'confirmado' },
              { idStatus: 'confirmado_sem_sexta' },
            ],
          },
        },
      ],
      encontreiro: {
        encontro: {
          id: encontro.id,
        },
      },
    },
    orderBy: {
      nome: 'asc',
    },
  })

  const response: CardEncontristaResponse[] = await Promise.all(
    encontristas.map(async (encontrista) => {
      const endereco = encontrista.encontrista?.enderecoEncontro
      let zona: string | null = null
      let bairro = endereco?.bairro || 'N/A'
      if (endereco) {
        if (endereco.cidade.trim().toLowerCase() !== 'rio de janeiro') {
          zona = 'fora do rio'
          bairro = `${endereco.cidade} (${endereco.estado})`
        } else {
          const fetchedZona: BairroResponse | null = await getZona(
            endereco.bairro,
          )
          zona = fetchedZona ? fetchedZona.zona : null
        }
      }

      return {
        id: encontrista.id,
        nome: `${encontrista.nome} ${encontrista.sobrenome}`,
        dataNasc: encontrista.encontreiro!.dataNasc,
        bairro,
        zona,
        rua: encontrista.encontrista?.enderecoEncontro?.rua || 'N/A',
        endNumero: encontrista.encontrista!.endNumEncontro,
        endComplemento: encontrista.encontrista!.endComplementoEncontro,
        idCirculo: encontrista.encontreiro!.idCirculo,
        corCirculo: encontrista.encontreiro!.circulo?.corCirculo.cor || null,
        idCarro: encontrista.encontrista?.idCarroEncontro || null,
      }
    }),
  )

  return response
}
