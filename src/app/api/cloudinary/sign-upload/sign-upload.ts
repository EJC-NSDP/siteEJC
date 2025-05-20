import { v2 as cloudinary } from 'cloudinary'
import { NextResponse } from 'next/server'

interface SignUploadProps {
  publicId: string
  folder: string
}

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function signUpload({ publicId, folder }: SignUploadProps) {
  const timestamp = Math.floor(Date.now() / 1000)

  const paramsToSign = {
    public_id: publicId,
    folder,
    timestamp,
    overwrite: 'true',
    source: 'uw',
  }

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!,
  )

  return NextResponse.json({
    signature,
    timestamp,
    public_id: publicId,
    folder,
    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  })
}
