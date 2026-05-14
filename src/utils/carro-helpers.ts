import type { Value_Status, Value_StatusPais } from '@/enums'

export type EncontristaCarroData = {
  idStatus: Value_Status
  idStatusPais: Value_StatusPais
  endNumEncontro: number | null
  endComplementoEncontro: string | null
  endComplemento: string
  enderecoEncontro: {
    rua: string
    bairro: string
    cep: string
  } | null
  nomeContato1: string
  telContato1: string
  parentescoContato1: string
  nomeContato2: string | null
  telContato2: string | null
  parentescoContato2: string | null
  indicadoPorNome: string | null
  indicadoPorTel: string | null
  obsExternaLocalizacao: string | null
  obsExternaConhecidos: string | null
  obsExternaSaude: string | null
  obsExternaOutros: string | null
  pessoa: {
    nome: string
    sobrenome: string
    apelido: string | null
    celular: string
    enderecoNumero: number | null
    endereco: {
      rua: string
      bairro: string
      cep: string
    }
    encontreiro: {
      dataNasc: Date
    } | null
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function statusToDias(idStatus: Value_Status): string {
  const map: Partial<Record<Value_Status, string>> = {
    confirmado: 'Sexta, sábado e domingo',
    confirmado_sem_sexta: 'Sábado e domingo',
  }
  return map[idStatus] ?? idStatus
}

export function resolveEndereco(encontrista: EncontristaCarroData): string {
  const usandoEncontro = !!encontrista.enderecoEncontro
  const end = encontrista.enderecoEncontro ?? encontrista.pessoa.endereco
  const numero = usandoEncontro
    ? encontrista.endNumEncontro
    : encontrista.pessoa.enderecoNumero
  const complemento = usandoEncontro
    ? encontrista.endComplementoEncontro
    : encontrista.endComplemento

  const partes = [`${end.rua}, ${numero ?? 's/n'}`]
  if (complemento) partes[0] += ` ${complemento}`
  partes.push(end.bairro)
  partes.push(end.cep)

  return partes.join(' - ')
}

export function calcIdade(dataNasc: Date | null | undefined): string {
  if (!dataNasc) return '—'
  const hoje = new Date()
  let idade = hoje.getFullYear() - dataNasc.getFullYear()
  const aindaNaoFezAnos =
    hoje.getMonth() < dataNasc.getMonth() ||
    (hoje.getMonth() === dataNasc.getMonth() &&
      hoje.getDate() < dataNasc.getDate())
  if (aindaNaoFezAnos) idade--
  return `${idade} anos`
}

export function resolveObservacoes(encontrista: EncontristaCarroData): string {
  return [
    encontrista.obsExternaSaude,
    encontrista.obsExternaConhecidos,
    encontrista.obsExternaOutros,
    encontrista.obsExternaLocalizacao,
  ]
    .filter(Boolean)
    .join(' | ')
}
