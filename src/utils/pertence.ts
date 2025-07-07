export function idPertenceATropa(equipe: string): boolean {
  const categorias = [
    'banda',
    'cozinha',
    'garcom',
    'liturgia',
    'mini',
    'ordem',
    'secretaria',
    'teatro',
  ]
  return categorias.includes(equipe)
}

export function idPertenceARosa(equipe: string): boolean {
  const categorias = [
    'vigilia',
    'recepcao',
    'compras',
    'externa',
    'meditacao',
    'rosa',
  ]
  return categorias.includes(equipe)
}

export function idPertenceASala(equipe: string): boolean {
  const categorias = [
    'apresentacao',
    'boa_vontade',
    'tio_aparente',
    'tio_circulo',
    'tio_secreto',
    'sala',
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
    'Rosa',
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
    'Sala',
  ]
  return categorias.includes(equipe)
}
