import { getCurrentEncontro } from '@/app/api/encontro/atual/[ignorar]/get-current-encontro/get-current-encontro'
import { prisma } from '@/lib/prisma'
import { idPertenceARosa, idPertenceASala } from '@/utils/pertence'
import { Prisma } from '@prisma/client'

export interface EncontreiroEmEquipe {
  nome: string
  sobrenome: string
  apelido: string | null
  celular: string
  bairro: string
  instagram: string | null
  email: string
  coordena: boolean
  slug: string
  numeroEncontro: number
  fichaPreenchida: boolean
  equipeLabel: string
}

export interface EquipeThisEncontro {
  idEquipe: string
  equipeLabel: string
  pastaUrl: string
  encontreiros: EncontreiroEmEquipe[]
}

export async function getEquipe(value: string) {
  const encontro = await getCurrentEncontro()

  if (!encontro) return null

  const selectEquipe: Prisma.EquipeEncontroWhereInput = idPertenceARosa(value)
    ? {
        idEncontro: encontro.id,
        OR: [
          { idEquipe: 'vigilia' },
          { idEquipe: 'recepcao' },
          { idEquipe: 'compras' },
          { idEquipe: 'externa' },
          { idEquipe: 'meditacao' },
        ],
      }
    : idPertenceASala(value)
      ? {
          idEncontro: encontro.id,
          OR: [
            { idEquipe: 'apresentacao' },
            { idEquipe: 'tio_circulo' },
            { idEquipe: 'tio_aparente' },
            { idEquipe: 'tio_secreto' },
            { idEquipe: 'boa_vontade' },
          ],
        }
      : {
          idEncontro: encontro.id,
          idEquipe: value,
        }

  const equipeEncontreiros = await prisma.equipeEncontro.findMany({
    select: {
      coordenou: true,
      fichaPreenchida: true,
      equipe: {
        select: {
          pastaUrl: true,
          equipeLabel: true,
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
              email: true,
              slug: true,
            },
          },
        },
      },
    },
    where: {
      ...selectEquipe,
    },
    orderBy: [
      {
        coordenou: 'desc',
      },
      {
        equipe: {
          equipeLabel: 'asc',
        },
      },
      {
        encontreiro: {
          pessoa: {
            nome: 'asc',
          },
        },
      },
    ],
  })

  const encontreiros: EncontreiroEmEquipe[] = equipeEncontreiros.map(
    (encontreiro) => {
      return {
        nome: encontreiro.encontreiro.pessoa.nome,
        sobrenome: encontreiro.encontreiro.pessoa.sobrenome,
        apelido: encontreiro.encontreiro.pessoa.apelido,
        celular: encontreiro.encontreiro.pessoa.celular,
        bairro: encontreiro.encontreiro.pessoa.endereco.bairro,
        instagram: encontreiro.encontreiro.instagram,
        email: encontreiro.encontreiro.pessoa.email,
        coordena: encontreiro.coordenou,
        slug: encontreiro.encontreiro.pessoa.slug,
        numeroEncontro: encontreiro.encontreiro.encontro?.numeroEncontro || 0,
        fichaPreenchida: encontreiro.fichaPreenchida,
        equipeLabel: encontreiro.equipe.equipeLabel,
      }
    },
  )

  const equipeLabel = idPertenceARosa(value)
    ? 'Rosa'
    : idPertenceASala(value)
      ? 'Sala'
      : equipeEncontreiros[0].equipe.equipeLabel

  const equipeData: EquipeThisEncontro = {
    idEquipe: value,
    equipeLabel,
    pastaUrl: equipeEncontreiros[0].equipe.pastaUrl!,
    encontreiros,
  }
  return equipeData
}
