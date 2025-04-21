import type { EncontreiroFormData } from '@/@types/encontreiro'
import { updateEndereco } from '@/app/api/endereco/[cep]/update/update-endereco'
import { prisma } from '@/lib/prisma'
import { stringToDate } from '@/utils/string-to-date'

export async function updateEncontreiro(data: EncontreiroFormData) {
  const foundUser = await prisma.pessoa.findUnique({
    where: {
      id: data.id,
    },
  })

  if (!foundUser) {
    return null
  }

  const enderecoProps = {
    cep: data.endereco.enderecoCep,
    bairro: data.endereco.bairro ? data.endereco.bairro : '',
    rua: data.endereco.rua,
  }

  await updateEndereco(enderecoProps)

  const dataNascimento = stringToDate(data.pessoa.dataNascimento)

  const updatePessoa = await prisma.pessoa.update({
    where: { id: foundUser.id },
    data: {
      nome: data.pessoa.nome,
      sobrenome: data.pessoa.sobrenome,
      apelido: data.pessoa.apelido,
      celular: data.pessoa.celular,
      telefone: data.pessoa.telefone,
      email: data.pessoa.email,
      enderecoCep: data.endereco.enderecoCep,
      enderecoNumero: data.endereco.enderecoNumero,
      encontreiro: {
        update: {
          dataNasc: dataNascimento,
          instagram: data.pessoa.instagram,
          idCirculo: data.encontro.idCirculo,
          idEncontro: data.encontro.idEncontro,
        },
      },
    },
  })

  if (data.encontro.equipes) {
    data.encontro.equipes?.forEach(async (equipe) => {
      await prisma.equipeEncontro.upsert({
        where: {
          idPessoa_idEncontro: {
            idPessoa: foundUser.id,
            idEncontro: equipe.idEncontro,
          },
        },
        update: {
          idEquipe: equipe.idEquipe,
          coordenou: equipe.coordenou,
        },
        create: {
          idEquipe: equipe.idEquipe,
          coordenou: equipe.coordenou,
          idPessoa: foundUser.id,
          idEncontro: equipe.idEncontro,
        },
      })
    })
  }
  return updatePessoa
}
