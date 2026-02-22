import { hash } from 'bcryptjs'

import type { ResetPasswordProps } from './route'

import { prisma } from '@/lib/prisma'

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
