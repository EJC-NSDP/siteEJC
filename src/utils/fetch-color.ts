import { idPertenceARosa, idPertenceASala } from './pertence'

export function getCirculoColor(label: string) {
  return label === 'Amarelo'
    ? 'bg-yellow-500'
    : label === 'Azul'
      ? 'bg-blue-500'
      : label === 'Laranja'
        ? 'bg-orange-500'
        : label === 'Verde'
          ? 'bg-emerald-500'
          : label === 'Vermelho'
            ? 'bg-red-500'
            : 'bg-zinc-200'
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
