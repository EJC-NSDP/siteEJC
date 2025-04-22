'use client'

import type { EncontristaData } from '@/app/api/encontrista/[id]/get-encontrista'
import { Nav } from '@/components/Nav/Nav'
import { NavItem } from '@/components/Nav/NavItem'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { api } from '@/lib/axios'
import { dateToString } from '@/utils/string-to-date'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Bed,
  Building2,
  Clipboard,
  ClipboardCheck,
  FileHeart,
  Save,
  User,
  Users,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { AddressCard } from './pageComponents/AddressCard'
import { AddressEncontroCard } from './pageComponents/AddressEncontroCard'
import { ExternaCard } from './pageComponents/ExternaCard'
import { FamilyCard } from './pageComponents/FamilyCard'
import { NominationCard } from './pageComponents/NominationCard'
import { OtherCard } from './pageComponents/OtherCard'
import { PersonalCard } from './pageComponents/PersonalCard'

interface EditEncontristaProps {
  data: EncontristaData
}

const editFormScheme = z.object({
  id: z.string(),
  nome: z
    .string({ required_error: 'O nome é obrigatório.' })
    .min(3, { message: 'O nome precisa ter pelo menos 3 letras.' }),
  sobrenome: z
    .string({ required_error: 'O sobrenome é obrigatório.' })
    .min(3, { message: 'O sobrenome precisa ter pelo menos 3 letras' }),
  dataNascimento: z.string().min(10, { message: 'A data está incompleta' }),
  apelido: z.string().optional(),
  religiao: z
    .enum([
      'catolica',
      'evangelica',
      'espirita',
      'matriz_africana',
      'judaica',
      'nao_tenho',
      'outra',
    ])
    .optional(),
  paraVoce: z.enum(['sim', 'nao']),
  celular: z
    .string()
    .min(14, { message: 'O número de celular está incompleto' }),
  telefone: z.string().optional(),
  email: z
    .string({ required_error: 'O email é obrigatório.' })
    .email({ message: 'O email não é válido' }),
  instagram: z.string().optional(),
  cep: z
    .string({ required_error: 'O cep é obrigatório.' })
    .min(9, { message: 'O cep está incompleto.' }),
  estado: z.string().optional(),
  cidade: z.string().optional(),
  bairro: z.string().optional(),
  rua: z.string().min(1, { message: 'A rua é obrigatória.' }),
  numero: z.preprocess(
    (val) => {
      // Se o valor é string, tenta converter para número, se já for número, mantém
      return typeof val === 'string' ? parseInt(val, 10) : val
    },
    z.number().min(1, { message: 'O número é obrigatório.' }),
  ),
  complemento: z.string(),

  cepEncontro: z
    .string({ required_error: 'O cep é obrigatório.' })
    .min(9, { message: 'O cep está incompleto.' }),
  cidadeEncontro: z.string().min(1, { message: 'A cidade é obrigatória.' }),
  bairroEncontro: z.string().min(1, { message: 'O bairro é obrigatório.' }),
  ruaEncontro: z.string().min(1, { message: 'A rua é obrigatória.' }),
  numeroEncontro: z.preprocess(
    (val) => {
      // Se o valor é string, tenta converter para número, se já for número, mantém
      return typeof val === 'string' ? parseInt(val, 10) : val
    },
    z.number().min(1, { message: 'O número é obrigatório.' }),
  ),
  complementoEncontro: z.string(),

  moraCom: z.enum(['sozinho', 'conjuge', 'familiar', 'amigos'], {
    required_error: 'Este campo é obrigatório',
  }),
  statusPais: z.enum(['sim', 'nao', 'na'], {
    required_error: 'Este campo é obrigatório',
  }),
  nomeFamiliar: z
    .string({
      required_error: 'O nome de pelo menos um familiar é obrigatório.',
    })
    .min(3, { message: 'O nome de pelo menos um familiar é obrigatório.' }),
  telFamiliar: z
    .string()
    .min(13, { message: 'O número de telefone está incompleto' }),
  parentescoFamiliar: z
    .string()
    .min(2, { message: 'O grau de parentesco é obrigatório' }),
  nomeFamiliar2: z.string().optional(),
  telFamiliar2: z.string().optional(),
  parentescoFamiliar2: z.string().optional(),
  indicadoPorNome: z.string().optional(),
  indicadoApelido: z.string().optional(),
  indicadoTelefone: z.string().optional(),
  indicadoEmail: z.string().optional(),
  tamanhoCamisa: z.enum(['p', 'm', 'g', 'gg', 'xgg', 'outro']).optional(),
  nomeMovimento: z.string().optional(),
  restricoesAlimentares: z.string().optional(),
  observacoes: z.string().optional(),

  obsExternaLocalizacao: z.string().optional(),
  obsExternaSaude: z.string().optional(),
  obsExternaConhecidos: z.string().optional(),
  obsExternaOutros: z.string().optional(),
})

export type EditFormDataInput = z.infer<typeof editFormScheme>

export function EditEncontristaForm({ data }: EditEncontristaProps) {
  const [isUpdating, setUpdating] = useState(false)
  const router = useRouter()

  const form = useForm<EditFormDataInput>({
    resolver: zodResolver(editFormScheme),
    defaultValues: {
      id: data.id,
      nome: data.pessoa.nome,
      sobrenome: data.pessoa.sobrenome,
      dataNascimento: dateToString(data.pessoa.dataNasc),
      apelido: data.pessoa.apelido !== 'null' ? data.pessoa.apelido : '',
      religiao: data.pessoa.idReligiao,
      celular: data.pessoa.celular,
      telefone: data.pessoa.telefone,
      email: data.pessoa.email,
      instagram: data.pessoa.instagram !== 'null' ? data.pessoa.instagram : '',
      paraVoce: data.pessoa.isAutofill ? 'sim' : 'nao',
      cep: data.endereco.cep,
      estado: data.endereco.estado,
      cidade: data.endereco.cidade,
      bairro: data.endereco.bairro,
      rua: data.endereco.rua,
      numero: data.endereco.numero,
      complemento: data.endereco.complemento,
      cepEncontro: data.enderecoEncontro.cep,
      cidadeEncontro: data.enderecoEncontro.cidade,
      bairroEncontro: data.enderecoEncontro.bairro,
      ruaEncontro: data.enderecoEncontro.rua,
      numeroEncontro: data.enderecoEncontro.numero,
      complementoEncontro: data.enderecoEncontro.complemento,
      moraCom: data.familia.idMoracom,
      statusPais: data.familia.idStatusPais,
      nomeFamiliar: data.familia.nomeContato1,
      telFamiliar: data.familia.telContato1,
      parentescoFamiliar: data.familia.parentescoContato1,
      nomeFamiliar2:
        data.familia.nomeContato2 !== 'null' ? data.familia.nomeContato2 : '',
      telFamiliar2: data.familia.telContato2,
      parentescoFamiliar2:
        data.familia.parentescoContato2 !== 'null'
          ? data.familia.parentescoContato2
          : '',
      indicadoPorNome:
        data.indicacao.indicadoPorNome !== 'null'
          ? data.indicacao.indicadoPorNome
          : '',
      indicadoApelido:
        data.indicacao.indicadoPorApelido !== 'null'
          ? data.indicacao.indicadoPorApelido
          : '',
      indicadoEmail:
        data.indicacao.indicadoPorEmail !== 'null'
          ? data.indicacao.indicadoPorEmail
          : '',
      indicadoTelefone: data.indicacao.indicadoPorTel,
      nomeMovimento:
        data.pessoa.movimentoAnterior !== 'null'
          ? data.pessoa.movimentoAnterior
          : '',
      tamanhoCamisa: data.pessoa.idTamanhoCamisa,
      restricoesAlimentares:
        data.pessoa.restricaoAlimentar !== 'null'
          ? data.pessoa.restricaoAlimentar
          : '',
      observacoes:
        data.pessoa.observacao !== 'null' ? data.pessoa.observacao : '',

      obsExternaLocalizacao:
        data.externa.obsExternaLocalizacao !== 'null'
          ? data.externa.obsExternaLocalizacao
          : '',
      obsExternaSaude:
        data.externa.obsExternaSaude !== 'null'
          ? data.externa.obsExternaSaude
          : '',
      obsExternaConhecidos:
        data.externa.obsExternaConhecidos !== 'null'
          ? data.externa.obsExternaConhecidos
          : '',
      obsExternaOutros:
        data.externa.obsExternaOutros !== 'null'
          ? data.externa.obsExternaOutros
          : '',
    },
  })

  const {
    handleSubmit,
    formState: { errors },
  } = form

  async function handleUpdateEncontreiro(formDataInput: EditFormDataInput) {
    setUpdating(true)
    await api
      .put('encontrista/update', formDataInput)
      .then(async () => {
        router.push('/admin/externa')
      })
      .catch((err) => console.log(err, errors))
  }

  return (
    <FormProvider {...form}>
      <form
        id="editEncontristaForm"
        onSubmit={handleSubmit(handleUpdateEncontreiro)}
      >
        <div className="grid w-full grid-cols-12 gap-7">
          <Nav>
            <NavItem
              title="Dados Pessoais"
              icon={User}
              link="#personal-section"
            />
            <NavItem
              title="Endereço"
              icon={Building2}
              link="#address-section"
            />
            <NavItem
              title="Endereço Encontro"
              icon={Bed}
              link="#address-encontro-section"
            />
            <NavItem title="Família" icon={Users} link="#family-section" />
            <NavItem
              title="Indicação"
              icon={FileHeart}
              link="#nomination-section"
            />
            <NavItem title="Outros" icon={Clipboard} link="#other-section" />
            <NavItem
              title="Informações Extras"
              icon={ClipboardCheck}
              link="#externa-section"
            />
            <NavItem title="Salvar" icon={Save} link="#save-section" />
          </Nav>

          <div className="col-span-full lg:col-start-4">
            <div className="flex flex-col gap-6">
              <PersonalCard />
              <AddressCard />
              <AddressEncontroCard />
              <FamilyCard />
              <NominationCard />
              <OtherCard />
              <ExternaCard />
              <Card
                id="save-section"
                className="w-full px-3 pt-8 text-zinc-700 "
              >
                <CardContent className="w-full">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-2xl font-bold lg:text-nowrap">
                      Salvar Mudanças
                    </span>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
                    <div className="px-0 py-5 text-lg lg:py-7">
                      Lembre-se de salvar qualquer mudança realizada nessa
                      página.
                    </div>
                    <div className="flex items-center justify-center gap-5 px-0 py-5 text-lg lg:flex-row lg:gap-7 lg:py-7">
                      <Button
                        onClick={() => {
                          router.push('/admin/externa')
                        }}
                        type="button"
                        variant="outline"
                        className="disabled:opacity-50' h-10 w-40 disabled:cursor-wait"
                        disabled={isUpdating}
                      >
                        Voltar
                      </Button>
                      <Button
                        type="submit"
                        className="h-10 w-40"
                        disabled={isUpdating}
                      >
                        Atualizar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
