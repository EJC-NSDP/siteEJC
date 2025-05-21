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
