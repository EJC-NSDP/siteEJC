import { NextResponse } from 'next/server'

import { deletePastoral, type DeletePastoralProps } from './delete-pastoral'

export async function DELETE(
  request: Request,
  context: { params: Promise<DeletePastoralProps> },
) {
  const deletedPastoral = await deletePastoral(await context.params)

  return NextResponse.json(deletedPastoral)
}
