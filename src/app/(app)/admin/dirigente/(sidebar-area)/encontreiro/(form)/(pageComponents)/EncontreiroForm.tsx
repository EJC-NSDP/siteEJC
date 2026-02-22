'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { BookUser, Building2, Save, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

import { AddressDetails } from './AddressDetails'
import { EncontroDetails } from './EncontroDetails'
import { PersonalDetails } from './PersonalDetails'

import type { EncontreiroFormData } from '@/@types/encontreiro'
import { Nav } from '@/components/Nav/Nav'
import { NavItem } from '@/components/Nav/NavItem'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { api } from '@/lib/axios'

interface EditEncontreiroProps {
  data?: EncontreiroFormData
}

const equipeFormScheme = z.object({
  idEncontro: z.string(),
  idEquipe: z.string().min(1, { message: 'O número é obrigatório.' }),
  coordenou: z.boolean(),
})

const encontreiroPessoaFormScheme = z.object({
  nome: z
    .string({ required_error: 'O nome é obrigatório.' })
    .min(3, { message: 'O nome precisa ter pelo menos 3 letras.' }),
  sobrenome: z
    .string({ required_error: 'O sobrenome é obrigatório.' })
    .min(3, { message: 'O sobrenome precisa ter pelo menos 3 letras' }),
  dataNascimento: z.string().min(10, { message: 'A data está incompleta' }),
  apelido: z.string().optional(),
  celular: z
    .string()
    .min(14, { message: 'O número de celular está incompleto' }),
  telefone: z.string().optional(),
  email: z
    .string({ required_error: 'O email é obrigatório.' })
    .email({ message: 'O email não é válido' }),
  instagram: z.string().optional(),
})

const encontreiroAddressFormScheme = z.object({
  enderecoCep: z
    .string({ required_error: 'O cep é obrigatório.' })
    .min(9, { message: 'O cep está incompleto.' }),
  estado: z.string().min(1, { message: 'O estado é obrigatório.' }),
  cidade: z.string().min(1, { message: 'A cidade é obrigatória.' }),
  bairro: z.string().min(1, { message: 'O bairro é obrigatório.' }),
  rua: z.string().min(1, { message: 'A rua é obrigatória.' }),
  enderecoNumero: z
    .string({ invalid_type_error: 'O número deve conter apenas dígitos.' })
    .regex(/^\d+$/, { message: 'O número deve conter apenas dígitos.' })
    .min(1, { message: 'O número é obrigatório.' }),
})

const encontreiroEncontroFormScheme = z.object({
  idEncontro: z.string({ required_error: 'Encontrão obrigatório' }),
  idCirculo: z.string({ required_error: 'Escolha um círculo' }),
  equipes: z.array(equipeFormScheme),
})

const encontreiroFormScheme = z.object({
  id: z.string(),
  slug: z.string(),
  pessoa: encontreiroPessoaFormScheme,
  endereco: encontreiroAddressFormScheme,
  encontro: encontreiroEncontroFormScheme,
})

export type EncontreiroFormDataInput = z.infer<typeof encontreiroFormScheme>

export function EncontreiroForm({ data }: EditEncontreiroProps) {
  const [isUpdating, setUpdating] = useState(false)
  const router = useRouter()

  const form = useForm<EncontreiroFormDataInput>({
    resolver: zodResolver(encontreiroFormScheme),
    defaultValues: {
      id: data ? data.id : '',
      slug: data ? data.slug : '',
      pessoa: {
        nome: data ? data.pessoa.nome : '',
        sobrenome: data ? data.pessoa.sobrenome : '',
        dataNascimento: data ? data.pessoa.dataNascimento : '',
        apelido: data && data.pessoa.apelido ? data.pessoa.apelido : '',
        celular: data ? data.pessoa.celular : '',
        telefone: data && data.pessoa.telefone ? data.pessoa.telefone : '',
        email: data ? data.pessoa.email : '',
        instagram: data && data.pessoa.instagram ? data.pessoa.instagram : '',
      },
      endereco: {
        enderecoCep: data ? data.endereco.enderecoCep : '',
        estado: data ? data.endereco.estado : '',
        cidade: data ? data.endereco.cidade : '',
        bairro: data ? data.endereco.bairro : '',
        rua: data ? data.endereco.rua : '',
        enderecoNumero:
          data && data.endereco.enderecoNumero
            ? data.endereco.enderecoNumero
            : '',
      },
      encontro: {
        idCirculo:
          data && data.encontro.idCirculo ? data.encontro.idCirculo : 'nao_sei',
        idEncontro: data ? data.encontro.idEncontro : '',
        equipes: data ? data.encontro.equipes : [],
      },
    },
  })

  const {
    handleSubmit,
    // control,
    formState: { errors },
  } = form

  async function handleUpdateEncontreiro(formDataInput: EncontreiroFormData) {
    setUpdating(true)
    if (formDataInput.slug === '') {
      await api
        .post('encontreiro', formDataInput)
        .then(async () => {
          router.push('/admin/dirigente')
        })
        .catch((err) => console.log(err, errors))
    } else {
      await api
        .put(`encontreiro/update/${formDataInput.slug}`, formDataInput)
        .then(async () => {
          router.push('/admin/dirigente')
        })
        .catch((err) => console.log(err, errors))
    }
  }

  return (
    <FormProvider {...form}>
      <form
        id="editEncontreiroForm"
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
            <NavItem title="EJC" icon={BookUser} link="#ejc-section" />
            <NavItem title="Salvar" icon={Save} link="#save-section" />
          </Nav>
          <div className="col-span-full lg:col-start-4">
            <div className="flex flex-col gap-6">
              {/* <FormField control={control} name="id" render={() => <></>} /> */}
              <PersonalDetails />
              <AddressDetails />
              <EncontroDetails />
              <Card
                id="save-section"
                className="w-full px-3 pt-8 text-zinc-700"
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
                          router.push('/admin/dirigente')
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
