import type { EncontreiroFormData } from '@/@types/encontreiro'
import { getCurrentEncontro } from '@/app/api/encontro/atual/[ignorar]/get-current-encontro/get-current-encontro'
import { prisma } from '@/lib/prisma'
import { dateToString } from '@/utils/string-to-date'

export async function getEditEncontreiro(slug: string) {
  const encontro = await getCurrentEncontro()
  // const ultimoEncontro = await getLastEncontro()
  const encontreiro = await prisma.pessoa.findUnique({
    select: {
      id: true,
      nome: true,
      sobrenome: true,
      apelido: true,
      celular: true,
      telefone: true,
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
          idCirculo: true,
          restricaoAlimentar: true,
          obsBanda: true,
          observacoes: true,
          disponibilidade: true,
          encontro: {
            select: {
              id: true,
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
      slug,
    },
  })

  if (!encontreiro || !encontro) {
    return null
  }

  const equipesEncontreiro = await prisma.equipeEncontro.findMany({
    select: {
      idEncontro: true,
      idEquipe: true,
      coordenou: true,
    },
    where: {
      idPessoa: encontreiro.id,
    },
    orderBy: {
      encontro: {
        numeroEncontro: 'desc',
      },
    },
  })

  if (!encontreiro) {
    return null
  }

  const equipesAdjusted = equipesEncontreiro.map((equipe) => {
    return {
      idEncontro: equipe.idEncontro,
      idEquipe: equipe.idEquipe,
      coordenou: equipe.coordenou,
    }
  })

  const encontreiroResponse: EncontreiroFormData = {
    id: encontreiro.id,
    slug: encontreiro.slug,
    pessoa: {
      nome: encontreiro.nome,
      sobrenome: encontreiro.sobrenome,
      apelido: encontreiro.apelido || undefined,
      celular: encontreiro.celular,
      telefone: encontreiro.telefone || undefined,
      email: encontreiro.email,
      dataNascimento: dateToString(encontreiro.encontreiro!.dataNasc),
      instagram: encontreiro.encontreiro!.instagram || undefined,
    },
    endereco: {
      enderecoCep: encontreiro.endereco.cep,
      estado: encontreiro.endereco.estado,
      cidade: encontreiro.endereco.cidade,
      bairro: encontreiro.endereco.bairro,
      rua: encontreiro.endereco.rua,
      enderecoNumero: encontreiro.enderecoNumero?.toString() || '',
    },
    encontro: {
      idEncontro: encontreiro.encontreiro!.encontro!.id,
      idCirculo: encontreiro.encontreiro!.idCirculo || undefined,
      equipes: equipesAdjusted,
    },
  }

  return encontreiroResponse
}
