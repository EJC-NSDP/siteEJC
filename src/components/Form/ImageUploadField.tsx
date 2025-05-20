'use client'

import { api } from '@/lib/axios'
import type { Value_Quadrante as valueQuadrante } from '@prisma/client'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { useController, UseControllerProps } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '../ui/button'

interface ImageUploadFieldProps extends UseControllerProps {
  label?: string
  publicId: string
  folder: string
  valueToBeUpdated: valueQuadrante
}

interface UploadWidget {
  open: () => void
  close: () => void
  upload: () => void
}

interface UploadWidgetError {
  message: string
}

interface UploadWidgetResult {
  event: string
  info: {
    secure_url: string
    public_id: string
    [key: string]: unknown
  }
}

declare global {
  interface Window {
    cloudinary: {
      createUploadWidget: (
        options: object,
        callback: (
          error: UploadWidgetError | null,
          result: UploadWidgetResult,
        ) => void,
      ) => UploadWidget
    }
  }
}

export function ImageUploadField({
  label,
  publicId,
  folder,
  valueToBeUpdated,
  ...props
}: ImageUploadFieldProps) {
  const {
    field: { value, onChange, name },
  } = useController(props)

  const widgetRef = useRef<UploadWidget | null>(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://widget.cloudinary.com/v2.0/global/all.js'
    script.async = true

    script.onload = async () => {
      const res = await fetch(
        `/api/cloudinary/sign-upload?publicId=${publicId}&folder=${folder}`,
      )
      const data = await res.json()

      const aspectRatio = name === 'imagem' ? '1:1' : '1000:1414'

      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: data.cloudName,
          apiKey: data.apiKey,
          uploadSignature: data.signature,
          uploadSignatureTimestamp: data.timestamp,
          publicId: data.public_id,
          folder: data.folder,
          overwrite: true,
          multiple: false,
          sources: ['local', 'url', 'camera'],
          cropping: false,
          showUploadMoreButton: false,
          clientAllowedFormats: ['jpg', 'png', 'jpeg'],
          uploadMode: 'manual',
          transformation: [{ aspect_ratio: aspectRatio, crop: 'fit' }],
        },
        async (error, result) => {
          if (!error && result.event === 'success') {
            const imageUrl = result.info.secure_url

            onChange(imageUrl)
            try {
              await api.patch('secretaria/quadrante/update-image', {
                value: valueToBeUpdated,
                imageUrl,
              })
              toast.success('Imagem atualizada com sucesso')
            } catch {
              toast.error('Erro ao atualizar a imagem')
            }
          }
        },
      )

      widgetRef.current = widget
    }

    document.body.appendChild(script)
  }, [publicId, folder, onChange, valueToBeUpdated, name])

  const openWidget = () => {
    if (!widgetRef.current) return

    widgetRef.current.open()

    // Espera o usuário escolher e clicar "OK"
    const interval = setInterval(() => {
      const dialog = document.querySelector('.cloudinary-button')
      if (dialog) {
        // Quando "OK" for clicado, envia o upload
        dialog.addEventListener('click', () => {
          widgetRef.current?.upload()
          clearInterval(interval)
        })
      }
    }, 300)
  }

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-muted-foreground text-sm font-medium">
          {label}
        </label>
      )}

      <div className="bg-muted flex h-40 w-full items-center justify-center overflow-hidden rounded border border-dashed">
        {value ? (
          <Image
            src={value}
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

      <Button type="button" variant="secondary" onClick={openWidget}>
        Selecionar imagem
      </Button>
    </div>
  )
}
