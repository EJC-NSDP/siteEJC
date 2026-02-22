import { compare } from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'
import { User } from 'next-auth'

import { prisma } from '@/lib/prisma'

interface LoginProps {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}

export async function POST(request: NextRequest) {
  const credendials: LoginProps = await request.json()

  const userExists = await prisma.pessoa.findUnique({
    where: {
      email: credendials.email,
    },
  })

  if (!userExists) {
    return NextResponse.json('', { status: 404, statusText: 'User not found' })
  }

  const passwordCorrect = userExists.password
    ? await compare(credendials.password, userExists.password)
    : false

  if (!passwordCorrect) {
    return NextResponse.json('', {
      status: 401,
      statusText: 'User or password incorrect',
    })
  }

  const user: User = {
    name: userExists.nome,
    surname: userExists.sobrenome,
    email: userExists.email,
    id: userExists.id,
    role: userExists.role,
    avatar_url: userExists.avatarUrl ? userExists.avatarUrl : undefined,
  }
  const response: AuthResponse = {
    user,
    token: '@ejcnsdp', // CRIAR O TOKEN
  }

  return NextResponse.json(response, { status: 200 })
}
