import { getCurrentEncontro } from '@/app/api/encontro/atual/[ignorar]/get-current-encontro/get-current-encontro'
import { prisma } from '@/lib/prisma'

export interface PessoaVigilia {
  nome: string
}

export async function getEncontreirosVigilia(): Promise<PessoaVigilia[]> {
  const currentEncontro = await getCurrentEncontro()

  const encontreiros = currentEncontro
    ? await prisma.equipeEncontro.findMany({
        select: {
          encontreiro: {
            select: {
              pessoa: {
                select: {
                  nome: true,
                  sobrenome: true,
                },
              },
            },
          },
        },
        where: {
          idEncontro: currentEncontro.id,
        },
        orderBy: {
          encontreiro: {
            pessoa: {
              nome: 'asc',
            },
          },
        },
      })
    : []

  const parsedEncontreiros: PessoaVigilia[] = encontreiros.map(
    (encontreiro) => {
      return {
        nome: `${encontreiro.encontreiro.pessoa.nome} ${encontreiro.encontreiro.pessoa.sobrenome}`,
      }
    },
  )

  return parsedEncontreiros
}
