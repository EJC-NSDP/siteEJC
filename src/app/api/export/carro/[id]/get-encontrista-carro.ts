import { prisma } from '@/lib/prisma'

export async function getEncontristaCarro(id: string) {
  return await prisma.encontrista.findMany({
    where: {
      idCarroEncontro: id,
    },
    select: {
      idStatus: true,
      endNumEncontro: true,
      endComplementoEncontro: true,
      enderecoEncontro: {
        select: {
          rua: true,
          bairro: true,
          cep: true,
        },
      },
      endComplemento: true,

      // Contatos de emergência
      nomeContato1: true,
      telContato1: true,
      parentescoContato1: true,
      nomeContato2: true,
      telContato2: true,
      parentescoContato2: true,

      // Quem indicou
      indicadoPorNome: true,
      indicadoPorTel: true,

      // Informações adicionais
      idStatusPais: true, // "Pais são divorciados?"
      obsExternaLocalizacao: true, // "Local de saída na sexta"
      obsExternaConhecidos: true, // "Observações relevantes" — conhecidos no encontro
      obsExternaSaude: true, // "Observações relevantes" — saúde
      obsExternaOutros: true, // "Observações relevantes" — outros

      pessoa: {
        select: {
          nome: true,
          sobrenome: true,
          apelido: true,
          celular: true,
          enderecoNumero: true,
          endereco: {
            select: {
              rua: true,
              bairro: true,
              cep: true,
            },
          },
          encontreiro: {
            select: {
              dataNasc: true, // usado para calcular a idade
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  })
}

export type EncontristaCarroData = Awaited<
  ReturnType<typeof getEncontristaCarro>
>[number]

// ---------------------------------------------------------------------------
// Helpers para montar os dados do PDF
// ---------------------------------------------------------------------------

/** "Dias que vai pro EJC" derivado do idStatus */
export function statusToDias(
  idStatus: EncontristaCarroData['idStatus'],
): string {
  const map: Record<string, string> = {
    confirmado: 'Sexta, sábado e domingo',
    confirmado_sem_sexta: 'Sábado e domingo',
  }
  return map[idStatus] ?? idStatus
}

/** Endereço: usa endereço do encontro; cai no pessoal só se vazio */
export function resolveEndereco(encontrista: EncontristaCarroData): string {
  const usandoEncontro = !!encontrista.enderecoEncontro
  const end = encontrista.enderecoEncontro ?? encontrista.pessoa.endereco
  const numero = usandoEncontro
    ? encontrista.endNumEncontro
    : encontrista.pessoa.enderecoNumero
  const complemento = usandoEncontro
    ? encontrista.endComplementoEncontro
    : encontrista.endComplemento

  const partes = [`${end.rua}, ${numero ?? 's/n'}`]
  if (complemento) partes[0] += ` ${complemento}`
  partes.push(end.bairro)
  partes.push(end.cep)

  return partes.join(' - ')
}

/** Idade em anos a partir da dataNasc do encontreiro (se existir) */
export function calcIdade(dataNasc: Date | null | undefined): string {
  if (!dataNasc) return '—'
  const hoje = new Date()
  let idade = hoje.getFullYear() - dataNasc.getFullYear()
  const aindaNaoFezAnos =
    hoje.getMonth() < dataNasc.getMonth() ||
    (hoje.getMonth() === dataNasc.getMonth() &&
      hoje.getDate() < dataNasc.getDate())
  if (aindaNaoFezAnos) idade--
  return `${idade} anos`
}

/** Concatena as obs externas não-nulas em uma string legível */
export function resolveObservacoes(encontrista: EncontristaCarroData): string {
  return [
    encontrista.obsExternaSaude,
    encontrista.obsExternaConhecidos,
    encontrista.obsExternaOutros,
    encontrista.obsExternaLocalizacao,
  ]
    .filter(Boolean)
    .join(' | ')
}
