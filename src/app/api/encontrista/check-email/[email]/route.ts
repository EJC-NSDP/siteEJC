import { NextResponse } from 'next/server'

import { checkEmailExists } from './check-email-exists'

interface CheckEmailProps {
  email: string
}

export async function GET(
  request: Request,
  context: { params: Promise<CheckEmailProps> },
) {
  const email = (await context.params).email.toLowerCase()

  const emailExists = await checkEmailExists(email)

  return NextResponse.json(emailExists)
}
