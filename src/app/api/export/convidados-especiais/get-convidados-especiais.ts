import { prisma } from '@/lib/prisma'

export async function getAllConvidadosEspeciais() {
  const convidadosEspeciais = await prisma.pessoa.findMany({
    select: {
      nome: true,
      sobrenome: true,
      apelido: true,
      email: true,
      changePassword: true,
      encontreiro: {
        select: {
          encontro: {
            select: {
              numeroEncontro: true,
            },
          },
        },
      },
    },
    where: {
      encontreiro: {
        statusMontagem: 'CONVIDADO_ESPECIAL',
      },
    },
  })

  const parsedData = convidadosEspeciais.map((encontreiro) => {
    return {
      nomeCompleto: `${encontreiro.nome} ${encontreiro.sobrenome}`,
      apelido: encontreiro.apelido,
      email: encontreiro.email,
      encontro:
        encontreiro.encontreiro?.encontro?.numeroEncontro.toString() || '?',
      senhaAlterada: encontreiro.changePassword ? 'Não' : 'Sim',
    }
  })
  return parsedData
}
