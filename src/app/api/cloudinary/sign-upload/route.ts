import { NextResponse } from 'next/server'
import { signUpload } from './sign-upload'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const publicId = searchParams.get('publicId')
  const folder = searchParams.get('folder')

  if (!publicId || !folder) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  }

  return signUpload({ publicId, folder })
}
