import { prisma } from '@/lib/prisma'

export async function resetRoles() {
  return await prisma.pessoa.updateMany({
    data: {
      role: 'ENCONTREIRO',
    },
    where: {
      OR: [
        { role: 'COORDENADOR' },
        { role: 'EXTERNA' },
        { role: 'SECRETARIA' },
        { role: 'TIOSECRETO' },
      ],
    },
  })
}
