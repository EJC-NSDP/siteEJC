import { prisma } from '@/lib/prisma'

interface DirigentesInput {
  idPessoa: string
  idDom: string
  idPasta: string
}

export async function updateDirigentes(
  ano: number,
  dirigentes: DirigentesInput[],
) {
  const dirigentesAntigos = await prisma.lideranca.findMany({
    where: { ano, idFuncao: 'dirigente' },
    select: { idPessoa: true },
  })

  const idsAntigos = new Set(dirigentesAntigos.map((d) => d.idPessoa))
  const idsNovos = new Set(dirigentes.map((d) => d.idPessoa))

  const removidos = [...idsAntigos].filter((id) => !idsNovos.has(id))
  const adicionados = [...idsNovos].filter((id) => !idsAntigos.has(id))

  // Atualiza dom e pasta de cada dirigente
  await Promise.all(
    dirigentes.map((d) =>
      prisma.lideranca.upsert({
        where: { idPessoa_ano: { idPessoa: d.idPessoa, ano } },
        update: { idDom: d.idDom, idPasta: d.idPasta },
        create: {
          idPessoa: d.idPessoa,
          ano,
          idDom: d.idDom,
          idPasta: d.idPasta,
          idFuncao: 'dirigente',
        },
      }),
    ),
  )

  // Remove role DIRIGENTE de quem saiu
  await Promise.all(
    removidos.map(async (id) => {
      const pessoa = await prisma.pessoa.findUnique({
        where: { id },
        select: { roles: true },
      })
      if (!pessoa) return
      await prisma.pessoa.update({
        where: { id },
        data: {
          roles: { set: pessoa.roles.filter((r) => r !== 'DIRIGENTE') },
        },
      })
    }),
  )

  // Adiciona role DIRIGENTE a quem entrou
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
          roles: { push: 'DIRIGENTE' },
        },
      })
    }),
  )

  return { ano, atualizados: dirigentes.length }
}
