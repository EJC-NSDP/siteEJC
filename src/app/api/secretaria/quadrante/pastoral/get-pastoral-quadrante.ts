import type {
  EquipePastoraisQuadrante,
  PastoralQuadrante,
} from '@/@types/quadrante'
import { prisma } from '@/lib/prisma'

export async function getPastoraisQuadrante(): Promise<EquipePastoraisQuadrante | null> {
  const currentYear = new Date().getFullYear()

  const equipe = await prisma.domainEquipes.findUnique({
    select: {
      equipeLabel: true,
      equipeValue: true,
      description: true,
    },
    where: {
      equipeValue: 'pastoral',
    },
  })

  if (!equipe) return null

  const funcoes = await prisma.domainFuncoes.findMany({
    where: {
      NOT: [{ id: 'bp' }, { id: 'dirigente' }],
    },
  })

  const encontreiros = await prisma.lideranca.findMany({
    where: {
      ano: currentYear,
      NOT: [{ idFuncao: 'bp' }, { idFuncao: 'dirigente' }],
    },
    orderBy: [{ funcao: { label: 'asc' } }, { pessoa: { nome: 'asc' } }],
    select: {
      funcao: {
        select: {
          label: true,
        },
      },
      pessoa: {
        select: {
          nome: true,
          sobrenome: true,
          apelido: true,
        },
      },
    },
  })

  const pastorais: PastoralQuadrante[] = funcoes.map((funcao) => {
    const integrantesFormatados = encontreiros
      .filter((encontreiro) => encontreiro.funcao.label === funcao.label)
      .map(
        (encontreiro) =>
          `${encontreiro.pessoa.nome} ${encontreiro.pessoa.sobrenome}`,
      )

    return {
      nome: funcao.label,
      logo: funcao.logo || '',
      integrantes: integrantesFormatados,
    }
  })

  return {
    nome: equipe.equipeLabel,
    descricao: equipe.description || '',
    pastorais,
  }
}
