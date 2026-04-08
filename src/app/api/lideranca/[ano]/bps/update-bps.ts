import { prisma } from '@/lib/prisma'

interface BPsInput {
  idPessoa: string
}

export async function updateBPs(ano: number, bps: BPsInput[]) {
  const bpsAntigos = await prisma.lideranca.findMany({
    where: { ano, idFuncao: 'bp' },
    select: { idPessoa: true },
  })

  const idsAntigos = new Set(bpsAntigos.map((d) => d.idPessoa))
  const idsNovos = new Set(bps.map((d) => d.idPessoa))

  const removidos = [...idsAntigos].filter((id) => !idsNovos.has(id))
  const adicionados = [...idsNovos].filter((id) => !idsAntigos.has(id))

  // Atualiza os bps
  await Promise.all(
    adicionados.map((id) =>
      prisma.lideranca.create({
        data: {
          idPessoa: id,
          ano,
          idFuncao: 'bp',
        },
      }),
    ),
  )

  // Remove role BP de quem saiu
  await Promise.all(
    removidos.map(async (id) => {
      await prisma.lideranca.delete({
        where: {
          idPessoa_ano: {
            idPessoa: id,
            ano,
          },
        },
      })
      const pessoa = await prisma.pessoa.findUnique({
        where: { id },
        select: { roles: true },
      })
      if (!pessoa) return
      await prisma.pessoa.update({
        where: { id },
        data: {
          roles: { set: pessoa.roles.filter((r) => r !== 'BP') },
        },
      })
    }),
  )

  // Adiciona role BP a quem entrou
  await Promise.all(
    adicionados.map(async (id) => {
      const pessoa = await prisma.pessoa.findUnique({
        where: { id },
        select: { roles: true },
      })
      if (!pessoa) return
      await prisma.pessoa.update({
        where: { id },
        data: {
          roles: { push: 'BP' },
        },
      })
    }),
  )

  return { ano, atualizados: bps.length }
}
