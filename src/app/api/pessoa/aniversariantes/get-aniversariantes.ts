import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import weekday from 'dayjs/plugin/weekday'

import { prisma } from '@/lib/prisma'

dayjs.extend(isBetween)
dayjs.extend(weekday)

export interface Aniversariantes {
  nome: string
  apelido: string | null
  dataNasc: string
  idade: number
  numeroEncontro: number
  avatarUrl: string | null
}

export async function getBirthdaysOfWeek(): Promise<Aniversariantes[]> {
  let today = dayjs()

  if (today.weekday() === 0) {
    today = today.subtract(1, 'day')
  }

  const startOfWeek = today.weekday(1).startOf('day')
  const endOfWeek = today.weekday(7).endOf('day')

  const users = await prisma.pessoa.findMany({
    select: {
      nome: true,
      sobrenome: true,
      apelido: true,
      avatarUrl: true,
      encontreiro: {
        select: {
          dataNasc: true,
          encontro: {
            select: {
                numeroEncontro: true,
            },  
          }
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

  return birthdaysThisWeek.map((pessoa) => ({
    nome: `${pessoa.nome} ${pessoa.sobrenome}`,
    apelido: pessoa.apelido,
    dataNasc: dayjs(pessoa.encontreiro!.dataNasc).format('DD/MM'),
    idade: today.year() - dayjs(pessoa.encontreiro!.dataNasc).year(),
    numeroEncontro: pessoa.encontreiro!.encontro!.numeroEncontro || 0,
    avatarUrl: pessoa.avatarUrl,
  }))
}