import { prisma } from '@/lib/prisma'

const EQUIPES_EXCLUIDAS = [
  'bom_pastor', 'dirigente', 'nao_participara',
  'palestrante', 'pastoral', 'tio_externa', '0',
]

export async function getEncontroParaAvaliacao() {
  return prisma.encontro.findFirst({
    orderBy: { numeroEncontro: 'desc' },
    select: { id: true, numeroEncontro: true, dataInicio: true },
  })
}

export async function getEquipesParaIndicacao() {
  return prisma.domainEquipes.findMany({
    orderBy: { equipeLabel: 'asc' },
    select: { equipeValue: true, equipeLabel: true },
    where: { NOT: EQUIPES_EXCLUIDAS.map((v) => ({ equipeValue: v })) },
  })
}

export async function getAvaliacaoExistente(idEncontro: string, idAutor: string) {
  return prisma.avaliacaoEncontro.findUnique({
    where: { idEncontro_idAutor: { idEncontro, idAutor } },
    select: {
      createdAt: true,
      respostas: {
        select: { idPergunta: true, resposta: true, fileUrl: true, fileName: true },
      },
      indicacoes: {
        select: {
          idEncontreiro: true,
          equipeIndicada: true,
          avaliacao: true,
          encontreiro: {
            select: {
              pessoa: { select: { nome: true, sobrenome: true, apelido: true, avatarUrl: true } },
            },
          },
        },
      },
    },
  })
}

export async function getAutorAvaliacao(idPessoa: string) {
  return prisma.pessoa.findUnique({
    where: { id: idPessoa },
    select: {
      slug: true,
      encontreiro: {
        select: { equipeMontagem: { select: { valueEquipe: true } } },
      },
    },
  })
}
