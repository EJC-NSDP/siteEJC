import type {
  EquipeTiosExternaQuadrante,
  TioExternaQuadrante,
} from '@/@types/quadrante'
import { prisma } from '@/lib/prisma'
import { getCurrentEncontro } from '@/utils/fetch-this-encontro'

export async function getTiosExternaQuadrante(): Promise<EquipeTiosExternaQuadrante | null> {
  const encontro = await getCurrentEncontro()

  const equipe = await prisma.domainEquipes.findUnique({
    select: {
      equipeLabel: true,
      equipeValue: true,
      description: true,
    },
    where: {
      equipeValue: 'tio_externa',
    },
  })

  if (!encontro || !equipe) return null

  const tiosExterna = await prisma.carroEncontro.findMany({
    where: {
      idEncontro: encontro.id,
    },
    orderBy: {
      numeroCarro: 'asc',
    },
    select: {
      carro: {
        select: {
          pessoaMotorista: {
            select: {
              nome: true,
              apelido: true,
              endereco: {
                select: {
                  bairro: true,
                },
              },
            },
          },
          pessoaCarona: {
            select: {
              nome: true,
              apelido: true,
            },
          },
        },
      },
    },
  })

  const integrantes: TioExternaQuadrante[] = tiosExterna.map((tioExterna) => {
    const nomeMotorista =
      tioExterna.carro.pessoaMotorista.apelido ||
      tioExterna.carro.pessoaMotorista.nome
    const nomeCarona = tioExterna.carro.pessoaCarona
      ? tioExterna.carro.pessoaCarona.apelido ||
        tioExterna.carro.pessoaCarona.nome
      : null

    return {
      nome: nomeCarona ? `${nomeMotorista} e ${nomeCarona}` : nomeMotorista,
      bairro: tioExterna.carro.pessoaMotorista.endereco.bairro,
    }
  })

  return {
    nome: equipe.equipeLabel,
    descricao: equipe.description || '',
    integrantes,
  }
}
