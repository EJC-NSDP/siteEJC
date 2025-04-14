import type { EditCadastroFormDataInput } from '@/app/admin/(loggedUser)/ficha-de-cadastro/FichaCadastroForm'
import { updateEndereco } from '@/app/api/endereco/[cep]/update/update-endereco'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

export async function updateCadastro(data: EditCadastroFormDataInput) {
  const foundUser = await prisma.pessoa.findUnique({
    where: {
      id: data.id,
    },
  })

  if (!foundUser) {
    return null
  }

  const enderecoProps = {
    cep: data.cep,
    bairro: data.bairro ? data.bairro : '',
    rua: data.rua,
  }

  await updateEndereco(enderecoProps)

  const hashedPassword = await hash(data.password, 8)

  const updatedPessoa = await prisma.pessoa.update({
    where: { id: foundUser.id },
    data: {
      password: hashedPassword,
      apelido: data.apelido,
      celular: data.celular,
      enderecoCep: data.cep,
      enderecoNumero: data.numero,
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
      idPessoa: data.id,
    },
  })

  await prisma.listaPreferencia.createMany({
    data: [
      {
        idPessoa: data.id,
        posicao: 1,
        valueEquipe: data.preferencia1,
      },
      {
        idPessoa: data.id,
        posicao: 2,
        valueEquipe: data.preferencia2,
      },
      {
        idPessoa: data.id,
        posicao: 3,
        valueEquipe: data.preferencia3,
      },
    ],
  })

  return updatedPessoa
}
