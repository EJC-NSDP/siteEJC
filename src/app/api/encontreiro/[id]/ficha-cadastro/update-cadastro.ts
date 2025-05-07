import type { EditCadastroFormDataInput } from '@/app/admin/(loggedUser)/ficha-de-cadastro/FichaCadastroForm'
import { getCurrentEncontro } from '@/app/api/encontro/atual/[ignorar]/get-current-encontro/get-current-encontro'
import { updateEndereco } from '@/app/api/endereco/[cep]/update/update-endereco'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

export async function updateCadastro(data: EditCadastroFormDataInput) {
  const foundUser = await prisma.pessoa.findUnique({
    where: {
      id: data.id,
    },
  })

  const foundEncontro = await getCurrentEncontro()

  if (!foundUser || !foundEncontro) {
    return null
  }

  const enderecoProps = {
    cep: data.cep,
    bairro: data.bairro ? data.bairro : '',
    rua: data.rua,
  }

  await updateEndereco(enderecoProps)

  if (foundUser.changePassword) {
    const hashedPassword = await hash(data.password, 8)

    await prisma.pessoa.update({
      where: { id: foundUser.id },
      data: {
        password: hashedPassword,
        changePassword: false,
      },
    })
  }

  const updatedPessoa = await prisma.pessoa.update({
    where: { id: foundUser.id },
    data: {
      apelido: data.apelido,
      celular: data.celular,
      enderecoCep: data.cep,
      enderecoNumero: parseInt(data.numero, 10),
      encontreiro: {
        update: {
          instagram: data.instagram,
          idTamanhoCamisa: data.tamanhoCamisa,
          restricaoAlimentar: data.restricaoAlimentar,
          idDisponibilidade: data.disponibilidade,
          obsBanda: data.obsBanda,
          observacoes: data.observacoes,
        },
      },
    },
  })

  await prisma.listaPreferencia.deleteMany({
    where: {
      idPessoa: foundUser.id,
    },
  })

  await prisma.listaPreferencia.createMany({
    data: [
      {
        idPessoa: foundUser.id,
        posicao: 1,
        valueEquipe: data.preferencia1,
      },
      {
        idPessoa: foundUser.id,
        posicao: 2,
        valueEquipe: data.preferencia2,
      },
      {
        idPessoa: foundUser.id,
        posicao: 3,
        valueEquipe: data.preferencia3,
      },
    ],
  })

  const equipeEncontro = await prisma.equipeEncontro.findUnique({
    where: {
      idPessoa_idEncontro: {
        idEncontro: foundEncontro.id,
        idPessoa: foundUser.id,
      },
    },
  })

  if (equipeEncontro) {
    await prisma.equipeEncontro.update({
      where: {
        idPessoa_idEncontro: {
          idEncontro: foundEncontro.id,
          idPessoa: foundUser.id,
        },
      },
      data: {
        fichaPreenchida: true,
      },
    })
  }

  return updatedPessoa
}
