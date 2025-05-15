// lib/quadrante/fetchAllData.ts

import type {
  CirculoQuadrante,
  ConfigQuadrante,
  EquipeBPsQuadrante,
  EquipePalestrantesQuadrante,
  EquipePastoraisQuadrante,
  EquipeQuadrante,
  EquipeTiosExternaQuadrante,
  QuadranteData,
} from '@/@types/quadrante'

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(`${process.env.NEXTAUTH_URL}${url}`, {
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Erro ao buscar ${url}`)
  return res.json()
}

export async function fetchQuadranteData(
  modo: 'imprimir' | 'completo',
): Promise<QuadranteData> {
  if (modo === 'imprimir') {
    const [circulos, config] = await Promise.all([
      fetchJson<CirculoQuadrante[]>('/api/secretaria/quadrante/encontrista'),
      fetchJson<ConfigQuadrante>('/api/secretaria/quadrante/settings'),
    ])

    return {
      circulos,
      config,
    }
  }

  // Modo completo
  const [
    circulos,
    equipes,
    tiosExterna,
    palestrantes,
    bonsPastores,
    pastorais,
    config,
  ] = await Promise.all([
    fetchJson<CirculoQuadrante[]>('/api/secretaria/quadrante/encontrista'),
    fetchJson<EquipeQuadrante[]>('/api/secretaria/quadrante/encontreiro'),
    fetchJson<EquipeTiosExternaQuadrante>(
      '/api/secretaria/quadrante/tio-externa',
    ),
    fetchJson<EquipePalestrantesQuadrante>(
      '/api/secretaria/quadrante/palestrante',
    ),
    fetchJson<EquipeBPsQuadrante>('/api/secretaria/quadrante/bom-pastor'),
    fetchJson<EquipePastoraisQuadrante>('/api/secretaria/quadrante/pastoral'),
    fetchJson<ConfigQuadrante>('/api/secretaria/quadrante/settings'),
  ])

  return {
    circulos,
    equipes,
    tiosExterna,
    palestrantes,
    bonsPastores,
    pastorais,
    config,
  }
}
