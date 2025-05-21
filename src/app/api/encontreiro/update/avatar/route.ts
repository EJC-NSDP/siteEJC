import { NextResponse } from 'next/server'
import { updateAvatar } from './update-avatar'

export interface UpdateAvatarFormData {
  slug: string
  avatarUrl: string
}

export async function PATCH(request: Request) {
  const formData: UpdateAvatarFormData = await request.json()

  const updated = await updateAvatar(formData)

  if (!updated) {
    return NextResponse.json({ status: 400 })
  }

  const encontreiroUpdated = {
    id: updated.id,
    email: updated.email,
  }

  return NextResponse.json(encontreiroUpdated, { status: 201 })
}
