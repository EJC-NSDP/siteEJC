import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import isoWeek from 'dayjs/plugin/isoWeek'
import weekday from 'dayjs/plugin/weekday'

dayjs.extend(isBetween)
dayjs.extend(isoWeek)
dayjs.extend(weekday)

export function isBirthdayInCurrentWeek(birthDate: Date) {
  const today = dayjs()

  // início e fim da semana (domingo a domingo)
  const startOfWeek = today.weekday(0).startOf('day') // domingo
  const endOfWeek = today.weekday(6).endOf('day') // sábado

  // normaliza o nascimento para o ano atual
  const birthdayThisYear = dayjs(birthDate).year(today.year())

  return birthdayThisYear.isBetween(startOfWeek, endOfWeek, null, '[]')
}
