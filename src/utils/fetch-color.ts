import { idPertenceARosa, idPertenceASala } from './pertence'

export function getCirculoColor(label: string, place?: string) {
  const format = place || 'bg'
  return label === 'Amarelo'
    ? `${format}-yellow-500`
    : label === 'Azul'
      ? `${format}-blue-500`
      : label === 'Laranja'
        ? `${format}-orange-500`
        : label === 'Verde'
          ? `${format}-emerald-500`
          : label === 'Vermelho'
            ? `${format}-red-500`
            : `${format}-zinc-200`
}

export function getCirculoTitleColor(label: string) {
  return label === 'Amarelo'
    ? 'text-yellow-500'
    : label === 'Azul'
      ? 'text-blue-500'
      : label === 'Laranja'
        ? 'text-orange-500'
        : label === 'Verde'
          ? 'text-emerald-500'
          : label === 'Vermelho'
            ? 'text-red-500'
            : 'text-black'
}

export function getEquipeColor(id: string) {
  return idPertenceASala(id)
    ? 'bg-amber-900/80'
    : idPertenceARosa(id)
      ? 'bg-pink-500'
      : id === 'banda'
        ? 'bg-yellow-500'
        : id === 'cozinha'
          ? 'bg-blue-500'
          : id === 'garcom'
            ? 'bg-green-500'
            : id === 'liturgia'
              ? 'bg-red-500'
              : id === 'mini'
                ? 'bg-white border border-zinc-300'
                : id === 'ordem'
                  ? 'bg-zinc-500'
                  : id === 'secretaria'
                    ? 'bg-orange-500'
                    : id === 'teatro'
                      ? 'bg-black'
                      : id === 'dirigente'
                        ? 'bg-primary/90'
                        : 'bg-zinc-200'
}

export function getEquipeBorderColor(id: string) {
  return idPertenceASala(id)
    ? 'border-amber-900'
    : idPertenceARosa(id)
      ? 'border-pink-700'
      : id === 'banda'
        ? 'border-yellow-700'
        : id === 'cozinha'
          ? 'border-blue-700'
          : id === 'garcom'
            ? 'border-green-700'
            : id === 'liturgia'
              ? 'border-red-700'
              : id === 'mini'
                ? 'border-black'
                : id === 'ordem'
                  ? 'border-zinc-700'
                  : id === 'secretaria'
                    ? 'border-orange-700'
                    : id === 'teatro'
                      ? 'border-black'
                      : id === 'dirigente'
                        ? 'border-primary'
                        : 'border-zinc-400'
}

export function getTextEquipeColor(id: string) {
  return idPertenceASala(id)
    ? 'text-amber-900'
    : idPertenceARosa(id)
      ? 'text-pink-700'
      : id === 'banda'
        ? 'text-yellow-700'
        : id === 'cozinha'
          ? 'text-blue-700'
          : id === 'garcom'
            ? 'text-green-700'
            : id === 'liturgia'
              ? 'text-red-700'
              : id === 'mini'
                ? 'text-black'
                : id === 'ordem'
                  ? 'text-zinc-700'
                  : id === 'secretaria'
                    ? 'text-orange-700'
                    : id === 'teatro'
                      ? 'text-white'
                      : id === 'dirigente'
                        ? 'text-primary'
                        : 'text-zinc-400'
}
