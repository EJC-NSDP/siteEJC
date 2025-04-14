'use client'

import type { EncontreiroData } from '@/app/api/encontreiro/[id]/ficha-cadastro/get-encontreiro-cadastro'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { dateToString } from '@/utils/string-to-date'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { AddressCard } from './pageComponents/AddressCard'
import { EncontroCard } from './pageComponents/EncontroCard'
import { EditNavigation } from './pageComponents/Nav/edit-nav'
import { PasswordCard } from './pageComponents/PasswordCard'
import { PersonalCard } from './pageComponents/PersonalCard'
import { ProxEncontroCard } from './pageComponents/ProxEncontroCard'

interface FichaCadastroProps {
  data: EncontreiroData
}

const tamanhoCamisaEnum = z
  .enum(['p', 'm', 'g', 'gg', 'xgg', 'outro'])
  .optional()
const disponibilidadeEnum = z.enum([
  'MUITO_BAIXA',
  'BAIXA',
  'MEDIA',
  'ALTA',
  'MUITO_ALTA',
])

// const passwordSchema = z
//   .string()
//   .min(8, { message: minLengthErrorMessage })
//   .max(20, { message: maxLengthErrorMessage })
//   .refine((password) => /[A-Z]/.test(password), {
//     message: uppercaseErrorMessage,
//   })
//   .refine((password) => /[a-z]/.test(password), {
//     message: lowercaseErrorMessage,
//   })
//   .refine((password) => /[0-9]/.test(password), { message: numberErrorMessage })
//   .refine((password) => /[!@#$%^&*]/.test(password), {
//     message: specialCharacterErrorMessage,
//   })

const editCadastroFormScheme = z
  .object({
    id: z.string(),
    password: z
      .string({
        required_error: 'A senha é obrigatória',
      })
      .min(8, { message: 'Sua senha tem que ter no mínimo 8 digitos' }),
    password_confirmation: z
      .string({
        required_error: 'Confirme a senha',
      })
      .min(8, { message: 'Sua senha tem que ter no mínimo 8 digitos' }),
    nome: z.string().optional(),
    sobrenome: z.string().optional(),
    email: z.string().optional(),
    dataNascimento: z.string().optional(),
    apelido: z.string().optional(),
    celular: z
      .string()
      .min(14, { message: 'O número de celular está incompleto' }),
    instagram: z.string().optional(),
    tamanhoCamisa: tamanhoCamisaEnum,
    restricaoAlimentar: z.string().optional(),

    cep: z
      .string({ required_error: 'O cep é obrigatório.' })
      .min(9, { message: 'O cep está incompleto.' }),
    estado: z.string().optional(),
    cidade: z.string().optional(),
    bairro: z.string().optional(),
    rua: z.string().min(1, { message: 'A rua é obrigatória.' }),
    numero: z.preprocess(
      (val) => {
        return typeof val === 'string' ? parseInt(val, 10) : val
      },
      z.number().min(1, { message: 'O número é obrigatório.' }),
    ),

    encontroQueFez: z.number().optional(),
    corCirculo: z.string(),
    nomeCirculo: z.string().optional(),
    equipeAnterior: z.string(),
    equipeAnteriorCoord: z.boolean(),
    equipe: z.string(),
    equipeCoord: z.boolean(),

    preferencia1: z.string(),
    preferencia2: z.string(),
    preferencia3: z.string(),
    disponibilidade: disponibilidadeEnum,
    obsBanda: z.string().optional(),
    observacoes: z.string().optional(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    path: ['password_confirmation'],
    message: 'As senhas não são a mesma',
  })

export type EditCadastroFormDataInput = z.infer<typeof editCadastroFormScheme>
type TamanhoCamisa = z.infer<typeof tamanhoCamisaEnum>
type Disponibilidade = z.infer<typeof disponibilidadeEnum>

export function FichaCadastroForm({ data }: FichaCadastroProps) {
  const [isUpdating, setUpdating] = useState(false)

  const router = useRouter()

  const corCirculo =
    data.circulo.corCirculo === 'Amarelo'
      ? 'bg-yellow-500'
      : data.circulo.corCirculo === 'Azul'
        ? 'bg-blue-500'
        : data.circulo.corCirculo === 'Laranja'
          ? 'bg-orange-500'
          : data.circulo.corCirculo === 'Verde'
            ? 'bg-emerald-500'
            : data.circulo.corCirculo === 'Vermelho'
              ? 'bg-red-500'
              : 'bg-zinc-200'

  const form = useForm<EditCadastroFormDataInput>({
    resolver: zodResolver(editCadastroFormScheme),
    defaultValues: {
      id: data.id,
      nome: data.pessoa.nome,
      sobrenome: data.pessoa.sobrenome,
      email: data.pessoa.email,
      dataNascimento: dateToString(data.pessoa.dataNasc),
      apelido: data.pessoa.apelido !== null ? data.pessoa.apelido : '',
      celular: data.pessoa.celular,
      instagram: data.pessoa.instagram !== null ? data.pessoa.instagram : '',
      tamanhoCamisa: tamanhoCamisaEnum.safeParse(data.pessoa.idTamanhoCamisa)
        .success
        ? (data.pessoa.idTamanhoCamisa as TamanhoCamisa)
        : undefined,
      restricaoAlimentar:
        data.pessoa.restricaoAlimentar !== null
          ? data.pessoa.restricaoAlimentar
          : '',

      cep: data.endereco.cep,
      estado: data.endereco.estado,
      cidade: data.endereco.cidade,
      bairro: data.endereco.bairro,
      rua: data.endereco.rua,
      numero: data.endereco.numero !== null ? data.endereco.numero : 0,

      encontroQueFez: data.pessoa.encontro,
      corCirculo,
      nomeCirculo:
        data.circulo.nomeCirculo !== null ? data.circulo.nomeCirculo : '',
      equipeAnterior: data.ultimoEncontro.equipe,
      equipeAnteriorCoord: data.ultimoEncontro.coordenou,
      equipe: data.encontro.equipe,
      equipeCoord: data.encontro.coordenou,

      disponibilidade: disponibilidadeEnum.safeParse(
        data.proxEncontro.disponibilidade,
      ).success
        ? (data.proxEncontro.disponibilidade as Disponibilidade)
        : undefined,
      preferencia1: data.proxEncontro.preferencias[0].valueEquipe,
      preferencia2: data.proxEncontro.preferencias[1].valueEquipe,
      preferencia3: data.proxEncontro.preferencias[2].valueEquipe,
      obsBanda: data.pessoa.obsBanda !== null ? data.pessoa.obsBanda : '',
      observacoes:
        data.pessoa.observacoes !== null ? data.pessoa.observacoes : '',
    },
  })

  const {
    handleSubmit,
    // formState: { errors },
  } = form

  async function handleUpdateEncontreiro(
    formDataInput: EditCadastroFormDataInput,
  ) {
    setUpdating(true)
    console.log(formDataInput)
    // await api
    //   .put('encontreiro/update', formDataInput)
    //   .then(async () => {
    //     router.push('/admin/profile')
    //   })
    //   .catch((err) => console.log(err, errors))
  }

  return (
    <FormProvider {...form}>
      <form
        id="editEncontristaForm"
        onSubmit={handleSubmit(handleUpdateEncontreiro)}
      >
        <div className="grid grid-cols-12 gap-7">
          <div className="hidden h-80 w-1/4 lg:col-span-3 lg:grid">
            <Card className="fixed h-auto w-[19%] px-1 py-8 text-zinc-700">
              <CardContent className="w-full py-0">
                <EditNavigation />
              </CardContent>
            </Card>
          </div>
          <div className="col-span-full lg:col-start-4">
            <div className="flex flex-col gap-6">
              <PasswordCard />
              <PersonalCard />
              <AddressCard />
              <EncontroCard />
              <ProxEncontroCard />
              <Card
                id="save-section"
                className="w-full px-3 pt-8 text-zinc-700 "
              >
                <CardContent className="flex w-full flex-col gap-3">
                  <span className="text-2xl font-bold lg:text-nowrap">
                    Salvar Mudanças
                  </span>
                  <div className="flex flex-col gap-3">
                    <div className="">
                      Ao clicar no botão <b>Salvar</b>, autorizo, de forma
                      livre, informada e consciente, o uso dos meus dados
                      pessoais pelo Encontro de Jovens com Cristo da Paróquia
                      Nossa Senhora da Divina Providência, conforme a Lei Geral
                      de Proteção de Dados (Lei nº 13.709/18) e outras normas
                      aplicáveis. Essa autorização se refere às finalidades
                      relacionadas às atividades do Encontro.
                    </div>
                    <div className="flex items-center justify-center gap-5 px-0 py-5 text-lg lg:flex-row lg:gap-7 lg:py-7">
                      <Button
                        onClick={() => {
                          router.push('/admin/profile')
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
                        Salvar
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
