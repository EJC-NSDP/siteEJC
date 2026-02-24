import { NextResponse } from 'next/server'

import type { EditEquipeData } from '@/app/(app)/admin/secretaria/encontreiros/(form)/EditarEquipeForm'

import { editEncontreiroFromEquipeAtual } from './edit-encontreiro-equipe-atual'

export async function PATCH(request: Request) {
  const formData: EditEquipeData = await request.json()

  const encontreiro = await editEncontreiroFromEquipeAtual(formData)

  if (!encontreiro) return NextResponse.json(null, { status: 500 })

  return NextResponse.json(encontreiro, { status: 201 })
}
