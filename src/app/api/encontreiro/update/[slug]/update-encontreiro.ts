import type { EncontreiroFormData } from '@/@types/encontreiro'
import { updateEndereco } from '@/app/api/endereco/[cep]/update/update-endereco'
import { prisma } from '@/lib/prisma'
import { stringToDate } from '@/utils/string-to-date'

export async function updateEncontreiro({
  id,
  pessoa,
  encontro,
  endereco,
}: EncontreiroFormData) {
  const foundUser = await prisma.pessoa.findUnique({
    where: {
      id,
    },
  })

  if (!foundUser) {
    return null
  }

  const enderecoProps = {
    cep: endereco.enderecoCep,
    bairro: endereco.bairro ? endereco.bairro : '',
    rua: endereco.rua,
  }

  await updateEndereco(enderecoProps)

  const dataNascimento = stringToDate(pessoa.dataNascimento)

  const circulo =
    encontro.idCirculo === 'nao_sei' || encontro.idCirculo === ''
      ? undefined
      : encontro.idCirculo

  const updatePessoa = await prisma.pessoa.update({
    where: { id: foundUser.id },
    data: {
      nome: pessoa.nome,
      sobrenome: pessoa.sobrenome,
      apelido: pessoa.apelido,
      celular: pessoa.celular,
      telefone: pessoa.telefone,
      email: pessoa.email,
      enderecoCep: endereco.enderecoCep,
      enderecoNumero: parseInt(endereco.enderecoNumero, 10),
      encontreiro: {
        update: {
          dataNasc: dataNascimento,
          instagram: pessoa.instagram,
          idCirculo: circulo,
          idEncontro: encontro.idEncontro,
        },
      },
    },
  })

  if (encontro.equipes) {
    await prisma.equipeEncontro.deleteMany({
      where: {
        idPessoa: foundUser.id,
      },
    })
    encontro.equipes?.forEach(async (equipe) => {
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
