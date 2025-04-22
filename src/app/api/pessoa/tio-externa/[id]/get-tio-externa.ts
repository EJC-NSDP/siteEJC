import type { CarPersonFormData } from '@/@types/carro'
import { prisma } from '@/lib/prisma'

export async function getTioExterna(id: string) {
  const pessoaFound = await prisma.pessoa.findFirst({
    select: {
      id: true,
      role: true,
      nome: true,
      sobrenome: true,
      apelido: true,
      celular: true,
      telefone: true,
      email: true,
      endereco: {
        select: {
          bairro: true,
          cep: true,
          cidade: true,
          estado: true,
          rua: true,
        },
      },
      enderecoNumero: true,
    },
    where: {
      id,
    },
  })

  if (!pessoaFound) return null

  const tioExterna: CarPersonFormData = {
    id: pessoaFound.id,
    nome: pessoaFound.nome,
    role: pessoaFound.role,
    sobrenome: pessoaFound.sobrenome,
    celular: pessoaFound.celular,
    telefone: pessoaFound.telefone || '',
    email: pessoaFound.email,
    enderecoCep: pessoaFound.endereco.cep,
    bairro: pessoaFound.endereco.bairro,
    cidade: pessoaFound.endereco.cidade,
    estado: pessoaFound.endereco.estado,
    rua: pessoaFound.endereco.rua,
    enderecoNumero: pessoaFound.enderecoNumero?.toString() || '0',
    apelido: pessoaFound.apelido || '',
  }

  return tioExterna
}
