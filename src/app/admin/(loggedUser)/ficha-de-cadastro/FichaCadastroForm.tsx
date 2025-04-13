'use client'

import type { EncontreiroData } from '@/app/api/encontreiro/[id]/ficha-cadastro/get-encontreiro-cadastro'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { api } from '@/lib/axios'
import { dateToString } from '@/utils/string-to-date'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { AddressCard } from './pageComponents/AddressCard'
import { EncontroCard } from './pageComponents/EncontroCard'
import { EditNavigation } from './pageComponents/Nav/edit-nav'
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

const editCadastroFormScheme = z.object({
  id: z.string(),
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
      // Se o valor é string, tenta converter para número, se já for número, mantém
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
    formState: { errors },
  } = form

  async function handleUpdateEncontreiro(
    formDataInput: EditCadastroFormDataInput,
  ) {
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
          <div className="hidden h-80 w-1/4 lg:col-span-3 lg:grid">
            <Card className="fixed h-auto w-[19%] px-1 py-8 text-zinc-700">
              <CardContent className="w-full py-0">
                <EditNavigation />
              </CardContent>
            </Card>
          </div>
          <div className="col-span-full lg:col-start-4">
            <div className="flex flex-col gap-6">
              <PersonalCard />
              <AddressCard />
              <EncontroCard />
              <ProxEncontroCard />
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
                      [LGPD] Lembre-se de salvar qualquer mudança realizada
                      nessa página.
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
