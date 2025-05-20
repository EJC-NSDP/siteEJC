'use client'

import type { ConfigQuadrante } from '@/@types/quadrante'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
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
  equipe: z
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
  const form = useForm<quadranteData>({
    resolver: zodResolver(quadranteScheme),
    defaultValues: {
      capaPb: config.capas.principal.pb,
      capaColorida: config.capas.principal.colorida,
      circulosPb: config.capas.circulos.pb,
      circulosColorida: config.capas.circulos.colorida,
      equipe: config.capas.equipes,
      cartaPapa: config.cartas.papa,
      cartaPadre: config.cartas.padre,
      cartaDiris: config.cartas.diris,
      cartazes: config.cartazes,
    },
  })

  const { handleSubmit } = form

  return (
    <FormProvider {...form}>
      <form
        id="quadranteForm"
        onSubmit={handleSubmit((error) => console.error(error))}
        className="space-y-4"
      >
        <Capas />
        <Cartas />
        <Cartazes cartazes={config.cartazes} />
      </form>
    </FormProvider>
  )
}
