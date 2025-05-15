import type { CartazQuadrante, ConfigQuadrante } from '@/@types/quadrante'
import { prisma } from '@/lib/prisma'

export async function getConfigQuadrante(): Promise<ConfigQuadrante | null> {
  const configs = await prisma.quadrante.findMany()

  const capaPrincipalPB = configs.find((config) => config.value === 'capa_pb')
  const capaPrincipalColorida = configs.find(
    (config) => config.value === 'capa_colorida',
  )
  const capaCirculosPB = configs.find(
    (config) => config.value === 'circulos_pb',
  )
  const capaCirculosColorida = configs.find(
    (config) => config.value === 'circulos_colorida',
  )
  const capaEquipes = configs.find((config) => config.value === 'equipe')

  const cartaPapa = configs.find((config) => config.value === 'carta_papa')
  const cartaPadre = configs.find((config) => config.value === 'carta_padre')
  const cartaDiris = configs.find((config) => config.value === 'carta_diris')

  const cartazes: CartazQuadrante[] = []

  const cartazAmarelo = configs.find((config) => config.value === 'amarelo')
  if (cartazAmarelo) {
    cartazes.push({
      cor: cartazAmarelo.label,
      imagem: cartazAmarelo.imageUrl,
    })
  }
  const cartazAzul = configs.find((config) => config.value === 'azul')
  if (cartazAzul) {
    cartazes.push({
      cor: cartazAzul.label,
      imagem: cartazAzul.imageUrl,
    })
  }
  const cartazLaranja = configs.find((config) => config.value === 'laranja')
  if (cartazLaranja) {
    cartazes.push({
      cor: cartazLaranja.label,
      imagem: cartazLaranja.imageUrl,
    })
  }
  const cartazVerde = configs.find((config) => config.value === 'verde')
  if (cartazVerde) {
    cartazes.push({
      cor: cartazVerde.label,
      imagem: cartazVerde.imageUrl,
    })
  }
  const cartazVermelho = configs.find((config) => config.value === 'vermelho')
  if (cartazVermelho) {
    cartazes.push({
      cor: cartazVermelho.label,
      imagem: cartazVermelho.imageUrl,
    })
  }

  return {
    capas: {
      principal: {
        pb: capaPrincipalPB?.imageUrl || '',
        colorida: capaPrincipalColorida?.imageUrl || '',
      },
      circulos: {
        pb: capaCirculosPB?.imageUrl || '',
        colorida: capaCirculosColorida?.imageUrl || '',
      },
      equipes: capaEquipes?.imageUrl || '',
    },
    cartas: {
      papa: cartaPapa?.imageUrl || '',
      padre: cartaPadre?.imageUrl || '',
      diris: cartaDiris?.imageUrl || '',
    },
    cartazes,
  }
}
