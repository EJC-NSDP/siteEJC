import { NextResponse } from 'next/server'
import { getProfile } from './get-profile'

interface ProfileProps {
  id: string
}

export async function GET(
  request: Request,
  context: { params: Promise<ProfileProps> },
) {
  const profile = await getProfile((await context.params).id)

  return NextResponse.json(profile)
}
