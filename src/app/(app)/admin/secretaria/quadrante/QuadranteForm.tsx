'use client'

import type { ConfigQuadrante } from '@/@types/quadrante'
import type {
  UpdateQuadranteData,
  UpdateQuadranteSettingsResponse,
} from '@/app/api/secretaria/quadrante/settings/route'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/axios'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Value_Quadrante as valueQuadrante } from '@prisma/client'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Capas } from './Capas'
import { Cartas } from './Cartas'
import { Cartazes } from './Cartazes'

interface QuadranteFormProps {
  config: ConfigQuadrante
}

const cartazesScheme = z.object({
  cor: z.string(),
  imagem: z
    .string({
      required_error: 'O cartaz é obrigatório.',
    })
    .url({ message: 'O cartaz é deve ser uma url' }),
})

const quadranteScheme = z.object({
  capaPb: z
    .string({
      required_error: 'A capa do quadrante é obrigatória.',
    })
    .url({ message: 'A capa do quadrante deve ser uma url' }),
  capaColorida: z
    .string({
      required_error: 'A capa do quadrante é obrigatória.',
    })
    .url({ message: 'A capa do quadrante deve ser uma url' }),
  circulosPb: z
    .string({
      required_error: 'A capa dos círculos é obrigatória.',
    })
    .url({ message: 'A capa dos círculos deve ser uma url' }),
  circulosColorida: z
    .string({
      required_error: 'A capa dos círculos é obrigatória.',
    })
    .url({ message: 'A capa dos círculos deve ser uma url' }),
  equipes: z
    .string({ required_error: 'A capa das equipes é obrigatória.' })
    .url({ message: 'A capa das equipes deve ser uma url' }),
  cartaPapa: z
    .string({ required_error: 'A carta do papa é obrigatória.' })
    .url({ message: 'A carta do papa deve ser uma url' }),
  cartaPadre: z
    .string({ required_error: 'A carta do padre é obrigatória.' })
    .url({ message: 'A carta do padre deve ser uma url' }),
  cartaDiris: z
    .string({
      required_error: 'A carta dos dirigentes é obrigatória.',
    })
    .url({ message: 'A carta dos dirigentes deve ser uma url' }),
  cartazes: z.array(cartazesScheme),
})

export type quadranteData = z.infer<typeof quadranteScheme>

export function QuadranteForm({ config }: QuadranteFormProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const form = useForm<quadranteData>({
    resolver: zodResolver(quadranteScheme),
    defaultValues: {
      capaPb: config.capas.principal.pb,
      capaColorida: config.capas.principal.colorida,
      circulosPb: config.capas.circulos.pb,
      circulosColorida: config.capas.circulos.colorida,
      equipes: config.capas.equipes,
      cartaPapa: config.cartas.papa,
      cartaPadre: config.cartas.padre,
      cartaDiris: config.cartas.diris,
      cartazes: config.cartazes,
    },
  })

  const { handleSubmit } = form

  async function updateConfig(formDataInput: quadranteData) {
    setIsUpdating(true)
    const updatedData: UpdateQuadranteData[] = [
      {
        value: 'capa_pb',
        imageUrl: formDataInput.capaPb,
      },
      {
        value: 'capa_colorida',
        imageUrl: formDataInput.capaColorida,
      },
      {
        value: 'circulos_pb',
        imageUrl: formDataInput.circulosPb,
      },
      {
        value: 'circulos_colorida',
        imageUrl: formDataInput.circulosColorida,
      },
      {
        value: 'equipe',
        imageUrl: formDataInput.equipes,
      },
      {
        value: 'carta_papa',
        imageUrl: formDataInput.cartaPapa,
      },
      {
        value: 'carta_padre',
        imageUrl: formDataInput.cartaPadre,
      },
      {
        value: 'carta_diris',
        imageUrl: formDataInput.cartaDiris,
      },
    ]

    config.cartazes.forEach((cartaz) => {
      const cor = formDataInput.cartazes.find(
        (formCartaz) => formCartaz.cor === cartaz.cor,
      )

      if (cor) {
        const update: UpdateQuadranteData = {
          value: cor.cor.toLowerCase() as valueQuadrante,
          imageUrl: cor.imagem,
        }
        updatedData.push(update)
      }
    })

    await api
      .patch('secretaria/quadrante/settings', updatedData)
      .then(async (result) => {
        const response: UpdateQuadranteSettingsResponse = result.data
        if (response.atualizados.length === 1) {
          toast.success(`${response.atualizados.length} informação atualizada!`)
        } else {
          toast.success(
            `${response.atualizados.length} informações atualizadas!`,
          )
        }
        setIsUpdating(false)
      })
      .catch((err) => {
        toast.error('Erro ao atualizar as informações do quadrante.')
        console.log(err)
        setIsUpdating(false)
      })
    setIsUpdating(false)
  }

  return (
    <FormProvider {...form}>
      <form
        id="quadranteForm"
        onSubmit={handleSubmit(updateConfig)}
        className="space-y-4"
      >
        <Capas />
        <Cartas />
        <Cartazes cartazes={config.cartazes} />
        <div className="flex items-center justify-end gap-5 px-0 py-5 text-lg lg:flex-row lg:gap-7 lg:py-7">
          <Button type="submit" className="h-10 w-40" disabled={isUpdating}>
            {isUpdating ? 'Atualizando...' : 'Atualizar'}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
