import type { CirculoEncontro } from '@/app/api/encontro/atual/[ignorar]/circulos/get-circulos'

export function ordenarCirculos(
  baseOrder: string,
  circulos: CirculoEncontro[],
) {
  // Converter a string de baseOrder em um array de números
  const order = baseOrder.split('').map(Number)

  // Criar um mapeamento dos IDs para suas posições
  const idPositionMap = new Map<number, number>()
  order.forEach((id, index) => {
    idPositionMap.set(id, index)
  })

  // Ordenar o array com base nas posições mapeadas
  return circulos.sort((a, b) => {
    const posA = idPositionMap.get(a.idCorCirculo)
    const posB = idPositionMap.get(b.idCorCirculo)

    // Se um dos IDs não estiver no mapeamento, manter a ordem original entre eles
    if (posA === undefined) return 1
    if (posB === undefined) return -1

    return posA - posB
  })
}
