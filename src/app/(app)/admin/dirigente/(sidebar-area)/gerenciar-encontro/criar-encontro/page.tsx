import { getCurrentEncontro } from '@/app/api/encontro/atual/[ignorar]/get-current-encontro/get-current-encontro'
import { getLocais } from '@/app/api/local/get-locais'

import { EncontroForm, type EncontroFormData } from './EncontroForm'

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
