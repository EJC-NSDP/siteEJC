import type { Cor } from '@/app/api/domains/coresEncontro/get-cores'
import type { SelectCirculoEncontro } from '@/app/api/encontro/[idEncontro]/circulos/get-circulos'
import type { SelectTiosEncontro } from '@/app/api/encontro/[idEncontro]/tios-circulo/get-tios-circulo'
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

export async function getEncontrosNumber() {
  const response: SelectEncontros[] = await api
    .get('encontro')
    .then((response) => response.data)
    .catch((err) => console.error(err))

  const selectData: SelectArray[] = []
  response.forEach((item) => {
    const selectItem: SelectArray = {
      label: `${item.numeroEncontro}º EJC`,
      value: item.numeroEncontro.toString(),
    }

    selectData.push(selectItem)
  })

  return selectData
}

export async function getCoresEncontro() {
  const response: Cor[] = await api
    .get('domains/coresEncontro')
    .then((response) => response.data)
    .catch((err) => console.error(err))

  const selectData: SelectArray[] = []
  response.forEach((item) => {
    const selectItem: SelectArray = {
      label: item.cor,
      value: item.cor.toString(),
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

export async function getTiosCirculoFromEncontro(idEncontro: string) {
  const response: SelectTiosEncontro[] = await api
    .get(`encontro/${idEncontro}/tios-circulo`)
    .then((response) => response.data)
    .catch((err) => console.error(err))

  const selectData: SelectArray[] = []

  response.forEach((item) => {
    const selectItem: SelectArray = {
      label: `${item.nome} (${item.numeroEncontro} º EJC)`,
      value: item.id,
    }

    selectData.push(selectItem)
  })

  return selectData
}
