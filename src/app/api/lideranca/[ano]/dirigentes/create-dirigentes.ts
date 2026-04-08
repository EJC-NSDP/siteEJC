import { prisma } from '@/lib/prisma'

interface DirigentesInput {
  idPessoa: string
  idDom: string
  idPasta: string
}

export async function createDirigentes(dirigentes: DirigentesInput[]) {
  // Pega o maior ano da tabela liderança com função dirigente
  const ultimoAno = await prisma.lideranca.aggregate({
    _max: { ano: true },
    where: { idFuncao: 'dirigente' },
  })

  const novoAno = (ultimoAno._max.ano ?? new Date().getFullYear()) + 1

  // Remove role DIRIGENTE de quem tinha
  const dirigentesAtuais = await prisma.pessoa.findMany({
    where: { roles: { has: 'DIRIGENTE' } },
    select: { id: true, roles: true },
  })

  await Promise.all(
    dirigentesAtuais.map((p) =>
      prisma.pessoa.update({
        where: { id: p.id },
        data: {
          roles: { set: p.roles.filter((r) => r !== 'DIRIGENTE') },
        },
      }),
    ),
  )

  // Cria os novos registros na liderança
  await prisma.lideranca.createMany({
    data: dirigentes.map((d) => ({
      idPessoa: d.idPessoa,
      idFuncao: 'dirigente',
      idDom: d.idDom,
      idPasta: d.idPasta,
      ano: novoAno,
    })),
  })

  // Adiciona role DIRIGENTE aos novos
  await Promise.all(
    dirigentes.map(async (d) => {
      const pessoa = await prisma.pessoa.findUnique({
        where: { id: d.idPessoa },
        select: { roles: true },
      })
      if (!pessoa) return
      await prisma.pessoa.update({
        where: { id: d.idPessoa },
        data: {
          roles: { push: 'DIRIGENTE' },
        },
      })
    }),
  )

  return { ano: novoAno, criados: dirigentes.length }
}
