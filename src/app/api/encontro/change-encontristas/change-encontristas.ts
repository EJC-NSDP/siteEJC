import { prisma } from '@/lib/prisma'
import { createSlugForEncontrista } from '@/utils/create-slug'
import { resetPassword } from '../../encontreiro/[id]/reset-password/reset-password'
import { getCurrentEncontro } from '../atual/[ignorar]/get-current-encontro/get-current-encontro'

export async function changeEncontristas() {
  const currentEncontro = await getCurrentEncontro()

  if (!currentEncontro) return null

  const confirmados = await prisma.pessoa.findMany({
    where: {
      encontrista: {
        idStatus: {
          in: ['confirmado', 'confirmado_sem_sexta'],
        },
      },
    },
  })

  confirmados.map(async (confirmado) => {
    const slug = createSlugForEncontrista(
      confirmado.email,
      currentEncontro.numeroEncontro,
    )

    if (slug !== confirmado.slug) {
      await prisma.pessoa.update({
        data: {
          slug,
          role: 'ENCONTREIRO',
        },
        where: {
          id: confirmado.id,
        },
      })
    } else {
      await prisma.pessoa.update({
        data: {
          role: 'ENCONTREIRO',
        },
        where: {
          id: confirmado.id,
        },
      })
    }
    await resetPassword({ id: confirmado.id })
    await prisma.encontrista.delete({
      where: {
        idPessoa: confirmado.id,
      },
    })
    await prisma.encontreiro.update({
      data: {
        statusMontagem: 'CONVIDADO_ESPECIAL',
      },
      where: {
        idPessoa: confirmado.id,
      },
    })
  })

  const deletados = await prisma.pessoa.deleteMany({
    where: {
      encontrista: {
        idStatus: {
          in: ['delete', 'desistiu'],
        },
      },
    },
  })

  const atualizados = await prisma.encontrista.findMany({
    where: {
      idStatus: {
        notIn: ['confirmado', 'confirmado_sem_sexta', 'delete', 'desistiu'],
      },
    },
  })

  atualizados.map(async (atualizado) => {
    await prisma.encontreiro.update({
      data: {
        idCirculo: null,
      },
      where: {
        idPessoa: atualizado.idPessoa,
      },
    })
    await prisma.encontrista.update({
      data: {
        idStatus: 'ligar',
        cartasFisicas: 0,
        idCarroEncontro: null,
        cartasOk: false,
        familiaOk: false,
        generosaOk: false,
      },
      where: {
        idPessoa: atualizado.idPessoa,
      },
    })
  })

  return {
    confirmados: confirmados.length,
    deletados,
    atualizados: atualizados.length,
  }
}
