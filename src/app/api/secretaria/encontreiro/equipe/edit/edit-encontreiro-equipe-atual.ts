import type { EditEquipeData } from '@/app/(app)/admin/secretaria/encontreiros/(form)/EditarEquipeForm'
import { getCurrentEncontro } from '@/app/api/encontro/atual/[ignorar]/get-current-encontro/get-current-encontro'
import { prisma } from '@/lib/prisma'

export async function editEncontreiroFromEquipeAtual({
  idPessoa,
  equipeLabel,
}: EditEquipeData) {
  const encontro = await getCurrentEncontro()

  const newEquipe = await prisma.domainEquipes.findFirst({
    where: {
      equipeLabel,
    },
  })

  if (!encontro || !newEquipe) return null

  return await prisma.equipeEncontro.update({
    data: {
      idEquipe: newEquipe.equipeValue,
    },
    where: {
      idPessoa_idEncontro: {
        idEncontro: encontro.id,
        idPessoa,
      },
    },
  })
}
