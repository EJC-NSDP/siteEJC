import { prisma } from '@/lib/prisma'

export type EncontroProps = {
  id: string
  numeroEncontro: number
  dataInicio: string
  dataTema: string
  numeroCirculos: number
  idLocal: string
}

export async function editEncontro({
  id,
  numeroEncontro,
  dataInicio,
  dataTema,
  idLocal,
  numeroCirculos,
}: EncontroProps) {
  const dataInicioDate = new Date(dataInicio)
  const dataTemaDate = new Date(dataTema)

  const ordemCirculos =
    numeroCirculos > 0
      ? parseInt('12345'.substring(0, numeroCirculos))
      : 0

  const encontro = await prisma.encontro.update({
    where: { id },
    data: {
      numeroEncontro,
      dataInicio: dataInicioDate,
      dataTema: dataTemaDate,
      numeroCirculos,
      idLocal,
      ordemCirculos,
    },
  })

  return encontro
}
