export function idPertenceARosa(equipe: string): boolean {
  const categorias = ['vigilia', 'recepcao', 'compras', 'externa', 'meditacao']
  return categorias.includes(equipe)
}

export function idPertenceASala(equipe: string): boolean {
  const categorias = [
    'apresentacao',
    'boa_vontade',
    'tio_aparente',
    'tio_circulo',
    'tio_secreto',
  ]
  return categorias.includes(equipe)
}

export function labelPertenceARosa(equipe: string): boolean {
  const categorias = [
    'Vigília',
    'Recepção de Pais e Palestrantes',
    'Compras',
    'Externa',
    'Meditação',
  ]
  return categorias.includes(equipe)
}

export function labelPertenceASala(equipe: string): boolean {
  const categorias = [
    'Apresentação',
    'Boa Vontade',
    'Tio Aparente',
    'Tio de Círculo',
    'Tio Secreto',
  ]
  return categorias.includes(equipe)
}
