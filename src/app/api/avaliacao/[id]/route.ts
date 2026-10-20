import { v2 as cloudinary } from 'cloudinary'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth/auth-options'
import { hasRole } from '@/lib/auth/permissions'
import { prisma } from '@/lib/prisma'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions)
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasRole(session.user.roles, ['ADMIN', 'DIRIGENTE'])) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params

  const avaliacao = await prisma.avaliacaoEncontro.findUnique({
    where: { id },
    include: {
      autor: {
        select: {
          id: true,
          nome: true,
          sobrenome: true,
          apelido: true,
          avatarUrl: true,
        },
      },
      respostas: {
        include: {
          pergunta: {
            select: {
              chave: true,
              texto: true,
              descricao: true,
              tipo: true,
              ordem: true,
            },
          },
        },
        orderBy: { pergunta: { ordem: 'asc' } },
      },
      indicacoes: {
        include: {
          encontreiro: {
            select: {
              idPessoa: true,
              pessoa: {
                select: {
                  nome: true,
                  sobrenome: true,
                  apelido: true,
                  avatarUrl: true,
                },
              },
            },
          },
          equipe: { select: { equipeLabel: true, equipeValue: true } },
        },
      },
    },
  })

  if (!avaliacao)
    return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(avaliacao)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions)
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasRole(session.user.roles, ['ADMIN', 'DIRIGENTE'])) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params

  const avaliacao = await prisma.avaliacaoEncontro.findUnique({
    where: { id },
    select: { respostas: { select: { fileUrl: true } } },
  })

  if (avaliacao) {
    for (const resposta of avaliacao.respostas) {
      if (resposta.fileUrl) {
        const match = resposta.fileUrl.match(/\/upload\/(?:v\d+\/)?(.+)/)
        if (match) {
          await cloudinary.uploader.destroy(match[1], { resource_type: 'raw' })
        }
      }
    }
  }

  await prisma.avaliacaoEncontro.delete({ where: { id } })

  return NextResponse.json({ ok: true })
}
