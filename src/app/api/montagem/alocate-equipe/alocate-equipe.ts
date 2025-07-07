import { prisma } from '@/lib/prisma'
import { idPertenceARosa } from '@/utils/pertence'

export interface changeEquipeProps {
  idEncontreiro: string
  valueEquipe: string
}

export async function alocateEquipeMontagem({
  idEncontreiro,
  valueEquipe,
}: changeEquipeProps) {
  const coordenando =
    valueEquipe === 'apresentacao' || idPertenceARosa(valueEquipe)

  const equipeInfo = await prisma.equipeMontagem.upsert({
    where: {
      idEncontreiro,
    },
    update: {
      valueEquipe,
      coordenando,
    },
    create: {
      idEncontreiro,
      valueEquipe,
      coordenando,
    },
  })

  return equipeInfo
}
