import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import weekday from 'dayjs/plugin/weekday'

dayjs.extend(isBetween)
dayjs.extend(weekday)

export interface Aniversariantes {
  nome: string
  dataNasc: string
}

export async function getBirthdaysOfWeek(): Promise<Aniversariantes[]> {
  let today = dayjs()

  // Se for domingo (weekday = 0 no dayjs), volta um dia pra cair no sábado
  if (today.weekday() === 0) {
    today = today.subtract(1, 'day')
  }

  // início (segunda) e fim (domingo) da semana
  const startOfWeek = today.weekday(1).startOf('day')
  const endOfWeek = today.weekday(7).endOf('day')

  // Busca todos os usuários
  const users = await prisma.pessoa.findMany({
    select: {
      nome: true,
      sobrenome: true,
      apelido: true,
      encontreiro: {
        select: {
          dataNasc: true,
        },
      },
    },
    where: {
      NOT: [{ role: 'ENCONTRISTA' }, { role: 'TIOEXTERNA' }],
      encontreiro: {
        NOT: { statusMontagem: 'INATIVO' },
      },
    },
  })

  // Filtra aniversariantes da semana
  const birthdaysThisWeek = users
    .filter((pessoa) => {
      const birthdayThisYear = dayjs(pessoa.encontreiro!.dataNasc).year(
        today.year(),
      )
      return birthdayThisYear.isBetween(startOfWeek, endOfWeek, null, '[]')
    })
    .sort((a, b) => {
      const dateA = dayjs(a.encontreiro!.dataNasc).year(today.year()).valueOf()
      const dateB = dayjs(b.encontreiro!.dataNasc).year(today.year()).valueOf()
      return dateA - dateB
    })

  // Retorna no formato desejado
  return birthdaysThisWeek.map((pessoa) => ({
    nome: `${pessoa.nome} ${pessoa.sobrenome} (${pessoa.apelido})`,
    dataNasc: dayjs(pessoa.encontreiro!.dataNasc).format('DD/MM'),
  }))
}
