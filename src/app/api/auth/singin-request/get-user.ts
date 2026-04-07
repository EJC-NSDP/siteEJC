import { compare } from 'bcryptjs'
import type { User } from 'next-auth'

import { prisma } from '@/lib/prisma'

import type { LoginProps } from './route'

interface getUserProps {
  credentials: LoginProps
}

export async function getUser({ credentials }: getUserProps) {
  const userExists = await prisma.pessoa.findUnique({
    where: {
      email: credentials.email,
    },
  })

  if (!userExists) {
    return null
  }

  const passwordCorrect = userExists.password
    ? await compare(credentials.password, userExists.password)
    : false

  if (!passwordCorrect) {
    return null
  }

  const user: User = {
    name: userExists.nome,
    surname: userExists.sobrenome,
    email: userExists.email,
    id: userExists.id,
    roles: userExists.roles,
    avatar_url: userExists.avatarUrl ? userExists.avatarUrl : undefined,
  }

  return user
}
