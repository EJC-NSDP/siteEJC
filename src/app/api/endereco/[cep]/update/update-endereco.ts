import { prisma } from '@/lib/prisma'
import { getCEPData, type CEPResponse } from '@/utils/fetch-cep'

export interface EnderecoUpdateProps {
  cep: string
  bairro: string
  rua: string
}

export async function updateEndereco({
  cep,
  bairro,
  rua,
}: EnderecoUpdateProps) {
  const response = await getCEPData(cep)
  if (!response) return null

  const fetchedCEP: CEPResponse = await response.json()

  return await prisma.endereco.upsert({
    where: {
      cep,
    },
    create: {
      cep,
      bairro,
      rua,
      cidade: fetchedCEP.city,
      estado: fetchedCEP.state,
    },
    update: {
      cep,
      bairro,
      rua,
      cidade: fetchedCEP.city,
      estado: fetchedCEP.state,
    },
  })
}
