import { getCurrentEncontro } from '../../encontro/atual/[ignorar]/get-current-encontro/get-current-encontro'

import type { CirculoFormData } from '@/@types/circulo'
import { prisma } from '@/lib/prisma'

export async function updateCirculo({
  id,
  idEncontro,
  nome,
  tioAparente,
  tioSecreto,
}: CirculoFormData) {
  const currentEncontro = await getCurrentEncontro()
  const circulo = await prisma.circulo.update({
    data: {
      nome,
    },
    where: {
      id,
    },
  })

  if (tioAparente && tioAparente.id !== 'unknown') {
    const foundTio = await prisma.pessoa.findUnique({
      where: {
        id: tioAparente.id,
      },
    })
    if (!foundTio) return

    await prisma.equipeEncontro.update({
      data: {
        coordenou: false,
        idEquipe: 'tio_aparente',
      },
      where: {
        idPessoa_idEncontro: {
          idEncontro,
          idPessoa: foundTio.id,
        },
      },
    })

    await prisma.circulo.update({
      data: {
        idTioAparente: foundTio.id,
      },
      where: {
        id,
      },
    })
  } else {
    const circulo = await prisma.circulo.findUnique({
      where: {
        id,
      },
    })
    if (circulo && circulo.idTioAparente !== null) {
      await prisma.equipeEncontro.update({
        data: {
          idEquipe: 'tio_circulo',
        },
        where: {
          idPessoa_idEncontro: {
            idPessoa: circulo.idTioAparente,
            idEncontro,
          },
        },
      })
      await prisma.circulo.update({
        data: {
          idTioAparente: null,
        },
        where: {
          id,
        },
      })
    }
  }

  if (tioSecreto && tioSecreto.id !== 'unknown') {
    const foundTio = await prisma.pessoa.findUnique({
      where: {
        id: tioSecreto.id,
      },
    })
    if (!foundTio) return

    if (currentEncontro && currentEncontro.id === idEncontro) {
      await prisma.pessoa.update({
        data: {
          role: 'TIOSECRETO',
        },
        where: {
          id: foundTio.id,
        },
      })
    }

    await prisma.equipeEncontro.update({
      data: {
        coordenou: false,
        idEquipe: 'tio_secreto',
      },
      where: {
        idPessoa_idEncontro: {
          idEncontro,
          idPessoa: foundTio.id,
        },
      },
    })

    await prisma.circulo.update({
      data: {
        idTioSecreto: foundTio.id,
      },
      where: {
        id,
      },
    })
  } else {
    const circulo = await prisma.circulo.findUnique({
      where: {
        id,
      },
    })
    if (circulo && circulo.idTioSecreto !== null) {
      await prisma.pessoa.update({
        data: {
          role: 'ENCONTREIRO',
        },
        where: {
          id: circulo.idTioSecreto,
        },
      })
      await prisma.equipeEncontro.update({
        data: {
          idEquipe: 'tio_circulo',
        },
        where: {
          idPessoa_idEncontro: {
            idPessoa: circulo.idTioSecreto,
            idEncontro,
          },
        },
      })
      await prisma.circulo.update({
        data: {
          idTioSecreto: null,
        },
        where: {
          id,
        },
      })
    }
  }

  return circulo
}
