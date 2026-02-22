'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Building2, Save, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

import { AddressCard } from './(pageComponents)/AddressCard'
import { PersonalCard } from './(pageComponents)/PersonalCard'

import type { EncontristaSecreData } from '@/app/api/secretaria/encontrista/[slug]/get-encontrista-secre'
import { Nav } from '@/components/Nav/Nav'
import { NavItem } from '@/components/Nav/NavItem'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { api } from '@/lib/axios'

interface EditEncontristaSecreProps {
  data: EncontristaSecreData
}

const editSecreFormScheme = z.object({
  slug: z.string(),
  nome: z
    .string({ required_error: 'O nome é obrigatório.' })
    .min(3, { message: 'O nome precisa ter pelo menos 3 letras.' }),
  sobrenome: z
    .string({ required_error: 'O sobrenome é obrigatório.' })
    .min(3, { message: 'O sobrenome precisa ter pelo menos 3 letras' }),
  apelido: z.string().optional(),
  dataNascimento: z.string().min(10, { message: 'A data está incompleta' }),
  celular: z
    .string()
    .min(14, { message: 'O número de celular está incompleto' }),
  instagram: z.string().optional(),
  cep: z
    .string({ required_error: 'O cep é obrigatório.' })
    .min(9, { message: 'O cep está incompleto.' }),
  estado: z.string().optional(),
  cidade: z.string().optional(),
  bairro: z.string().optional(),
  rua: z.string().min(1, { message: 'A rua é obrigatória.' }),
  numero: z.coerce.number().min(1, { message: 'O número é obrigatório.' }),
})

export type EditSecreFormDataInput = z.infer<typeof editSecreFormScheme>

export function EditSecreEncontristaForm({ data }: EditEncontristaSecreProps) {
  const [isUpdating, setUpdating] = useState(false)
  const router = useRouter()

  const form = useForm<EditSecreFormDataInput>({
    resolver: zodResolver(editSecreFormScheme),
    defaultValues: {
      slug: data.slug,
      nome: data.nome,
      sobrenome: data.sobrenome,
      apelido: data.apelido || '',
      dataNascimento: data.dataNasc,
      celular: data.celular,
      instagram: data.instagram,
      cep: data.endereco.cep,
      estado: data.endereco.estado,
      cidade: data.endereco.cidade,
      bairro: data.endereco.bairro,
      rua: data.endereco.rua,
      numero: data.endereco.numero,
    },
  })

  const {
    handleSubmit,
    formState: { errors },
  } = form

  async function handleUpdateEncontreiroSecre(
    formDataInput: EditSecreFormDataInput,
  ) {
    setUpdating(true)
    await api
      .put(`secretaria/encontrista/${data.slug}`, formDataInput)
      .then(async () => {
        router.push('/admin/secretaria')
      })
      .catch((err) => console.log(err, errors))
  }

  return (
    <FormProvider {...form}>
      <form
        id="editSecreEncontristaForm"
        onSubmit={handleSubmit(handleUpdateEncontreiroSecre)}
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
            <NavItem title="Salvar" icon={Save} link="#save-section" />
          </Nav>

          <div className="col-span-full lg:col-start-4">
            <div className="flex flex-col gap-6">
              <PersonalCard />
              <AddressCard />
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
                          router.push('/admin/secretaria')
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
