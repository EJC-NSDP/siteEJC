import type { CarFormData } from '@/@types/carro'
import { prisma } from '@/lib/prisma'

export interface GetCarroProps {
  carro: string
  encontro: string
}

export async function getCarro({ carro, encontro }: GetCarroProps) {
  const numeroEncontro = isNaN(Number(encontro)) ? -1 : Number(encontro)
  const encontroFound = await prisma.encontro.findFirst({
    where: {
      numeroEncontro,
    },
  })

  if (!encontroFound) return null

  const carroFound = await prisma.carroEncontro.findUnique({
    select: {
      idCarro: true,
      numeroCarro: true,
      observacao: true,
      encontro: {
        select: {
          id: true,
          numeroEncontro: true,
        },
      },
      carro: {
        select: {
          id: true,
          pessoaMotorista: {
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
                  cep: true,
                  bairro: true,

                  rua: true,
                  cidade: true,
                  estado: true,
                },
              },
              enderecoNumero: true,
            },
          },
          pessoaCarona: {
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
                  cep: true,
                  bairro: true,
                  rua: true,
                  cidade: true,
                  estado: true,
                },
              },
              enderecoNumero: true,
            },
          },
          modeloCarro: true,
          placaCarro: true,
          lugaresCarro: true,
          observacaoMotorista: true,
        },
      },
    },
    where: {
      idCarro_idEncontro: {
        idCarro: carro,
        idEncontro: encontroFound.id,
      },
    },
  })

  if (!carroFound) return null

  const carroAdaptado: CarFormData = {
    idCarro: carroFound.idCarro,
    numeroEncontro: encontroFound.numeroEncontro,
    carro: {
      modeloCarro: carroFound.carro.modeloCarro,
      placaCarro: carroFound.carro.placaCarro,
      lugaresCarro: carroFound.carro.lugaresCarro,
      observacaoExterna: carroFound.observacao || '',
      numeroCarro: carroFound.numeroCarro,
    },
    motorista: {
      id: carroFound.carro.pessoaMotorista.id,
      role: carroFound.carro.pessoaMotorista.role,
      nome: carroFound.carro.pessoaMotorista.nome,
      sobrenome: carroFound.carro.pessoaMotorista.sobrenome,
      celular: carroFound.carro.pessoaMotorista.celular,
      telefone: carroFound.carro.pessoaMotorista.telefone || undefined,
      email: carroFound.carro.pessoaMotorista.email,
      enderecoCep: carroFound.carro.pessoaMotorista.endereco.cep,
      bairro: carroFound.carro.pessoaMotorista.endereco.bairro,
      cidade: carroFound.carro.pessoaMotorista.endereco.cidade,
      estado: carroFound.carro.pessoaMotorista.endereco.estado,
      rua: carroFound.carro.pessoaMotorista.endereco.rua,
      enderecoNumero:
        carroFound.carro.pessoaMotorista.enderecoNumero?.toString() || '',
      apelido: carroFound.carro.pessoaMotorista.apelido || '',
      observacaoMotorista: carroFound.carro.observacaoMotorista,
    },
    carona: carroFound.carro.pessoaCarona
      ? {
          id: carroFound.carro.pessoaCarona.id,
          role: carroFound.carro.pessoaCarona.role,
          nome: carroFound.carro.pessoaCarona.nome,
          sobrenome: carroFound.carro.pessoaCarona.sobrenome,
          celular: carroFound.carro.pessoaCarona.celular,
          telefone: carroFound.carro.pessoaCarona.telefone || undefined,
          email: carroFound.carro.pessoaCarona.email,
          enderecoCep: carroFound.carro.pessoaCarona.endereco.cep,
          bairro: carroFound.carro.pessoaCarona.endereco.bairro,
          cidade: carroFound.carro.pessoaCarona.endereco.cidade,
          estado: carroFound.carro.pessoaCarona.endereco.estado,
          rua: carroFound.carro.pessoaCarona.endereco.rua,
          enderecoNumero:
            carroFound.carro.pessoaCarona.enderecoNumero?.toString() || '0',
          apelido: carroFound.carro.pessoaCarona.apelido || '',
        }
      : null,
  }

  return carroAdaptado
}
