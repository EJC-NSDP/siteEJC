import { prisma } from '@/lib/prisma'

export interface EncontraoActions {
  ultimoEncontro: boolean
  encontristas: boolean
  cartas: boolean
  montagem: boolean
}

export async function getEncontraoActions(): Promise<EncontraoActions | null> {
  const encontraoRoles = await prisma.pessoa.count({
    where: {
      OR: [
        { role: 'COORDENADOR' },
        { role: 'EXTERNA' },
        { role: 'SECRETARIA' },
        { role: 'TIOSECRETO' },
      ],
    },
  })

  const encontristas = await prisma.encontrista.count({
    where: {
      OR: [
        { idStatus: 'confirmado' },
        { idStatus: 'confirmado_sem_sexta' },
        { idStatus: 'delete' },
        { idStatus: 'desistiu' },
      ],
    },
  })

  const cartas = await prisma.carta.count()

  const equipesMontagem = await prisma.equipeMontagem.count()

  return {
    ultimoEncontro: encontraoRoles === 0,
    encontristas: encontristas === 0,
    cartas: cartas === 0,
    montagem: equipesMontagem === 0,
  }
}
