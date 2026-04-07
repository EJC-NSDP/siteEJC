import { prisma } from '@/lib/prisma'

export type TiosCirculo = {
  id: string
  nome: string
  encontro?: string
  roles: string[]
}

export async function getTiosCirculo() {
  const pessoasTios = await prisma.equipeMontagem.findMany({
    select: {
      encontreiro: {
        select: {
          pessoa: {
            select: {
              id: true,
              nome: true,
              sobrenome: true,
              roles: true,
            },
          },
          encontro: {
            select: {
              numeroEncontro: true,
            },
          },
        },
      },
    },
    where: {
      OR: [
        { valueEquipe: 'tio_circulo' },
        { valueEquipe: 'tio_aparente' },
        { valueEquipe: 'tio_secreto' },
      ],
    },
  })

  const tiosCirculo = pessoasTios.map((pessoaTio) => {
    return {
      id: pessoaTio.encontreiro.pessoa.id,
      nome:
        pessoaTio.encontreiro.pessoa.nome +
        ' ' +
        pessoaTio.encontreiro.pessoa.sobrenome,
      encontro: pessoaTio.encontreiro.encontro!.numeroEncontro,
      roles: pessoaTio.encontreiro.pessoa.roles,
    }
  })

  tiosCirculo.sort((a, b) => a.nome.localeCompare(b.nome))

  return tiosCirculo
}
