interface CirculoTioFormData {
  id: string
  numeroEncontro: string
  nome: string
}

export interface CirculoFormData {
  id: string
  idEncontro: string
  nome: string | null
  corCirculo: string
  tioAparente: CirculoTioFormData | null
  tioSecreto: CirculoTioFormData | null
}
