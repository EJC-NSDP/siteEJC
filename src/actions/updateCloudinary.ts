import type { NextResponse } from 'next/server'

import type { valueQuadrante } from '@/@types/enums'
import type { UpdateAvatarFormData } from '@/app/api/encontreiro/update/avatar/route'
import type { UpdateQuadranteData } from '@/app/api/secretaria/quadrante/settings/route'
import { api } from '@/lib/axios'

type UpdateQuadranteActionResponse =
  | NextResponse<{ status: number }>
  | NextResponse<{ message: string; resultados: valueQuadrante }>

export async function updateCapas({
  value,
  imageUrl,
}: UpdateQuadranteData): Promise<UpdateQuadranteActionResponse> {
  return await api.patch('secretaria/quadrante/update-image', {
    value,
    imageUrl,
  })
}

type UpdateProfileActionResponse =
  | NextResponse<{ status: number }>
  | NextResponse<{ id: string; email: string }>

export async function updateProfile({
  slug,
  avatarUrl,
}: UpdateAvatarFormData): Promise<UpdateProfileActionResponse> {
  return await api.patch('encontreiro/update/avatar', {
    slug,
    avatarUrl,
  })
}
