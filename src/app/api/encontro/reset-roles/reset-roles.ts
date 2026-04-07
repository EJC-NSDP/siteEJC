import { prisma } from '@/lib/prisma'

const ROLES_RESETAVEIS = [
  'COORDENADOR',
  'EXTERNA',
  'SECRETARIA',
  'APRESENTACAO',
  'TIOSECRETO',
] as const
type RoleResetavel = (typeof ROLES_RESETAVEIS)[number]

export async function resetRoles() {
  const pessoas = await prisma.pessoa.findMany({
    where: {
      roles: { hasSome: [...ROLES_RESETAVEIS] },
    },
    select: { id: true, roles: true },
  })

  await Promise.all(
    pessoas.map((pessoa) =>
      prisma.pessoa.update({
        where: { id: pessoa.id },
        data: {
          roles: {
            set: pessoa.roles.filter(
              (r) => !ROLES_RESETAVEIS.includes(r as RoleResetavel),
            ),
          },
        },
      }),
    ),
  )

  return { resetados: pessoas.length }
}
