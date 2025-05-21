'use client'

import type { ProfileData } from '@/app/api/encontreiro/[id]/profile/get-profile'
import { CardLoading } from '@/components/CardLoading'
import { ImageUpload } from '@/components/Form/ImageUpload'
import { Card, CardTitle } from '@/components/ui/card'
import { getProfile } from '@/utils/fetch-profile'
import { getSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function EditAvatar() {
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
    <div className="w-full p-4 lg:px-40 lg:py-16">
      {!profileData ? (
        <CardLoading />
      ) : (
        <Card className="w-full space-y-8 rounded-xl border-none p-8">
          <CardTitle>Editar sua foto</CardTitle>

          {profileData && (
            <ImageUpload
              publicId={profileData.slug}
              folder="/people"
              imageValue={profileData.avatarUrl}
              type="profile"
              valueToBeUpdated={profileData.slug}
            />
          )}
        </Card>
      )}
    </div>
  )
}
