import { prisma } from '@/lib/prisma'

export async function getEncontristaSecre(slug: string) {
  return await prisma.pessoa.findUnique({
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
      slug,
    },
  })
}
