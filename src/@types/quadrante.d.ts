export interface EncontreiroQuadrante {
  nome: string
  apelido: string
  celular: string
  bairro: string
  instagram: string
  equipe: string
  coord: boolean
  encontro: string
}

export interface EncontristaQuadrante {
  nome: string
  apelido: string
  dataNasc: string
  celular: string
  bairro: string
  instagram: string
  coord: boolean
}

export interface CirculoQuadrante {
  cor: string
  integrantes: EncontristaQuadrante[]
}

export interface EquipeQuadrante {
  nome: string
  value: string
  descricao: string
  integrantes: EncontreiroQuadrante[]
}

export interface TioExternaQuadrante {
  nome: string
  bairro: string
}

export interface EquipeTiosExternaQuadrante {
  nome: string
  descricao: string
  integrantes: TioExternaQuadrante[]
}

export interface EquipePalestrantesQuadrante {
  nome: string
  descricao: string
  integrantes: PalestranteQuadrante[]
}

export interface PalestranteQuadrante {
  nome: string
  tema: string
}

export interface EquipeBPsQuadrante {
  nome: string
  descricao: string
  integrantes: EncontreiroQuadrante[]
}

export interface EquipePastoraisQuadrante {
  nome: string
  descricao: string
  pastorais: PastoralQuadrante[]
}

export interface PastoralQuadrante {
  nome: string
  logo: string
  integrantes: string[]
}

export interface CapasQuadrante {
  principal: {
    pb: string
    colorida: string
  }
  circulos: {
    pb: string
    colorida: string
  }
  equipes: string
  qrcode: string
}

export interface CartasQuadrante {
  papa: string
  padre: string
  diris: string
}

export interface CartazQuadrante {
  cor: string
  imagem: string
}

export interface ConfigQuadrante {
  capas: CapasQuadrante
  cartas: CartasQuadrante
  cartazes: CartazQuadrante[]
}

export interface QuadranteData {
  config: ConfigQuadrante
  circulos: CirculoQuadrante[]
  equipes?: EquipeQuadrante[]
  tiosExterna?: EquipeTiosExternaQuadrante
  palestrantes?: EquipePalestrantesQuadrante
  bonsPastores?: EquipeBPsQuadrante
  pastorais?: EquipePastoraisQuadrante
}
