'use client'

import { updateCapas, updateProfile } from '@/actions/updateCloudinary'
import type { Value_Quadrante as valueQuadrante } from '@prisma/client'
import type { Session } from 'next-auth'
import { getSession, useSession } from 'next-auth/react'
import type { CloudinaryUploadWidgetResults } from 'next-cloudinary'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'
import { UploadWidgetWrapper } from './UploadWidgetWrapper'

interface ImageUploadProps {
  label?: string
  publicId: string
  folder: string
  valueToBeUpdated: valueQuadrante | string
  imageValue: string | undefined
  type: 'profile' | 'capa' | 'cartaz'
}

export function ImageUpload({
  label,
  publicId,
  folder,
  valueToBeUpdated,
  imageValue,
  type,
}: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState(imageValue)
  const { update } = useSession()
  const aspectRatio = type === 'capa' ? 1 / 1.414 : 1 / 1 // alterar capa

  async function handleUpload(results: CloudinaryUploadWidgetResults) {
    const info = results.info

    if (
      results.event !== 'success' ||
      typeof info !== 'object' ||
      !info.secure_url
    ) {
      toast.error('Erro ao enviar imagem')
      return
    }

    const newImageUrl = info.secure_url
    setImageUrl(newImageUrl)

    try {
      if (type === 'profile') {
        await updateProfile({
          slug: valueToBeUpdated,
          avatarUrl: newImageUrl,
        })

        const data = await getSession()

        if (data) {
          const updatedSession: Session = {
            expires: data.expires,
            user: { avatar_url: newImageUrl, ...data.user },
          }
          console.log('Sessão atualizada: ', updatedSession)
          await update(updatedSession)
        }
      } else {
        await updateCapas({
          value: valueToBeUpdated as valueQuadrante,
          imageUrl: newImageUrl,
        })
      }
      toast.success('Imagem atualizada com sucesso')
    } catch {
      toast.error('Erro ao atualizar a imagem')
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-muted-foreground text-sm font-medium">
          {label}
        </label>
      )}

      <div className="bg-muted flex h-40 w-full items-center justify-center overflow-hidden rounded border border-dashed p-1">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="Imagem enviada"
            width={500}
            height={500}
            className="max-h-full object-contain"
          />
        ) : (
          <span className="text-sm text-gray-500">
            Nenhuma imagem selecionada
          </span>
        )}
      </div>

      <UploadWidgetWrapper
        folder={folder}
        publicId={publicId}
        aspectRatio={aspectRatio}
        type={type}
        handleUpload={handleUpload}
      />
    </div>
  )
}
