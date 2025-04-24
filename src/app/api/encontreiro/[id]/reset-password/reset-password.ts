import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import type { ResetPasswordProps } from './route'

export async function resetPassword({ id }: ResetPasswordProps) {
  const defaultPassword = 'ejcnsdp'

  const defaultPasswordHash = await hash(defaultPassword, 8)

  return await prisma.pessoa.update({
    where: {
      id,
    },
    data: {
      password: defaultPasswordHash,
      changePassword: true,
    },
  })
}
