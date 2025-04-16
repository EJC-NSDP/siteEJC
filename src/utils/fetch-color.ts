export function getColor(color: string | null) {
  return color === 'Amarelo'
    ? 'bg-yellow-500'
    : color === 'Azul'
      ? 'bg-blue-500'
      : color === 'Laranja'
        ? 'bg-orange-500'
        : color === 'Verde'
          ? 'bg-emerald-500'
          : color === 'Vermelho'
            ? 'bg-red-500'
            : 'bg-zinc-200'
}
