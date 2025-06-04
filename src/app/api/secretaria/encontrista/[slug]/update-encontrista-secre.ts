import type { EditSecreFormDataInput } from '@/app/(app)/admin/secretaria/(encontristas)/[slug]/edit/EditSecreEncontristaForm'
import { updateEndereco } from '@/app/api/endereco/[cep]/update/update-endereco'
import { prisma } from '@/lib/prisma'
import { clearInstagram } from '@/utils/clear-instagram'
import { stringToDate } from '@/utils/string-to-date'

export async function updateEncontristaSecre(data: EditSecreFormDataInput) {
  const foundEncontrista = await prisma.pessoa.findUnique({
    where: {
      slug: data.slug,
    },
  })

  if (!foundEncontrista) {
    return null
  }

  const enderecoProps = {
    cep: data.cep,
    bairro: data.bairro ? data.bairro : '',
    rua: data.rua,
  }

  await updateEndereco(enderecoProps)

  const dataNascimento = stringToDate(data.dataNascimento)
  const instagram = data.instagram ? clearInstagram(data.instagram) : null

  return await prisma.pessoa.update({
    where: { slug: foundEncontrista.slug },
    data: {
      nome: data.nome,
      sobrenome: data.sobrenome,
      apelido: data.apelido,
      enderecoCep: data.cep,
      celular: data.celular,
      enderecoNumero: data.numero,
      encontreiro: {
        update: {
          dataNasc: dataNascimento,
          instagram,
        },
      },
    },
  })
}
