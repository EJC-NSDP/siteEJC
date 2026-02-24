'use client'

import { useQuery } from '@tanstack/react-query'

import type { EncontristaConfirmadosData } from '@/app/api/encontro/atual/[ignorar]/confirmados/get-confirmados'
import { type SelectArray } from '@/components/Form/SelectInput/SelectItem'
import { api } from '@/lib/axios'

import { MensagemAberta } from './MensagemAberta'
import { MensagemFechada } from './MensagemFechada'

async function getConfirmados() {
  const response: EncontristaConfirmadosData[] = await api
    .get(`encontro/atual/1/confirmados`)
    .then((response) => response.data)
    .catch((err) => console.error(err))

  const selectData: SelectArray[] = []
  response.forEach((item) => {
    const selectItem: SelectArray = {
      label: `${item.nome} ${item.sobrenome}`,
      value: item.slug,
    }

    selectData.push(selectItem)
  })

  return selectData
}

async function getCartasStatus() {
  const res = await api.get(`encontro/atual/1/get-carta-status`)
  return res.data as boolean
}

export default function Mensagem() {
  const { data: statusCarta } = useQuery<boolean>({
    queryKey: ['statusCarta'],
    queryFn: async () => await getCartasStatus(),
  })

  const { data: encontristas } = useQuery<SelectArray[]>({
    queryFn: async () => await getConfirmados(),
    queryKey: ['encontristasConfirmados'],
  })

  return (
    <div className="flex w-auto items-center justify-center px-4 pt-11">
      {statusCarta && encontristas && statusCarta ? (
        <MensagemAberta encontristas={encontristas} />
      ) : (
        <MensagemFechada />
      )}
    </div>
  )
}
