import type { Role } from "@prisma/client"

interface CarInfoFormData {
  modeloCarro: string
  placaCarro: string
  lugaresCarro: number
  observacaoExterna?: string
  numeroCarro: number
}

interface CarPersonFormData {
  id: string
  role: Role
  nome: string
  sobrenome: string
  celular: string
  telefone?: string
  email: string
  enderecoCep: string
  bairro: string
  cidade: string
  estado: string
  rua: string
  enderecoNumero: string
  apelido?: string
  observacaoMotorista?: string
}

export interface CarFormData {
  idCarro: string
  numeroEncontro: number
  carro: CarInfoFormData
  motorista: CarPersonFormData
  carona: CarPersonFormData | null
}
