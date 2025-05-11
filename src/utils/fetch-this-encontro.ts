import type { CurrentEncontro } from '@/app/api/encontro/atual/[ignorar]/get-current-encontro/get-current-encontro'
import type { PossiveisTiosExterna } from '@/app/api/encontro/atual/[ignorar]/possiveisExternas/get-possiveis-externas'
import type { PessoaPastoral } from '@/app/api/lideranca/[ano]/pastorais/get-pastorais'

import type { SelectArray } from '@/components/Form/SelectInput/SelectItem'
import { api } from '@/lib/axios'
import { cache } from 'react'

export async function getCurrentEncontro() {
  const encontroFound = await fetch(
    `${process.env.NEXTAUTH_URL}/api/encontro/atual/1/get-current-encontro`,
    { cache: 'no-store' },
  ).then(async (res) => await res.json())

  return encontroFound
}

export const getCurrentEncontroDate = cache(async (): Promise<Date | null> => {
  const data: CurrentEncontro = await getCurrentEncontro()

  const date = new Date(data.dataInicio.toString().split('T')[0])
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
})

export const encontroPromise = getCurrentEncontroDate()

export async function getNextCarroEncontro() {
  try {
    const response = await api.get('encontro/atual/1/get-next-carro-encontro')
    return response.data
  } catch {
    return 1
  }
}

export async function getPossiveisTios() {
  const response: PossiveisTiosExterna[] = await api
    .get('encontro/atual/1/possiveisExternas')
    .then((response) => response.data)
    .catch((err) => console.error(err))

  const selectData: SelectArray[] = []
  response.forEach((item) => {
    const selectItem: SelectArray = {
      label: item.nome,
      badge: item.encontro ? item.encontro : item.role,
      value: item.id,
    }

    selectData.push(selectItem)
  })

  return selectData
}

export async function getCurrentPastorais(ano: number) {
  const response: PessoaPastoral[] = await api
    .get(`lideranca/${ano}/pastorais`)
    .then((response) => response.data)
    .catch((err) => console.error(err))

  const selectData: SelectArray[] = []
  response.forEach((item) => {
    const selectItem: SelectArray = {
      label: item.pastoral,
      value: item.id,
    }

    selectData.push(selectItem)
  })

  return selectData
}
