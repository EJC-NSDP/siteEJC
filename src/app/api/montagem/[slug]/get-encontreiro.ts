import type { StatusEncontreiro } from '@/enums'
import { prisma } from '@/lib/prisma'

export type EncontreiroMontagemData = {
  id: string
  nome: string
  instagram: string | null
  slug: string
  apelido: string | null
  bairro: string
  avatarUrl?: string
  numeroEncontro?: number
  corCirculo?: string
  obsBanda?: string
  disponibilidade?: string
  fichaAtualizadaEm?: Date | null
  obs?: string
  preferencias: { posicao: number; equipe: string }[] | []
  equipeEncontro:
    | { encontro: number; equipe: string; coordenou: boolean }[]
    | []
  nuncaFoi: string[]
  statusMontagem: StatusEncontreiro | null
}

export async function getEncontreiroMontagem(slug: string) {
  const encontreiro = await prisma.pessoa.findFirst({
    select: {
      id: true,
      nome: true,
      sobrenome: true,
      slug: true,
      apelido: true,
      endereco: {
        select: {
          bairro: true,
        },
      },
      avatarUrl: true,
      encontreiro: {
        select: {
          instagram: true,
          disponibilidade: true,
          fichaAtualizadaEm: true,
          obsBanda: true,
          observacoes: true,
          statusMontagem: true,
          equipeMontagem: {
            select: {
              coordenando: true,
              valueEquipe: true,
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
          },
          equipeEncontro: {
            select: {
              idEquipe: true,
              encontro: {
                select: {
                  numeroEncontro: true,
                },
              },
              coordenou: true,
              equipe: {
                select: {
                  equipeLabel: true,
                },
              },
            },
          },
          encontro: {
            select: {
              numeroEncontro: true,
            },
          },
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
      slug,
    },
  })

  if (!encontreiro) {
    return null
  }

  const preferencias =
    encontreiro.encontreiro && encontreiro.encontreiro.listaPreferencias
      ? encontreiro.encontreiro.listaPreferencias.map((preferencia) => {
          return {
            posicao: preferencia.posicao,
            equipe: preferencia.equipe.equipeLabel,
          }
        })
      : []

  const equipeEncontro = encontreiro.encontreiro
    ? encontreiro.encontreiro.equipeEncontro.map((equipe) => {
        return {
          encontro: equipe.encontro.numeroEncontro,
          equipe: equipe.equipe.equipeLabel,
          coordenou: equipe.coordenou,
        }
      })
    : []

  const preferenciasOrdenadas = preferencias.sort(
    (a, b) => a.posicao - b.posicao,
  )

  const equipeEncontroOrdenado = equipeEncontro.sort(
    (a, b) => b.encontro - a.encontro,
  )

  const TIO_EQUIPES = new Set(['tio_circulo', 'tio_secreto', 'tio_aparente'])

  const NON_ENCOUNTER_EQUIPES = new Set([
    'nao_participara',
    '0',
    'tio_externa',
    'palestrante',
    'pastoral',
    'bom_pastor',
    'dirigente',
    ...TIO_EQUIPES,
  ])

  const todasEquipes = await prisma.domainEquipes.findMany({
    select: { equipeValue: true, equipeLabel: true },
    where: { equipeValue: { notIn: [...NON_ENCOUNTER_EQUIPES] } },
  })

  const equipesParticipadas = new Set(
    encontreiro.encontreiro?.equipeEncontro.map((e) => e.idEquipe) ?? [],
  )

  const nuncaFoi = todasEquipes
    .filter((e) => !equipesParticipadas.has(e.equipeValue))
    .map((e) => e.equipeLabel)

  const foiTio = [...TIO_EQUIPES].some((v) => equipesParticipadas.has(v))
  if (!foiTio) {
    nuncaFoi.push('Tio de Círculo')
  }

  nuncaFoi.sort((a, b) => a.localeCompare(b, 'pt-BR'))

  const encontreiroMontagemResponse: EncontreiroMontagemData = {
    id: encontreiro.id,
    nome: [encontreiro.nome, encontreiro.sobrenome].filter(Boolean).join(' '),
    instagram: encontreiro.encontreiro && encontreiro.encontreiro.instagram,
    slug: encontreiro.slug,
    apelido: encontreiro.apelido,
    bairro: encontreiro.endereco.bairro,
    avatarUrl: encontreiro.avatarUrl ? encontreiro.avatarUrl : undefined,
    numeroEncontro: encontreiro.encontreiro?.encontro?.numeroEncontro
      ? encontreiro.encontreiro?.encontro?.numeroEncontro
      : undefined,
    corCirculo: encontreiro.encontreiro?.circulo?.corCirculo.cor,
    disponibilidade:
      encontreiro.encontreiro && encontreiro.encontreiro.disponibilidade
        ? encontreiro.encontreiro.disponibilidade.id
        : undefined,
    obs:
      encontreiro.encontreiro && encontreiro.encontreiro.observacoes
        ? encontreiro.encontreiro.observacoes
        : undefined,
    obsBanda:
      encontreiro.encontreiro && encontreiro.encontreiro.obsBanda
        ? encontreiro.encontreiro.obsBanda
        : undefined,
    fichaAtualizadaEm: encontreiro.encontreiro?.fichaAtualizadaEm ?? null,
    preferencias: preferenciasOrdenadas,
    equipeEncontro: equipeEncontroOrdenado,
    nuncaFoi,
    statusMontagem:
      encontreiro.encontreiro && encontreiro.encontreiro.statusMontagem,
  }

  return encontreiroMontagemResponse
}
