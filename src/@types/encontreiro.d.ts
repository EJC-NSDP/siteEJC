
interface EncontreiroPessoaFormData {
  nome: string
  sobrenome: string
  celular: string
  telefone?: string
  email: string
  apelido?: string
  dataNascimento: string
  instagram?: string
}

interface EncontreiroAddressFormData {
  enderecoCep: string
  bairro: string
  cidade: string
  estado: string
  rua: string
  enderecoNumero: string
}

interface EncontreiroEncontroFormData {
  idEncontro: string
  idCirculo?: string
  equipes?: {
    idEncontro: string
    idEquipe: string
    coordenou: boolean
  }[]
}


export interface EncontreiroFormData {
  id: string
  slug: string
  pessoa: EncontreiroPessoaFormData
  endereco: EncontreiroAddressFormData
  encontro: EncontreiroEncontroFormData
}