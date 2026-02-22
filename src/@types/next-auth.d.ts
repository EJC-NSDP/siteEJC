import 'next-auth'
import type { Role } from './enums'

declare module 'next-auth' {
  interface User {
    id: string
    name: string
    surname: string
    email: string
    role: Role
    avatar_url?: string
  }

  interface Session {
    user: User
  }
}
