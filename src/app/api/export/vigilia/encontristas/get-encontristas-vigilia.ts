import type { PessoaVigilia } from '../encontreiros/get-encontreios-vigilia'

import { prisma } from '@/lib/prisma'

export interface EncontristaVigilia extends PessoaVigilia {
  círculo: string
}

export async function getEncontristasVigilia(): Promise<EncontristaVigilia[]> {
  const encontristas = await prisma.pessoa.findMany({
    select: {
      nome: true,
      sobrenome: true,
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
    orderBy: [
      {
        encontreiro: {
          circulo: {
            idCorCirculo: 'asc',
          },
        },
      },
      { nome: 'asc' },
    ],
  })

  const parsedEncontristas: EncontristaVigilia[] = encontristas.map(
    (encontrista) => {
      return {
        nome: `${encontrista.nome} ${encontrista.sobrenome}`,
        círculo:
          encontrista.encontreiro?.circulo?.corCirculo.cor || 'Não alocado',
      }
    },
  )

  return parsedEncontristas
}
