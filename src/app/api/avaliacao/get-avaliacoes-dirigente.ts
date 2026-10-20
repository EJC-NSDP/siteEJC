import { prisma } from '@/lib/prisma'

export async function getUltimoEncontro() {
  return prisma.encontro.findFirst({
    orderBy: { numeroEncontro: 'desc' },
    select: { id: true, numeroEncontro: true },
  })
}

export async function getAvaliacoesByEncontro(idEncontro: string) {
  return prisma.avaliacaoEncontro.findMany({
    where: { idEncontro },
    include: {
      autor: {
        select: {
          id: true,
          nome: true,
          sobrenome: true,
          apelido: true,
          avatarUrl: true,
          encontreiro: {
            select: {
              equipeMontagem: {
                select: { equipe: { select: { equipeLabel: true } } },
              },
            },
          },
        },
      },
      respostas: {
        include: {
          pergunta: {
            select: { chave: true, texto: true, tipo: true, ordem: true },
          },
        },
        orderBy: { pergunta: { ordem: 'asc' } },
      },
      indicacoes: {
        include: {
          encontreiro: {
            select: {
              idPessoa: true,
              pessoa: {
                select: {
                  nome: true,
                  sobrenome: true,
                  apelido: true,
                  avatarUrl: true,
                },
              },
            },
          },
          equipe: { select: { equipeLabel: true, equipeValue: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}
