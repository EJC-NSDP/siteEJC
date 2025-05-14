import type { EncontreiroQuadrante, EquipeQuadrante } from '@/@types/quadrante'
import { prisma } from '@/lib/prisma'
import { getCurrentEncontro } from '@/utils/fetch-this-encontro'

export async function getEncontreirosQuadrante(): Promise<EquipeQuadrante[]> {
  const encontro = await getCurrentEncontro()
  if (!encontro) return []

  const equipes = await prisma.domainEquipes.findMany({
    select: {
      equipeLabel: true,
      equipeValue: true,
      description: true,
    },
    orderBy: {
      equipeLabel: 'asc',
    },
    where: {
      NOT: [
        { equipeValue: 'nao_participara' },
        { equipeValue: '0' },
        { equipeValue: 'tio_circulo' },
        { equipeValue: 'tio_externa' },
        { equipeValue: 'bom_pastor' },
        { equipeValue: 'pastoral' },
        { equipeValue: 'palestrante' },
      ],
    },
  })

  const encontreiros = await prisma.equipeEncontro.findMany({
    where: {
      idEncontro: encontro.id,
    },
    orderBy: [
      { coordenou: 'desc' },
      { encontreiro: { pessoa: { nome: 'asc' } } },
      { encontreiro: { pessoa: { sobrenome: 'asc' } } },
      { equipe: { equipeValue: 'asc' } },
    ],
    select: {
      equipe: {
        select: {
          equipeValue: true,
        },
      },
      coordenou: true,
      encontreiro: {
        select: {
          dataNasc: true,
          instagram: true,
          pessoa: {
            select: {
              nome: true,
              sobrenome: true,
              apelido: true,
              celular: true,
              endereco: {
                select: {
                  bairro: true,
                },
              },
            },
          },
          encontro: {
            select: {
              numeroEncontro: true,
            },
          },
        },
      },
    },
  })

  return equipes.map((equipe) => {
    const encontreirosFiltered = encontreiros.filter(
      (encontreiro) => encontreiro.equipe.equipeValue === equipe.equipeValue,
    )

    const integrantes: EncontreiroQuadrante[] = encontreirosFiltered.map(
      (encontreiro) => {
        return {
          nome: `${encontreiro.encontreiro.pessoa.nome} ${encontreiro.encontreiro.pessoa.sobrenome}`,
          apelido: encontreiro.encontreiro.pessoa.apelido || '-',
          celular: encontreiro.encontreiro.pessoa.celular,
          bairro: encontreiro.encontreiro.pessoa.endereco.bairro,
          instagram: encontreiro.encontreiro.instagram || '-',
          coord: encontreiro.coordenou,
          encontro:
            encontreiro.encontreiro.encontro?.numeroEncontro.toString() || '?',
          equipe: equipe.equipeValue,
        }
      },
    )

    return {
      nome: equipe.equipeLabel,
      descricao: equipe.description || '',
      value: equipe.equipeValue,
      integrantes,
    }
  })
}
