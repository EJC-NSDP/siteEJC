import { Camera, Check, CircleOff, Loader, ScanSearch } from 'lucide-react'
import type { CloudinaryUploadWidgetResults } from 'next-cloudinary'
import { CldUploadWidget } from 'next-cloudinary'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'

import { updateProfile } from '@/actions/updateCloudinary'
import type { EncontreiroMontagemSummaryData } from '@/app/api/encontreiro/montagem/get-montagem-summary'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { getInitials } from '@/utils/get-initials'
import { idPertenceARosa, idPertenceASala } from '@/utils/pertence'

import { EncontreiroMontagemCoord } from './EncontreiroMontagemCoord'
import { EncontreiroMontagemEquipe } from './EncontreiroMontagemEquipe'

interface EncontreiroTableRowProps {
  encontreiro: EncontreiroMontagemSummaryData
}

function canBeCoord(equipeValue: string) {
  if (equipeValue === 'loading') return 'loading'
  if (equipeValue === 'nao_participara' || equipeValue === 'select_equipe')
    return 'disabled'
  if (idPertenceARosa(equipeValue) || equipeValue === 'apresentacao')
    return 'mandatory'
  if (idPertenceASala(equipeValue)) return 'disabled'
  return 'enabled'
}

export function EncontreiroTableRow({ encontreiro }: EncontreiroTableRowProps) {
  const [coordEnable, setCoordEnable] = useState(
    encontreiro.equipe ? canBeCoord(encontreiro.equipe.value) : 'disabled',
  )
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    encontreiro.avatarUrl?.startsWith('http') ? encontreiro.avatarUrl : null,
  )

  function updateCoordEnable(equipeValue: string) {
    setCoordEnable(canBeCoord(equipeValue))
  }

  async function handleAvatarUpload(results: CloudinaryUploadWidgetResults) {
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
    setAvatarUrl(newImageUrl)
    try {
      await updateProfile({ slug: encontreiro.slug, avatarUrl: newImageUrl })
      toast.success('Foto atualizada com sucesso')
    } catch {
      toast.error('Erro ao atualizar a foto')
    }
  }

  return (
    <TableRow className="bg-white">
      <TableCell className="flex items-center gap-4">
        <div className="flex flex-col items-center gap-2">
          <CldUploadWidget
            signatureEndpoint="/api/cloudinary/sign-upload"
            uploadPreset="signed_upload"
            options={{
              folder: '/people',
              publicId: encontreiro.slug,
              cropping: true,
              croppingAspectRatio: 1,
              croppingShowDimensions: true,
              showSkipCropButton: false,
              croppingCoordinatesMode: 'custom',
              clientAllowedFormats: ['jpg', 'jpeg', 'png'],
              multiple: false,
            }}
            onSuccess={(result) => handleAvatarUpload(result)}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="group relative cursor-pointer"
              >
                <Avatar className="size-10">
                  <AvatarImage
                    src={avatarUrl ?? undefined}
                    className="transition-opacity duration-300 group-hover:opacity-50"
                  />
                  <AvatarFallback>{getInitials(encontreiro.nome)}</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Camera className="size-4 text-white" />
                </div>
              </button>
            )}
          </CldUploadWidget>
          <span className="text-center text-nowrap text-xs text-zinc-600">
            {encontreiro.encontro}º EJC
          </span>
        </div>
        <span className="text-zinc-800">{encontreiro.nome}</span>
      </TableCell>
      <TableCell>{encontreiro.bairro}</TableCell>
      <TableCell>
        {encontreiro.disponibilidade === ''
          ? 'Não preencheu'
          : encontreiro.disponibilidade}
      </TableCell>
      <TableCell>
        <div className="flex flex-col items-center gap-2 text-left">
          {encontreiro.preferencias.map((preferencias, index) => {
            return (
              <span className="w-full text-xs" key={index}>
                {preferencias}
              </span>
            )
          })}
        </div>
      </TableCell>
      <TableCell>
        <EncontreiroMontagemEquipe
          idEncontreiro={encontreiro.id}
          valueEquipe={encontreiro.equipe ? encontreiro.equipe.value : null}
          changeCoordStatus={updateCoordEnable}
        />
      </TableCell>
      <TableCell>
        {coordEnable === 'enabled' && encontreiro.equipe ? (
          <EncontreiroMontagemCoord
            idEncontreiro={encontreiro.id}
            coordStatus={encontreiro.equipe.coordenando}
          />
        ) : coordEnable === 'disabled' ? (
          <CircleOff className="size-4 text-zinc-300" />
        ) : coordEnable === 'mandatory' ? (
          <Check className="text-primary/80 size-4" />
        ) : (
          <Loader className="size-4 animate-spin text-zinc-500" />
        )}
      </TableCell>
      <TableCell>
        <Link href={`/admin/dirigente/info-encontreiro/${encontreiro.slug}`}>
          <Button variant="outline" className="border-primary/80">
            <ScanSearch className="text-primary size-5" />
          </Button>
        </Link>
      </TableCell>
    </TableRow>
  )
}
