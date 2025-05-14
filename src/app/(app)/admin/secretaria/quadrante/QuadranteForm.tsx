import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Capas } from './Capas'
import { CardCirculos } from './CardCirculos'

const circulos = [
  {
    id: '2',
    cor: 'Azul',
    nome: '',
    image: '',
  },
  {
    id: '3',
    cor: 'Laranja',
    nome: '',
    image: '',
  },
  {
    id: '4',
    cor: 'Verde',
    nome: '',
    image: '',
  },
  {
    id: '5',
    cor: 'Vermelho',
    nome: '',
    image: '',
  },
]

const loginScheme = z.object({
  email: z
    .string({ required_error: 'O email é obrigatório.' })
    .email({ message: 'O email não é válido' }),

  password: z.string({ required_error: 'A senha é obrigatória.' }),
})

export type loginData = z.infer<typeof loginScheme>
export function QuadranteForm() {
  const form = useForm<loginData>({
    resolver: zodResolver(loginScheme),
  })

  const { handleSubmit } = form

  return (
    <FormProvider {...form}>
      <form
        id="loginForm"
        onSubmit={handleSubmit(() => console.log('Enviando'))}
        className="space-y-4"
      >
        <Capas />
        <CardCirculos circulos={circulos} />
      </form>
    </FormProvider>
  )
}
