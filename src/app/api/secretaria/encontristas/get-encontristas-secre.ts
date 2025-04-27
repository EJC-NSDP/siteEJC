import { prisma } from '@/lib/prisma'

export async function getEncontristasSecre() {
  return await prisma.pessoa.findMany({
    select: {
      nome: true,
      sobrenome: true,
      apelido: true,
      celular: true,
      slug: true,
      encontreiro: {
        select: {
          dataNasc: true,
          instagram: true,
          circulo: {
            select: {
              idCorCirculo: true,
            },
          },
        },
      },
      endereco: {
        select: {
          bairro: true,
        },
      },
    },
    where: {
      OR: [
        {
          encontrista: {
            OR: [
              { idStatus: 'confirmado' },
              { idStatus: 'confirmado_sem_sexta' },
            ],
          },
          role: 'ENCONTRISTA',
        },
      ],
    },
  })
}
