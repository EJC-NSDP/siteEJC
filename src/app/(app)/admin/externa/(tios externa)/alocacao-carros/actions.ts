'use server'

import { getEncontristaCarro } from '@/app/api/export/carro/[id]/get-encontrista-carro'

export async function fetchEncontristaCarroAction(idCarro: string) {
  return await getEncontristaCarro(idCarro)
}
