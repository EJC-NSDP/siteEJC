'use client'

import type { ProfileData } from '@/app/api/encontreiro/[id]/profile/get-profile'
import { CardLoading } from '@/components/CardLoading'
import { ImageUpload } from '@/components/Form/ImageUpload'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { getProfile } from '@/utils/fetch-profile'
import { ChevronLeft, CircleHelp } from 'lucide-react'
import { getSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function EditAvatar() {
  const [open, setOpen] = useState(false)
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    setIsTouch(window.matchMedia('(pointer: coarse)').matches)
  }, [])

  const handleClick = () => setOpen((prev) => !prev)
  const handleMouseEnter = () => !isTouch && setOpen(true)
  const handleMouseLeave = () => !isTouch && setOpen(false)

  const [profileData, setProfileData] = useState<ProfileData | undefined>(
    undefined,
  )

  useEffect(() => {
    async function fetchSession() {
      const session = await getSession()
      if (session) {
        const data: ProfileData = await getProfile(session.user.id)
        setProfileData(data)
      }
    }
    fetchSession()
  }, [])

  return (
    <div className="w-full p-4 lg:px-96 lg:py-16">
      {!profileData ? (
        <CardLoading />
      ) : (
        <Card className="w-full space-y-4 rounded-xl border-none p-8">
          <CardTitle className="flex flex-col items-start justify-start gap-4">
            <Link
              href="/admin/profile"
              className="flex items-center hover:underline"
            >
              <ChevronLeft className="size-4" />
              <span className="text-sm">Voltar</span>
            </Link>
            <Tooltip open={open} onOpenChange={setOpen} delayDuration={0}>
              <div className="flex items-start gap-4">
                <span className="text-tertiary">Editar sua foto</span>
                <TooltipTrigger
                  type="button"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={handleClick}
                >
                  <CircleHelp className="size-4 cursor-pointer" />
                </TooltipTrigger>
              </div>
              <TooltipContent className="w-auto">
                Opte por fotos 1:1 (quadradas)
              </TooltipContent>
            </Tooltip>
          </CardTitle>

          <CardContent className="p-0">
            {profileData && (
              <ImageUpload
                publicId={profileData.slug}
                folder="/people"
                imageValue={profileData.avatarUrl}
                type="profile"
                valueToBeUpdated={profileData.slug}
              />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
