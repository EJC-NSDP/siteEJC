import { getCurrentEncontro } from '@/app/api/encontro/atual/[ignorar]/get-current-encontro/get-current-encontro'
import { prisma } from '@/lib/prisma'

export async function removeEncontreiroFromEquipe(id: string) {
  const encontro = await getCurrentEncontro()
  if (!encontro) return null

  return await prisma.equipeEncontro.delete({
    where: {
      idPessoa_idEncontro: {
        idEncontro: encontro.id,
        idPessoa: id,
      },
    },
  })
}
