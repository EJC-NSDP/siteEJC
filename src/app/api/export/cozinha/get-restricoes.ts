import { prisma } from '@/lib/prisma'
import { getCurrentEncontro } from '../../encontro/atual/[ignorar]/get-current-encontro/get-current-encontro'

export interface PessoaRestricao {
  nome: string
  apelido: string | null
  restricaoAlimentar: string
  equipe: string
}

export async function getRestricoes(): Promise<PessoaRestricao[]> {
  const currentEncontro = await getCurrentEncontro()
  const encontristas = await prisma.pessoa.findMany({
    select: {
      nome: true,
      sobrenome: true,
      apelido: true,
      encontreiro: {
        select: {
          restricaoAlimentar: true,
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
    orderBy: {
      nome: 'asc',
    },
  })

  const encontreiros = currentEncontro
    ? await prisma.equipeEncontro.findMany({
        select: {
          encontreiro: {
            select: {
              restricaoAlimentar: true,
              pessoa: {
                select: {
                  nome: true,
                  sobrenome: true,
                  apelido: true,
                },
              },
            },
          },

          equipe: {
            select: {
              equipeLabel: true,
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

  const parsedEncontristas: PessoaRestricao[] = encontristas.map(
    (encontrista) => {
      const corCirculo =
        encontrista.encontreiro?.circulo?.corCirculo.cor || 'Não alocado'
      return {
        nome: `${encontrista.nome} ${encontrista.sobrenome}`,
        apelido: encontrista.apelido,
        equipe: `Encontrista - ${corCirculo}`,
        restricaoAlimentar: encontrista.encontreiro?.restricaoAlimentar || '',
      }
    },
  )

  const parsedEncontreiros: PessoaRestricao[] = encontreiros.map(
    (encontreiro) => {
      return {
        nome: `${encontreiro.encontreiro.pessoa.nome} ${encontreiro.encontreiro.pessoa.sobrenome}`,
        apelido: encontreiro.encontreiro.pessoa.apelido,
        equipe: encontreiro.equipe.equipeLabel,
        restricaoAlimentar: encontreiro.encontreiro.restricaoAlimentar || '',
      }
    },
  )

  const parsedData: PessoaRestricao[] = [
    ...parsedEncontristas,
    ...parsedEncontreiros,
  ]

  return parsedData
}
