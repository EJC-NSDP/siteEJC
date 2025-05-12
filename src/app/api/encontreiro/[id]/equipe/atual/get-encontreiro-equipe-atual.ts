import { getCurrentEncontro } from '@/app/api/encontro/atual/[ignorar]/get-current-encontro/get-current-encontro'
import { prisma } from '@/lib/prisma'

export interface EncontreiroEquipeAtual {
  id: string
  nome: string
  sobrenome: string
  apelido: string | null
  equipe: {
    value: string
    label: string
  }
}

export async function getEncontreiroEquipeAtual(
  id: string,
): Promise<EncontreiroEquipeAtual | null> {
  const encontro = await getCurrentEncontro()

  if (!encontro) return null

  const pessoa = await prisma.equipeEncontro.findUnique({
    select: {
      encontreiro: {
        select: {
          pessoa: {
            select: {
              id: true,
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
          equipeValue: true,
        },
      },
    },
    where: {
      idPessoa_idEncontro: {
        idPessoa: id,
        idEncontro: encontro.id,
      },
    },
  })

  if (!pessoa) return null

  return {
    id: pessoa.encontreiro.pessoa.id,
    nome: pessoa.encontreiro.pessoa.nome,
    sobrenome: pessoa.encontreiro.pessoa.sobrenome,
    apelido: pessoa.encontreiro.pessoa.apelido,
    equipe: {
      label: pessoa.equipe.equipeLabel,
      value: pessoa.equipe.equipeValue,
    },
  }
}
