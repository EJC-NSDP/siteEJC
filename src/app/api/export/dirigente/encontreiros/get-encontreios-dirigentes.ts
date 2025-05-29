import { getCurrentEncontro } from '@/app/api/encontro/atual/[ignorar]/get-current-encontro/get-current-encontro'
import { prisma } from '@/lib/prisma'

export interface EncontreiroDirigentes {
  nome: string
  apelido: string
  encontro: string
  celular: string
  equipe: string
  coordenador: string
  fichaPreenchida: string
}

export async function getEncontreirosDirigentes(): Promise<
  EncontreiroDirigentes[]
> {
  const currentEncontro = await getCurrentEncontro()

  const encontreiros = currentEncontro
    ? await prisma.equipeEncontro.findMany({
        select: {
          coordenou: true,
          fichaPreenchida: true,
          equipe: {
            select: {
              equipeLabel: true,
            },
          },
          encontreiro: {
            select: {
              pessoa: {
                select: {
                  nome: true,
                  sobrenome: true,
                  apelido: true,
                  celular: true,
                },
              },
              encontro: {
                select: {
                  numeroEncontro: true,
                },
              },
            },
          },
        },
        where: {
          idEncontro: currentEncontro.id,
        },
        orderBy: [
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
    : []

  const parsedEncontreiros: EncontreiroDirigentes[] = encontreiros.map(
    (encontreiro) => {
      return {
        nome: `${encontreiro.encontreiro.pessoa.nome} ${encontreiro.encontreiro.pessoa.sobrenome}`,
        apelido: encontreiro.encontreiro.pessoa.apelido || '',
        celular: encontreiro.encontreiro.pessoa.celular,
        encontro:
          encontreiro.encontreiro.encontro?.numeroEncontro.toString() || '?',
        equipe: encontreiro.equipe.equipeLabel,
        coordenador: encontreiro.coordenou ? 'Coordenador(a)' : 'Tropa',
        fichaPreenchida: encontreiro.fichaPreenchida ? 'Sim' : 'Não',
      }
    },
  )

  return parsedEncontreiros
}
