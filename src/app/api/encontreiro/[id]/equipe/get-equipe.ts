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

export interface MinhaEquipe {
  idEquipe: string
  equipeLabel: string
  pastaUrl: string
  encontreiros: EncontreiroEmEquipe[]
}

export async function getEquipe(id: string) {
  const encontro = await getCurrentEncontro()

  if (!encontro) return null

  const equipe = await prisma.equipeEncontro.findUnique({
    select: {
      idEquipe: true,
      equipe: {
        select: {
          pastaUrl: true,
          equipeLabel: true,
        },
      },
    },
    where: {
      idPessoa_idEncontro: {
        idEncontro: encontro.id,
        idPessoa: id,
      },
    },
  })

  if (!equipe) return null

  const selectEquipe: Prisma.EquipeEncontroWhereInput = idPertenceARosa(
    equipe.idEquipe,
  )
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
    : idPertenceASala(equipe.idEquipe)
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
          idEquipe: equipe.idEquipe,
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
  const equipeData: MinhaEquipe = {
    idEquipe: equipe.idEquipe,
    equipeLabel: equipe.equipe.equipeLabel,
    pastaUrl: equipe.equipe.pastaUrl!,
    encontreiros,
  }
  return equipeData
}
