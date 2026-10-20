import { prisma } from '@/lib/prisma'

export async function getPerguntas() {
  return prisma.perguntaAvaliacao.findMany({
    orderBy: { ordem: 'asc' },
  })
}

export async function getPerguntasAtivas() {
  return prisma.perguntaAvaliacao.findMany({
    where: { ativo: true },
    orderBy: { ordem: 'asc' },
  })
}
