import { getCurrentEncontro } from '@/app/api/encontro/atual/[ignorar]/get-current-encontro/get-current-encontro'
import { prisma } from '@/lib/prisma'

import { EncontroForm, type EncontroFormData, type LocalOption } from './EncontroForm'

async function getLocais(): Promise<LocalOption[]> {
  return prisma.local.findMany({
    select: {
      id: true,
      nomeLocal: true,
      numeroLocal: true,
      enderecoCep: true,
      endereco: {
        select: {
          rua: true,
          bairro: true,
          cidade: true,
          estado: true,
        },
      },
    },
  })
}

function toDateStr(d: Date): string {
  if (d.getFullYear() <= 1970) return ''
  return d.toISOString().split('T')[0]
}

export default async function DirigentesCriarEncontro() {
  const [locais, currentEncontro] = await Promise.all([
    getLocais(),
    getCurrentEncontro(),
  ])

  const data: EncontroFormData | undefined = currentEncontro
    ? {
        id: currentEncontro.id,
        numeroEncontro: currentEncontro.numeroEncontro,
        idLocal: currentEncontro.idLocal,
        numeroCirculos: currentEncontro.numeroCirculos,
        dataInicio: toDateStr(currentEncontro.dataInicio),
        dataTema: toDateStr(currentEncontro.dataTema),
      }
    : undefined

  return <EncontroForm locais={locais} data={data} />
}
