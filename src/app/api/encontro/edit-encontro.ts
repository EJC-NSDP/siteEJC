import { prisma } from '@/lib/prisma'
import { stringToDate } from '@/utils/string-to-date'

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
  const dataInicioDate = stringToDate(dataInicio)
  const dataTemaDate = stringToDate(dataTema)

  const encontro = await prisma.encontro.update({
    where: { id },
    data: {
      numeroEncontro,
      dataInicio: dataInicioDate,
      dataTema: dataTemaDate,
      numeroCirculos,
      idLocal,
    },
  })

  return encontro
}
