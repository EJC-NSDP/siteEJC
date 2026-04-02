import z from 'zod'

const circuloScheme = z.object({
  id: z.string(),
  idCorCirculo: z.number(),
  cor: z.string(),
  tioAparente: z.string().optional(),
  tioSecreto: z.string().optional(),
  ativo: z.boolean(),
})

export const circulosOrdemScheme = z.object({
  circulos: z.array(circuloScheme),
})

export type CirculosOrdemData = z.infer<typeof circulosOrdemScheme>
export type CirculoItem = z.infer<typeof circuloScheme>
