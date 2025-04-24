import { NextResponse } from 'next/server'
import { getProfile } from './get-profile'

interface ProfileProps {
  id: string
}

export async function GET(request: Request, context: { params: ProfileProps }) {
  const profile = await getProfile(context.params.id)

  return NextResponse.json(profile)
}
