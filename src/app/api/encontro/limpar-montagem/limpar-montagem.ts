import { prisma } from '@/lib/prisma'
import { getCurrentEncontro } from '../atual/[ignorar]/get-current-encontro/get-current-encontro'

export async function limparMontagem() {
  const currentEncontro = await getCurrentEncontro()

  if (!currentEncontro) return null

  const lastEncontro = await prisma.encontro.findUnique({
    select: { id: true },
    where: {
      numeroEncontro: currentEncontro.numeroEncontro - 1,
    },
  })

  if (!lastEncontro) return null

  await prisma.encontreiro.updateMany({
    data: {
      statusMontagem: 'ATIVO',
    },
    where: {
      statusMontagem: 'CONVIDADO_ESPECIAL',
    },
  })

  await prisma.encontreiro.updateMany({
    data: {
      statusMontagem: 'CONVIDADO_ESPECIAL',
    },
    where: {
      idEncontro: {
        in: [currentEncontro.id, lastEncontro.id],
      },
    },
  })

  return await prisma.equipeMontagem.deleteMany()
}
