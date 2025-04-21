import type { SelectCirculoEncontro } from '@/app/api/encontro/[idEncontro]/circulos/get-circulos'
import type { SelectEncontros } from '@/app/api/encontro/get-encontros'
import type { SelectArray } from '@/components/Form/SelectInput/SelectItem'
import { api } from '@/lib/axios'

export async function getEncontros() {
  const response: SelectEncontros[] = await api
    .get('encontro')
    .then((response) => response.data)
    .catch((err) => console.error(err))

  const selectData: SelectArray[] = []
  response.forEach((item) => {
    const selectItem: SelectArray = {
      label: `${item.numeroEncontro}º EJC`,
      value: item.id,
    }

    selectData.push(selectItem)
  })

  return selectData
}

export async function getCirculosEncontro(idEncontro: string) {
  const response: SelectCirculoEncontro[] = await api
    .get(`encontro/${idEncontro}/circulos`)
    .then((response) => response.data)
    .catch((err) => console.error(err))

  const selectData: SelectArray[] = []

  response.forEach((item) => {
    const selectItem: SelectArray = {
      label: `${item.corLabel} - ${item.nome}`,
      value: item.id,
    }

    selectData.push(selectItem)
  })

  return selectData
}
