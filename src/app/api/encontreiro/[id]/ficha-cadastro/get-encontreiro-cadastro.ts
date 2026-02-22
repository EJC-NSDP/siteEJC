import { getCurrentEncontro } from '@/app/api/encontro/atual/[ignorar]/get-current-encontro/get-current-encontro'
import { getLastEncontro } from '@/app/api/encontro/atual/[ignorar]/get-last-encontro/get-last-encontro'
import type { Value_Disponibilidade as valueDisponibilidade } from '@/enums'
import { prisma } from '@/lib/prisma'

export type ListaPreferencias = {
  posicao: number
  valueEquipe: string
}

export type EncontreiroCadastroData = {
  id: string
  slug: string
  changePassword: boolean
  pessoa: {
    nome: string
    sobrenome: string
    email: string
    dataNasc: Date
    apelido: string | null
    celular: string
    instagram: string | null
    restricaoAlimentar: string | null
    idTamanhoCamisa: string | null
    encontro: number
    obsBanda: string | null
    observacoes: string | null
  }
  endereco: {
    cep: string
    estado: string
    cidade: string
    bairro: string
    rua: string
    numero: number | null
  }
  circulo: {
    corCirculo: string | null
    nomeCirculo: string | null
  }
  ultimoEncontro: {
    equipe: string
    coordenou: boolean
  }
  encontro: {
    equipe: string
    coordenou: boolean
  }
  proxEncontro: {
    disponibilidade: valueDisponibilidade | null
    preferencias: ListaPreferencias[]
  }
}

function gerarListaCompletaPreferencias(
  listaExistente?: ListaPreferencias[],
): ListaPreferencias[] {
  const lista: ListaPreferencias[] = []

  for (let i = 1; i <= 3; i++) {
    const existente = listaExistente?.find((p) => p.posicao === i)
    lista.push(existente ?? { posicao: i, valueEquipe: '0' })
  }

  return lista
}

export async function getEncontreiroCadastro(id: string) {
  const encontro = await getCurrentEncontro()
  const ultimoEncontro = await getLastEncontro()
  const encontreiro = await prisma.pessoa.findUnique({
    select: {
      id: true,
      nome: true,
      sobrenome: true,
      apelido: true,
      celular: true,
      changePassword: true,
      email: true,
      enderecoNumero: true,
      slug: true,
      endereco: {
        select: {
          cep: true,
          estado: true,
          cidade: true,
          bairro: true,
          rua: true,
        },
      },
      encontreiro: {
        select: {
          dataNasc: true,
          instagram: true,
          idTamanhoCamisa: true,
          restricaoAlimentar: true,
          obsBanda: true,
          observacoes: true,
          disponibilidade: true,
          encontro: {
            select: {
              numeroEncontro: true,
            },
          },
          listaPreferencias: {
            select: {
              posicao: true,
              valueEquipe: true,
            },
          },
          circulo: {
            select: {
              nome: true,
              corCirculo: {
                select: {
                  cor: true,
                },
              },
            },
          },
        },
      },
    },
    where: {
      id,
    },
  })

  if (!encontreiro || !encontro) {
    return null
  }

  const equipeEncontroAtual = await prisma.equipeEncontro.findUnique({
    select: {
      equipe: {
        select: {
          equipeLabel: true,
        },
      },
      fichaPreenchida: true,
      coordenou: true,
    },
    where: {
      idPessoa_idEncontro: {
        idEncontro: encontro.id,
        idPessoa: encontreiro.id,
      },
    },
  })

  const equipeEncontroPassado = await prisma.equipeEncontro.findUnique({
    select: {
      equipe: {
        select: {
          equipeLabel: true,
        },
      },
      coordenou: true,
    },
    where: {
      idPessoa_idEncontro: {
        idEncontro: ultimoEncontro.id,
        idPessoa: encontreiro.id,
      },
    },
  })

  if (!encontreiro) {
    return null
  }

  const listaPreferencias = gerarListaCompletaPreferencias(
    encontreiro.encontreiro!.listaPreferencias,
  )
  const encontreiroResponse: EncontreiroCadastroData = {
    id: encontreiro.id,
    slug: encontreiro.slug,
    changePassword: encontreiro.changePassword,
    pessoa: {
      nome: encontreiro.nome,
      sobrenome: encontreiro.sobrenome,
      apelido: encontreiro.apelido,
      celular: encontreiro.celular,
      encontro: encontreiro.encontreiro!.encontro!.numeroEncontro,
      email: encontreiro.email,
      dataNasc: encontreiro.encontreiro!.dataNasc,
      instagram: encontreiro.encontreiro!.instagram,
      idTamanhoCamisa: encontreiro.encontreiro!.idTamanhoCamisa,
      restricaoAlimentar: encontreiro.encontreiro!.restricaoAlimentar,
      obsBanda: encontreiro.encontreiro!.obsBanda,
      observacoes:
        equipeEncontroAtual && equipeEncontroAtual.fichaPreenchida
          ? encontreiro.encontreiro!.observacoes
          : '',
    },
    endereco: {
      cep: encontreiro.endereco.cep,
      estado: encontreiro.endereco.estado,
      cidade: encontreiro.endereco.cidade,
      bairro: encontreiro.endereco.bairro,
      rua: encontreiro.endereco.rua,
      numero: encontreiro.enderecoNumero,
    },
    circulo: {
      corCirculo: encontreiro.encontreiro!.circulo
        ? encontreiro.encontreiro!.circulo.corCirculo.cor
        : null,
      nomeCirculo: encontreiro.encontreiro!.circulo
        ? encontreiro.encontreiro!.circulo.nome
        : '[Informe a um dirigente o nome do seu círculo]',
    },
    ultimoEncontro: {
      equipe: equipeEncontroPassado
        ? equipeEncontroPassado.equipe.equipeLabel
        : encontreiro.encontreiro?.encontro?.numeroEncontro ===
            ultimoEncontro.numeroEncontro
          ? 'Encontrista'
          : 'Não participou',
      coordenou: equipeEncontroPassado
        ? equipeEncontroPassado.coordenou
        : false,
    },
    encontro: {
      equipe: equipeEncontroAtual
        ? equipeEncontroAtual.equipe.equipeLabel
        : 'Não irá participar',
      coordenou: equipeEncontroAtual ? equipeEncontroAtual.coordenou : false,
    },
    proxEncontro: {
      disponibilidade:
        equipeEncontroAtual &&
        equipeEncontroAtual.fichaPreenchida &&
        encontreiro.encontreiro!.disponibilidade
          ? encontreiro.encontreiro!.disponibilidade.id
          : 'NAO_PREENCHEU',
      preferencias:
        equipeEncontroAtual && equipeEncontroAtual.fichaPreenchida
          ? listaPreferencias
          : [],
    },
  }

  return encontreiroResponse
}
