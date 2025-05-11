import type { Cor } from '@/app/api/domains/coresEncontro/get-cores'
import type { Disponibilidade } from '@/app/api/domains/disponibilidade/get-disponibilidade'
import type { Equipes } from '@/app/api/domains/equipes/get-equipes'
import type { Funcao } from '@/app/api/domains/funcoes/get-funcoes'
import type { MoraCom } from '@/app/api/domains/mora_com/get-mora-com'
import type { Pastoral } from '@/app/api/domains/pastorais/get-pastorais'
import type { Religiao } from '@/app/api/domains/religiao/get-religiao'
import type { StatusPais } from '@/app/api/domains/status_pais/get-status-pais'
import type { TamanhoCamisa } from '@/app/api/domains/tamanho_camisa/get-tamanho-camisa'
import type { ListEncontreiros } from '@/app/api/encontreiro/list-all/list-all-encontreiros'
import type { SelectArray } from '@/components/Form/SelectInput/SelectItem'
import { api } from '@/lib/axios'

export async function getReligioes() {
  const response: Religiao[] = await api
    .get('domains/religiao')
    .then((response) => response.data)
    .catch((err) => console.error(err))

  const selectData: SelectArray[] = []
  response.forEach((item) => {
    const selectItem: SelectArray = { label: item.religiao, value: item.id }

    selectData.push(selectItem)
  })

  return selectData
}

export async function getFuncoes() {
  const response: Funcao[] = await api
    .get('domains/funcoes')
    .then((response) => response.data)
    .catch((err) => console.error(err))

  const selectData: SelectArray[] = []
  response.forEach((item) => {
    const selectItem: SelectArray = { label: item.label, value: item.id }

    selectData.push(selectItem)
  })

  return selectData
}

export async function getBairros() {
  const response = await api
    .get('domains/bairrosRJ')
    .then((response) => response.data)
    .catch((err) => console.error(err))

  return response
}

export async function getMoraCom() {
  const response: MoraCom[] = await api
    .get('domains/mora_com')
    .then((response) => response.data)
    .catch((err) => console.error(err))

  const selectData: SelectArray[] = []
  response.forEach((item) => {
    const selectItem: SelectArray = { label: item.moraCom, value: item.id }

    selectData.push(selectItem)
  })

  return selectData
}

export async function getStatusPais() {
  const response: StatusPais[] = await api
    .get('domains/status_pais')
    .then((response) => response.data)
    .catch((err) => console.error(err))

  const selectData: SelectArray[] = []
  response.forEach((item) => {
    const selectItem: SelectArray = { label: item.statusPais, value: item.id }

    selectData.push(selectItem)
  })

  return selectData
}

export async function getTamanhoCamisa() {
  const response: TamanhoCamisa[] = await api
    .get('domains/tamanho_camisa')
    .then((response) => response.data)
    .catch((err) => console.error(err))

  const selectData: SelectArray[] = []
  response.forEach((item) => {
    const selectItem: SelectArray = {
      label: item.tamanhoCamisa,
      value: item.id,
    }

    selectData.push(selectItem)
  })

  return selectData
}

export async function getDisponibilidade() {
  const response: Disponibilidade[] = await api
    .get('domains/disponibilidade')
    .then((response) => response.data)
    .catch((err) => console.error(err))

  const selectData: SelectArray[] = []
  response.forEach((item) => {
    const selectItem: SelectArray = {
      label: `${item.disponibilidade} - ${item.descricao}`,
      value: item.id,
    }

    selectData.push(selectItem)
  })

  return selectData
}

export async function getCorEncontro() {
  const response: Cor[] = await api
    .get('domains/coresEncontro')
    .then((response) => response.data)
    .catch((err) => console.error(err))

  const selectData: SelectArray[] = []
  response.forEach((item) => {
    const selectItem: SelectArray = {
      label: item.cor,
      value: item.id.toString(),
    }

    selectData.push(selectItem)
  })

  return selectData
}

export async function getAllPastorais() {
  const response: Pastoral[] = await api
    .get('domains/pastorais')
    .then((response) => response.data)
    .catch((err) => console.error(err))

  const selectData: SelectArray[] = []
  response.forEach((item) => {
    const selectItem: SelectArray = {
      label: item.label,
      value: item.id,
    }

    selectData.push(selectItem)
  })

  return selectData
}

export async function getEquipes() {
  const response: Equipes[] = await api
    .get('domains/equipes')
    .then((response) => response.data)
    .catch((err) => console.error(err))

  const selectData: SelectArray[] = []
  response.forEach((item) => {
    const selectItem: SelectArray = {
      label: item.equipeLabel,
      value: item.equipeValue,
    }

    if (
      item.equipeValue !== 'dirigente' &&
      item.equipeValue !== 'tio_circulo'
    ) {
      selectData.push(selectItem)
    }
  })

  return selectData
}

export async function getValidEquipes() {
  const response: Equipes[] = await api
    .get('domains/equipes')
    .then((response) => response.data)
    .catch((err) => console.error(err))

  const selectData: SelectArray[] = []
  response.forEach((item) => {
    const selectItem: SelectArray = {
      label: item.equipeLabel,
      value: item.equipeValue,
    }

    if (item.equipeValue !== '0' && item.equipeValue !== 'nao_participara') {
      selectData.push(selectItem)
    }
  })

  return selectData
}

export async function getEncontreiros() {
  const response: ListEncontreiros[] = await api
    .get('encontreiro/list-all')
    .then((response) => response.data)
    .catch((err) => console.error(err))

  const selectData: SelectArray[] = []
  response.forEach((item) => {
    const selectItem: SelectArray = {
      label: `${item.nome} - ${item.encontro}º EJC`,
      value: item.id,
    }

    selectData.push(selectItem)
  })

  return selectData
}
