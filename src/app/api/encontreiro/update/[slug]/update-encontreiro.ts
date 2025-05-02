import type { EncontreiroFormData } from '@/@types/encontreiro'
import { updateEndereco } from '@/app/api/endereco/[cep]/update/update-endereco'
import { prisma } from '@/lib/prisma'
import { stringToDate } from '@/utils/string-to-date'
import type { EquipeEncontro } from '@prisma/client'

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
    const novasEquipes = encontro.equipes
    const historicoEquipes = await prisma.equipeEncontro.findMany({
      where: {
        idPessoa: foundUser.id,
      },
    })

    const novasMap = new Map(novasEquipes.map((e) => [`${e.idEncontro}`, e]))

    const promises: Promise<EquipeEncontro>[] = []

    // Upsert para todas as novas equipes
    for (const nova of novasEquipes) {
      promises.push(
        prisma.equipeEncontro.upsert({
          where: {
            idPessoa_idEncontro: {
              idPessoa: foundUser.id,
              idEncontro: nova.idEncontro,
            },
          },
          update: {
            idEquipe: nova.idEquipe,
            coordenou: nova.coordenou,
          },
          create: {
            idPessoa: foundUser.id,
            idEncontro: nova.idEncontro,
            idEquipe: nova.idEquipe,
            coordenou: nova.coordenou,
          },
        }),
      )
    }

    // Deletar entradas antigas que não estão mais na nova lista
    for (const antigo of historicoEquipes) {
      if (!novasMap.has(antigo.idEncontro)) {
        promises.push(
          prisma.equipeEncontro.delete({
            where: {
              idPessoa_idEncontro: {
                idPessoa: foundUser.id,
                idEncontro: antigo.idEncontro,
              },
            },
          }),
        )
      }
    }

    await Promise.all(promises)
  }

  return updatePessoa
}
