import type { PossiveisTiosExterna } from '@/app/api/encontro/atual/[ignorar]/possiveisExternas/get-possiveis-externas'
import type { SelectArray } from '@/components/Form/SelectInput/SelectItem'
import { api } from '@/lib/axios'

export async function getCurrentEncontro() {
  const encontroFound = await fetch(
    `${process.env.NEXTAUTH_URL}/api/encontro/atual/1/get-current-encontro`,
    { cache: 'no-store' },
  ).then(async (res) => await res.json())

  return encontroFound
}

export async function getNextCarroEncontro() {
  try {
    const response = await api.get('encontro/atual/1/get-next-carro-encontro')
    return response.data
  } catch (error) {
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
