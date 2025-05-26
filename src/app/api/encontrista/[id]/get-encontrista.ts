import type {
  valueMoraCom,
  valueReligiao,
  valueStatus,
  valueStatusPais,
  valueTamanhoCamisa,
} from '@/@types/enums'
import { prisma } from '@/lib/prisma'

export type EncontristaData = {
  id: string
  createdAt: Date
  pessoa: {
    nome: string
    sobrenome: string
    apelido: string
    celular: string
    telefone: string
    email: string
    idStatus: valueStatus
    idReligiao: valueReligiao
    isAutofill: boolean
    movimentoAnterior: string
    observacao: string
    dataNasc: Date
    instagram: string
    restricaoAlimentar: string
    idTamanhoCamisa: valueTamanhoCamisa
  }
  endereco: {
    cep: string
    estado: string
    cidade: string
    bairro: string
    rua: string
    numero: number
    complemento: string
  }
  enderecoEncontro: {
    cep: string
    cidade: string
    bairro: string
    rua: string
    numero: number
    complemento: string
  }
  familia: {
    idMoracom: valueMoraCom
    idStatusPais: valueStatusPais
    nomeContato1: string
    telContato1: string
    parentescoContato1: string
    nomeContato2: string
    telContato2: string
    parentescoContato2: string
  }
  indicacao: {
    indicadoPorNome: string
    indicadoPorApelido: string
    indicadoPorTel: string
    indicadoPorEmail: string
  }
  externa: {
    obsExternaLocalizacao: string
    obsExternaSaude: string
    obsExternaConhecidos: string
    obsExternaOutros: string
  }
}

export async function getEncontrista(id: string) {
  const encontrista = await prisma.pessoa.findFirst({
    select: {
      id: true,
      createdAt: true,
      nome: true,
      sobrenome: true,
      apelido: true,
      celular: true,
      telefone: true,
      email: true,
      enderecoNumero: true,
      endereco: {
        select: {
          cep: true,
          estado: true,
          cidade: true,
          bairro: true,
          rua: true,
        },
      },
      encontrista: {
        select: {
          idStatus: true,
          idReligiao: true,
          isAutofill: true,
          enderecoEncontro: {
            select: {
              cep: true,
              bairro: true,
              cidade: true,
              rua: true,
            },
          },
          endComplemento: true,
          endNumEncontro: true,
          endComplementoEncontro: true,
          idMoracom: true,
          idStatusPais: true,
          movimentoAnterior: true,
          observacao: true,
          nomeContato1: true,
          telContato1: true,
          parentescoContato1: true,
          nomeContato2: true,
          telContato2: true,
          parentescoContato2: true,
          indicadoPorNome: true,
          indicadoPorApelido: true,
          indicadoPorTel: true,
          indicadoPorEmail: true,
          obsExternaConhecidos: true,
          obsExternaLocalizacao: true,
          obsExternaOutros: true,
          obsExternaSaude: true,
        },
      },
      encontreiro: {
        select: {
          dataNasc: true,
          instagram: true,
          restricaoAlimentar: true,
          idTamanhoCamisa: true,
        },
      },
    },
    where: {
      encontrista: {
        idPessoa: id,
      },
    },
  })

  if (!encontrista) {
    return null
  }
  const encontristaResponse: EncontristaData = {
    id: encontrista.id,
    createdAt: encontrista.createdAt,
    pessoa: {
      nome: encontrista.nome,
      sobrenome: encontrista.sobrenome,
      apelido: String(encontrista.apelido),
      celular: encontrista.celular,
      telefone: String(encontrista.telefone),
      email: encontrista.email,
      idStatus: encontrista.encontrista!.idStatus,
      idReligiao: encontrista.encontrista!.idReligiao,
      isAutofill: encontrista.encontrista!.isAutofill,
      movimentoAnterior: String(encontrista.encontrista!.movimentoAnterior),
      observacao: String(encontrista.encontrista!.observacao),
      dataNasc: encontrista.encontreiro!.dataNasc,
      instagram: String(encontrista.encontreiro!.instagram),
      restricaoAlimentar: String(encontrista.encontreiro!.restricaoAlimentar),
      idTamanhoCamisa: encontrista.encontreiro!
        .idTamanhoCamisa as valueTamanhoCamisa,
    },
    endereco: {
      cep: encontrista.endereco.cep,
      estado: encontrista.endereco.estado,
      cidade: encontrista.endereco.cidade,
      bairro: encontrista.endereco.bairro,
      rua: encontrista.endereco.rua,
      numero: encontrista.enderecoNumero || 0,
      complemento: encontrista.encontrista!.endComplemento,
    },
    enderecoEncontro: {
      cep: encontrista.encontrista?.enderecoEncontro?.cep || '',
      cidade: encontrista.encontrista?.enderecoEncontro?.cidade || '',
      bairro: encontrista.encontrista?.enderecoEncontro?.bairro || '',
      rua: encontrista.encontrista?.enderecoEncontro?.rua || '',
      numero: encontrista.encontrista?.endNumEncontro || 0,
      complemento: encontrista.encontrista?.endComplementoEncontro || '',
    },
    familia: {
      idMoracom: encontrista.encontrista!.idMoracom,
      idStatusPais: encontrista.encontrista!.idStatusPais,
      nomeContato1: encontrista.encontrista!.nomeContato1,
      telContato1: encontrista.encontrista!.telContato1,
      parentescoContato1: encontrista.encontrista!.parentescoContato1,
      nomeContato2: String(encontrista.encontrista!.nomeContato2),
      telContato2: String(encontrista.encontrista!.telContato2),
      parentescoContato2: String(encontrista.encontrista!.parentescoContato2),
    },
    indicacao: {
      indicadoPorNome: String(encontrista.encontrista!.indicadoPorNome),
      indicadoPorApelido: String(encontrista.encontrista!.indicadoPorApelido),
      indicadoPorTel: String(encontrista.encontrista!.indicadoPorTel),
      indicadoPorEmail: String(encontrista.encontrista!.indicadoPorEmail),
    },
    externa: {
      obsExternaConhecidos: String(
        encontrista.encontrista!.obsExternaConhecidos,
      ),
      obsExternaLocalizacao: String(
        encontrista.encontrista!.obsExternaLocalizacao,
      ),
      obsExternaOutros: String(encontrista.encontrista!.obsExternaOutros),
      obsExternaSaude: String(encontrista.encontrista!.obsExternaSaude),
    },
  }

  return encontristaResponse
}
