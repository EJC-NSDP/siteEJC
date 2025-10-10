import type { CartazQuadrante, ConfigQuadrante } from '@/@types/quadrante'
import { getCurrentEncontro } from '@/app/api/encontro/atual/[ignorar]/get-current-encontro/get-current-encontro'
import { prisma } from '@/lib/prisma'

export async function getConfigQuadrante(): Promise<ConfigQuadrante | null> {
  const encontro = await getCurrentEncontro()
  if (!encontro) return null

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
  const qrCode = configs.find((config) => config.value === 'qrcode')

  const cartaPapa = configs.find((config) => config.value === 'carta_papa')
  const cartaPadre = configs.find((config) => config.value === 'carta_padre')
  const cartaDiris = configs.find((config) => config.value === 'carta_diris')

  // 🧩 Mapeamento número → cor
  const cores: Record<number, string> = {
    1: 'amarelo',
    2: 'azul',
    3: 'laranja',
    4: 'verde',
    5: 'vermelho',
  }

  const cartazes: CartazQuadrante[] = []

  // 🔢 Garante que temos um número válido
  const ordem = encontro.ordemCirculos?.toString() || ''

  // 🧠 Itera sobre cada dígito e adiciona o cartaz correspondente
  for (const digito of ordem) {
    const cor = cores[Number(digito) as keyof typeof cores]
    if (!cor) continue

    const cartaz = configs.find((config) => config.value === cor)
    if (cartaz) {
      cartazes.push({
        cor: cartaz.label,
        imagem: cartaz.imageUrl,
      })
    }
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
      qrcode: qrCode?.imageUrl || '',
    },
    cartas: {
      papa: cartaPapa?.imageUrl || '',
      padre: cartaPadre?.imageUrl || '',
      diris: cartaDiris?.imageUrl || '',
    },
    cartazes,
  }
}
