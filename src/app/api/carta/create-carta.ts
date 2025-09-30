import { prisma } from '@/lib/prisma'

export interface CartaProps {
  slugEncontrista: string
  categoria: string
  para: string
  de: string
  conteudo: string
}

export async function createCarta({
  slugEncontrista,
  categoria,
  conteudo,
  de,
  para,
}: CartaProps) {
  const encontrista = await prisma.pessoa.findUnique({
    select: {
      role: true,
    },
    where: {
      slug: slugEncontrista,
    },
  })

  const isSecreto = encontrista?.role === 'TIOSECRETO'

  if (isSecreto) {
    return true
  }

  return await prisma.carta.create({
    data: {
      slugEncontrista,
      idCategoria: categoria,
      de,
      para,
      conteudo,
    },
  })
}
