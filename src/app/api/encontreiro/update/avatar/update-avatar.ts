import type { UpdateAvatarFormData } from './route'

import { prisma } from '@/lib/prisma'

export async function updateAvatar({ slug, avatarUrl }: UpdateAvatarFormData) {
  const foundUser = await prisma.pessoa.findUnique({
    where: {
      slug,
    },
  })

  if (!foundUser) {
    return null
  }

  return await prisma.pessoa.update({
    where: { id: foundUser.id },
    data: {
      avatarUrl,
    },
  })
}
