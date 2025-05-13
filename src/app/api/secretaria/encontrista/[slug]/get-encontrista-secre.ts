import { prisma } from '@/lib/prisma'
import { dateToString } from '@/utils/string-to-date'

export type EncontristaSecreData = {
  slug: string
  nome: string
  sobrenome: string
  apelido: string | null
  dataNasc: string
  celular: string
  instagram: string
  endereco: {
    cep: string
    estado: string
    cidade: string
    bairro: string
    rua: string
    numero: number
  }
}

export async function getEncontristaSecre(
  slug: string,
): Promise<EncontristaSecreData | null> {
  const pessoa = await prisma.pessoa.findUnique({
    select: {
      nome: true,
      sobrenome: true,
      apelido: true,
      celular: true,
      slug: true,
      encontreiro: {
        select: {
          dataNasc: true,
          instagram: true,
          circulo: {
            select: {
              idCorCirculo: true,
            },
          },
        },
      },
      enderecoNumero: true,
      endereco: {
        select: {
          cep: true,
          estado: true,
          cidade: true,
          bairro: true,
          rua: true,
        },
      },
    },
    where: {
      slug,
    },
  })

  if (!pessoa) return null

  return {
    nome: pessoa.nome,
    sobrenome: pessoa.sobrenome,
    apelido: pessoa.apelido,
    slug: pessoa.slug,
    celular: pessoa.celular,
    dataNasc: pessoa.encontreiro?.dataNasc
      ? dateToString(pessoa.encontreiro.dataNasc)
      : '',
    instagram: pessoa.encontreiro?.instagram || '',
    endereco: {
      cep: pessoa.endereco.cep,
      estado: pessoa.endereco.estado,
      cidade: pessoa.endereco.cidade,
      bairro: pessoa.endereco.bairro,
      rua: pessoa.endereco.rua,
      numero: pessoa.enderecoNumero || 0,
    },
  }
}
