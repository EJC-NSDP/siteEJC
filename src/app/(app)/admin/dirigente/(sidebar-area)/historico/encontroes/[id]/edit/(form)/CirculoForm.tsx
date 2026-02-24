'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Circle, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

import { CirculoDetails } from './CirculoDetails'

import type { CirculoFormData } from '@/@types/circulo'
import { Nav } from '@/components/Nav/Nav'
import { NavItem } from '@/components/Nav/NavItem'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { api } from '@/lib/axios'

interface EditCirculoProps {
  data: CirculoFormData
}

const circuloTioFormScheme = z.object({
  id: z.string().optional(),
  numeroEncontro: z.string().optional(),
  nome: z.string().optional(),
})

const circuloFormScheme = z.object({
  id: z.string(),
  idEncontro: z.string(),
  nome: z.string().optional(),
  corCirculo: z.string(),
  tioAparente: circuloTioFormScheme.optional(),
  tioSecreto: circuloTioFormScheme.optional(),
})

export type CirculoFormDataInput = z.infer<typeof circuloFormScheme>

export function CirculoForm({ data }: EditCirculoProps) {
  const [isUpdating, setUpdating] = useState(false)
  const router = useRouter()

  const form = useForm<CirculoFormDataInput>({
    resolver: zodResolver(circuloFormScheme),
    defaultValues: {
      id: data.id,
      idEncontro: data.idEncontro,
      corCirculo: data.corCirculo,
      nome: data.nome || '',
      tioAparente: data.tioAparente || {
        id: 'unknown',
        nome: '',
        numeroEncontro: '',
      },
      tioSecreto: data.tioSecreto || {
        id: 'unknown',
        nome: '',
        numeroEncontro: '',
      },
    },
  })

  const {
    handleSubmit,
    // control,
    formState: { errors },
  } = form

  async function handleUpdateCirculo(formDataInput: CirculoFormDataInput) {
    const adaptFormData: CirculoFormData = {
      id: formDataInput.id,
      nome: formDataInput.nome || null,
      corCirculo: formDataInput.corCirculo,
      idEncontro: formDataInput.idEncontro,
      tioAparente: formDataInput.tioAparente
        ? {
            id: formDataInput.tioAparente.id || '',
            nome: formDataInput.tioAparente.nome || '',
            numeroEncontro: formDataInput.tioAparente.numeroEncontro || '',
          }
        : null,
      tioSecreto: formDataInput.tioSecreto
        ? {
            id: formDataInput.tioSecreto.id || '',
            nome: formDataInput.tioSecreto.nome || '',
            numeroEncontro: formDataInput.tioSecreto.numeroEncontro || '',
          }
        : null,
    }
    setUpdating(true)
    try {
      await api
        .put(`circulo/${adaptFormData.id}`, adaptFormData)
        .then(async () => {
          router.push('/admin/dirigente/circulo')
        })
    } catch (err) {
      console.log(err, errors)
    }
  }

  return (
    <FormProvider {...form}>
      <form
        id="editEncontreiroForm"
        onSubmit={handleSubmit(handleUpdateCirculo)}
      >
        <div className="grid w-full grid-cols-12 gap-7">
          <Nav>
            <NavItem title="Círculo" icon={Circle} link="#circulo-section" />
            <NavItem title="Salvar" icon={Save} link="#save-section" />
          </Nav>
          <div className="col-span-full lg:col-start-4">
            <div className="flex flex-col gap-6">
              <CirculoDetails />
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
                          router.push('/admin/dirigente/circulo')
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
