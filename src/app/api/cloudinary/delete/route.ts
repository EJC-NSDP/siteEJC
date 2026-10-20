import { v2 as cloudinary } from 'cloudinary'
import { NextResponse, type NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth/auth-options'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { fileUrl } = await request.json()
  if (!fileUrl) return NextResponse.json({ error: 'fileUrl required' }, { status: 400 })

  // Extract public_id from Cloudinary URL: everything after /upload/ (skipping optional version segment)
  const match = (fileUrl as string).match(/\/upload\/(?:v\d+\/)?(.+)/)
  if (!match) return NextResponse.json({ error: 'Invalid Cloudinary URL' }, { status: 400 })
  const publicId = match[1]

  await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' })

  return NextResponse.json({ ok: true })
}
