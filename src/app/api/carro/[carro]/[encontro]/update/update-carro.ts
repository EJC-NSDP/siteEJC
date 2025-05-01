import type { CarFormData } from '@/@types/carro'
import { getCurrentEncontro } from '@/app/api/encontro/atual/[ignorar]/get-current-encontro/get-current-encontro'
import { updateEndereco } from '@/app/api/endereco/[cep]/update/update-endereco'
import { prisma } from '@/lib/prisma'
import { createSlugForTioExterna } from '@/utils/create-slug'

export async function updateCarro({
  idCarro,
  carro,
  motorista,
  carona,
}: CarFormData) {
  const encontro = await getCurrentEncontro()
  const foundCarro = await prisma.carro.findUnique({
    where: {
      id: idCarro,
    },
  })

  if (!foundCarro || !encontro) {
    return null
  }

  const motoristaEnderecoProps = {
    cep: motorista.enderecoCep,
    bairro: motorista.bairro,
    rua: motorista.rua,
    cidade: motorista.cidade,
    estado: motorista.estado,
  }

  await updateEndereco(motoristaEnderecoProps)

  const motoristaSlug = createSlugForTioExterna(
    motorista.email,
    encontro.numeroEncontro,
  )

  const foundMotorista =
    motorista.role === 'TIOEXTERNA'
      ? await prisma.pessoa.upsert({
          where: {
            id: motorista.id,
          },
          create: {
            nome: motorista.nome,
            sobrenome: motorista.sobrenome,
            apelido: motorista.apelido,
            email: motorista.email,
            celular: motorista.celular,
            telefone: motorista.telefone,
            enderecoCep: motorista.enderecoCep,
            enderecoNumero: parseInt(motorista.enderecoNumero, 10),
            slug: motoristaSlug,
            role: 'TIOEXTERNA',
          },
          update: {
            nome: motorista.nome,
            sobrenome: motorista.sobrenome,
            apelido: motorista.apelido,
            email: motorista.email,
            celular: motorista.celular,
            telefone: motorista.telefone,
            enderecoCep: motorista.enderecoCep,
            enderecoNumero: parseInt(motorista.enderecoNumero, 10),
          },
        })
      : await prisma.pessoa.findUnique({
          where: {
            id: motorista.id,
          },
        })

  if (!foundMotorista) return null

  console.log('carona:')
  console.log(carona)

  if (carona) {
    const caronaEnderecoProps = {
      cep: carona.enderecoCep,
      bairro: carona.bairro,
      rua: carona.rua,
      cidade: carona.cidade,
      estado: carona.estado,
    }
    await updateEndereco(caronaEnderecoProps)
  }

  const caronaSlug = carona
    ? createSlugForTioExterna(carona.email, encontro.numeroEncontro)
    : null

  const foundCarona =
    caronaSlug && carona
      ? carona.role === 'TIOEXTERNA'
        ? await prisma.pessoa.upsert({
            where: {
              id: carona.id,
            },
            create: {
              nome: carona.nome,
              sobrenome: carona.sobrenome,
              apelido: carona.apelido,
              email: carona.email,
              celular: carona.celular,
              telefone: carona.telefone,
              enderecoCep: carona.enderecoCep,
              enderecoNumero: parseInt(carona.enderecoNumero, 10),
              slug: caronaSlug,
              role: 'TIOEXTERNA',
            },
            update: {
              nome: carona.nome,
              sobrenome: carona.sobrenome,
              apelido: carona.apelido,
              email: carona.email,
              celular: carona.celular,
              telefone: carona.telefone,
              enderecoCep: carona.enderecoCep,
              enderecoNumero: parseInt(carona.enderecoNumero, 10),
            },
          })
        : await prisma.pessoa.findUnique({
            where: {
              id: carona.id,
            },
          })
      : null

  console.log('foundCarona:')
  console.log(foundCarona)

  const idCarona = foundCarona ? foundCarona.id : null

  return await prisma.carroEncontro.update({
    where: {
      idCarro_idEncontro: {
        idCarro,
        idEncontro: encontro.id,
      },
    },
    data: {
      numeroCarro: carro.numeroCarro,
      observacao: carro.observacaoExterna,
      carro: {
        update: {
          placaCarro: carro.placaCarro,
          modeloCarro: carro.modeloCarro,
          lugaresCarro: carro.lugaresCarro,
          observacaoMotorista: motorista.observacaoMotorista,
          idMotorista: foundMotorista.id,
          idCarona,
        },
      },
    },
  })
}
