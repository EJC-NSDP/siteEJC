import type { ProfileData } from '@/app/api/encontreiro/[id]/profile/get-profile'
import { api } from '@/lib/axios'

export async function getProfile(id: string) {
  const res = await api.get(`encontreiro/${id}/profile`)

  if (res.status !== 200) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }

  const profileData = await res.data

  return profileData
}

export async function getProfileSlug(slug: string): Promise<ProfileData> {
  const id: string = await fetch(
    `${process.env.NEXTAUTH_URL}/api/pessoa/id-from-slug/${slug}`,
    { cache: 'no-store' },
  ).then(async (res) => await res.json())
  console.log(id)

  const profileData = await fetch(
    `${process.env.NEXTAUTH_URL}/api/encontreiro/${id}/profile`,
    { cache: 'no-store' },
  ).then(async (res) => await res.json())

  return profileData
}
