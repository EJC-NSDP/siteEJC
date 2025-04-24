// import { PrismaClient } from '@prisma/client'
import { PrismaClient } from '../../prisma/app/generated/prisma/client'

export const prisma = new PrismaClient({
  log: ['error', 'warn'],
})
