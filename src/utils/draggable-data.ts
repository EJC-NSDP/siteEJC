import type { CarroDropData } from '@/app/(app)/admin/externa/(tios externa)/alocacao-carros/Carro'
import type { EncontristaDragData } from '@/app/(app)/admin/externa/circulos/CardEncontristas'
import type { CirculoDropData } from '@/app/(app)/admin/externa/circulos/Circulo'
import { Active, DataRef, Over } from '@dnd-kit/core'

type DraggableData = EncontristaDragData | CirculoDropData | CarroDropData

export function hasDraggableData<T extends Active | Over>(
  entry: T | null | undefined,
): entry is T & {
  data: DataRef<DraggableData>
} {
  if (!entry) {
    return false
  }

  const data = entry.data.current

  if (
    data?.type === 'Encontrista' ||
    data?.type === 'Circulo' ||
    data?.type === 'Carro'
  ) {
    return true
  }

  return false
}
