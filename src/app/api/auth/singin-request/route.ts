import { NextRequest, NextResponse } from 'next/server'
import { User } from 'next-auth'

import { getUser } from './get-user'

export interface LoginProps {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}

export async function POST(request: NextRequest) {
  const credentials: LoginProps = await request.json()

  const user = await getUser({ credentials })

  if (!user) {
    return NextResponse.json('', {
      status: 401,
      statusText: 'User or password incorrect',
    })
  }

  const response: AuthResponse = {
    user,
    token: '@ejcnsdp', // CRIAR O TOKEN
  }

  return NextResponse.json(response, { status: 200 })
}
