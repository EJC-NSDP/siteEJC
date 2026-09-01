import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'

export function getMonthBR(date: Date | string) {
  return dayjs(date).locale('pt-BR').format('MMMM')
}
