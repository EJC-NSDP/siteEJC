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

  const liderancas = await prisma.domainFuncoes.findMany({
    select: {
      id: true,
      label: true,
      logo: true,
    },
    where: {
      NOT: [{ id: 'bp' }, { id: 'dirigente' }],
      lideranca: { some: { ano: currentYear } },
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

  const pastorais: PastoralQuadrante[] = liderancas.map((lideranca) => {
    const integrantesFormatados = encontreiros
      .filter((encontreiro) => encontreiro.funcao.label === lideranca.label)
      .map(
        (encontreiro) =>
          `${encontreiro.pessoa.nome} ${encontreiro.pessoa.sobrenome}`,
      )

    return {
      nome: lideranca.label,
      logo: lideranca.logo || '',
      integrantes: integrantesFormatados,
    }
  })

  return {
    nome: equipe.equipeLabel,
    descricao: equipe.description || '',
    pastorais,
  }
}
