// import { PrismaClient } from '@prisma/client'

import { PrismaClient } from '@/generated/client'

export const prisma = new PrismaClient({
  log: ['error', 'warn'],
})
