import type { EncontreiroFormData } from '@/@types/encontreiro'
import { prisma } from '@/lib/prisma'
import { clearInstagram } from '@/utils/clear-instagram'
import { createSlugForEncontrista } from '@/utils/create-slug'
import { stringToDate } from '@/utils/string-to-date'
import { createEndereco } from '../endereco/create-endereco'

export async function createEncontreiro({
  pessoa,
  endereco,
  encontro,
}: EncontreiroFormData) {
  const foundEncontro = await prisma.encontro.findFirst({
    where: {
      id: encontro.idEncontro,
    },
  })

  if (!foundEncontro) return null

  const enderecoProps = {
    cep: endereco.enderecoCep,
    bairro: endereco.bairro,
    cidade: endereco.cidade,
    estado: endereco.estado,
    rua: endereco.rua,
  }

  const newEndereco = await createEndereco(enderecoProps)

  if (!newEndereco) return null

  const encontreiroSlug = createSlugForEncontrista(
    pessoa.email,
    foundEncontro.numeroEncontro,
  )

  const dataNascimento = stringToDate(pessoa.dataNascimento)

  const circulo =
    encontro.idCirculo && encontro.idCirculo === 'nao_sei'
      ? undefined
      : encontro.idCirculo

  const instagram = pessoa.instagram ? clearInstagram(pessoa.instagram) : null

  const newEncontreiro = await prisma.pessoa.create({
    data: {
      nome: pessoa.nome,
      sobrenome: pessoa.sobrenome,
      celular: pessoa.celular,
      telefone: pessoa.telefone,
      email: pessoa.email,
      apelido: pessoa.apelido,
      enderecoCep: endereco.enderecoCep,
      enderecoNumero: parseInt(endereco.enderecoNumero, 10),
      slug: encontreiroSlug,
      password: '$2a$08$9zaT7CNUBU/f2VDYRCoCku1m5xrutlNUn99j0prkNfsTuVapkSuSW',
      changePassword: true,
      role: 'ENCONTREIRO',
      encontreiro: {
        create: {
          dataNasc: dataNascimento,
          instagram,
          idEncontro: foundEncontro.id,
          idCirculo: circulo,
        },
      },
    },
  })
  if (!newEncontreiro) return null

  if (encontro.equipes) {
    encontro.equipes.map(async (equipe) => {
      await prisma.equipeEncontro.create({
        data: {
          idPessoa: newEncontreiro.id,
          idEncontro: equipe.idEncontro,
          idEquipe: equipe.idEquipe,
          coordenou: equipe.coordenou,
        },
      })
    })
  }

  return pessoa
}
