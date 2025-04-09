import type { Role } from '@prisma/client'
import 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    name: string
    surname:string
    email: string
    role: Role
    avatar_url?: string
  }

  interface Session {
    user: User
  }
}
