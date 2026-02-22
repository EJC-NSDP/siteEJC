'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Armchair, Car, CarFront, Save } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

import { CaronaDetails } from './CaronaDetails'
import { CarroDetails } from './CarroDetails'
import { MotoristaDetails } from './MotoristaDetails'

import type { CarFormData } from '@/@types/carro'
import { Nav } from '@/components/Nav/Nav'
import { NavItem } from '@/components/Nav/NavItem'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Role } from '@/enums'
import { api } from '@/lib/axios'

interface CarroFormProps {
  data?: CarFormData
  disabled?: boolean
}

const carroFormScheme = z.object({
  numeroCarro: z.coerce.number().min(1, { message: 'O número é obrigatório.' }),
  placaCarro: z.string({ required_error: 'A placa é obrigatório.' }),
  modeloCarro: z.string({ required_error: 'O modelo do carro é obrigatório.' }),
  lugaresCarro: z.coerce
    .number()
    .min(1, { message: 'O número de vagas é obrigatório.' }),
  observacaoExterna: z.string().optional(),
})

const carroPessoaFormScheme = z.object({
  id: z.string(),
  role: z.nativeEnum(Role),
  nome: z
    .string({ required_error: 'O nome é obrigatório.' })
    .min(3, { message: 'O nome precisa ter pelo menos 3 letras.' }),
  sobrenome: z
    .string({ required_error: 'O sobrenome é obrigatório.' })
    .min(3, { message: 'O sobrenome precisa ter pelo menos 3 letras' }),
  apelido: z.string().optional(),
  celular: z
    .string()
    .min(14, { message: 'O número de celular está incompleto' }),
  telefone: z.string().optional(),
  email: z
    .string({ required_error: 'O email é obrigatório.' })
    .email({ message: 'O email não é válido' }),
  enderecoCep: z
    .string({ required_error: 'O cep é obrigatório.' })
    .min(9, { message: 'O cep está incompleto.' }),
  enderecoNumero: z
    .string({
      required_error: 'O número é obrigatório.',
      invalid_type_error: 'O número é obrigatório.',
    })
    .regex(/^\d+$/, { message: 'O número deve conter apenas dígitos.' })
    .min(1, { message: 'O número é obrigatório.' }),
  bairro: z.string().min(1, { message: 'O bairro é obrigatório.' }),
  estado: z.string().min(1, { message: 'O estado é obrigatório.' }),
  cidade: z.string().min(1, { message: 'A cidade é obrigatória.' }),
  rua: z.string().min(1, { message: 'A rua é obrigatória.' }),
  observacaoMotorista: z.string().optional(),
})
const carroCaronaFormScheme = z
  .object({
    id: z.string(),
    role: z.nativeEnum(Role),
    nome: z.string().optional(),
    sobrenome: z.string().optional(),
    apelido: z.string().optional(),
    celular: z.string().optional(),
    telefone: z.string().optional(),
    email: z.string().optional(),
    enderecoCep: z.string().optional(),
    enderecoNumero: z.string().optional(),
    bairro: z.string().optional(),
    estado: z.string().optional(),
    cidade: z.string().optional(),
    rua: z.string().optional(),
    observacaoMotorista: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.id !== '1') {
      type RequiredFields =
        | 'nome'
        | 'sobrenome'
        | 'celular'
        | 'email'
        | 'enderecoCep'
        | 'enderecoNumero'
        | 'bairro'
        | 'estado'
        | 'cidade'
        | 'rua'

      const requiredFields: RequiredFields[] = [
        'nome',
        'sobrenome',
        'celular',
        'email',
        'enderecoCep',
        'enderecoNumero',
        'bairro',
        'estado',
        'cidade',
        'rua',
      ]

      requiredFields.forEach((field) => {
        if (!data[field]) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Este campo é obrigatório para toda carona`,
            path: [field],
          })
        }
      })
    }
  })

const novoCarroFormScheme = z.object({
  idCarro: z.string(),
  numeroEncontro: z.number(),
  carro: carroFormScheme,
  motorista: carroPessoaFormScheme,
  carona: carroCaronaFormScheme,
})

export type CarroFormDataInput = z.infer<typeof novoCarroFormScheme>

export function CarroForm({ data, disabled }: CarroFormProps) {
  const isCreating = !data
  const [isSending, setIsSending] = useState(false)
  const router = useRouter()

  const form = useForm<CarroFormDataInput>({
    resolver: zodResolver(novoCarroFormScheme),
    defaultValues: {
      idCarro: data?.idCarro || '',
      numeroEncontro: data?.numeroEncontro || 1,
      carro: {
        modeloCarro: data?.carro.modeloCarro || undefined,
        placaCarro: data?.carro.placaCarro || undefined,
        lugaresCarro: data?.carro.lugaresCarro || 4,
        observacaoExterna: data?.carro.observacaoExterna || undefined,
        numeroCarro: data?.carro.numeroCarro || undefined,
      },
      motorista: {
        id: data?.motorista.id || '-1',
        nome: data?.motorista.nome || '',
        sobrenome: data?.motorista.sobrenome || '',
        role: data?.motorista.role || 'TIOEXTERNA',
        celular: data?.motorista.celular || '',
        telefone: data?.motorista.telefone || undefined,
        email: data?.motorista.email || '',
        enderecoCep: data?.motorista.enderecoCep || '',
        bairro: data?.motorista.bairro || '',
        cidade: data?.motorista.cidade || '',
        estado: data?.motorista.estado || '',
        rua: data?.motorista.rua || '',
        enderecoNumero: data?.motorista.enderecoNumero || '',
        apelido: data?.motorista.apelido || '',
        observacaoMotorista: data?.motorista.observacaoMotorista || '',
      },

      carona: {
        id: data?.carona?.id || '1',
        nome: data?.carona?.nome || '',
        sobrenome: data?.carona?.sobrenome || '',
        role: data?.carona?.role || 'TIOEXTERNA',
        celular: data?.carona?.celular || '',
        telefone: data?.carona?.telefone || undefined,
        email: data?.carona?.email || '',
        enderecoCep: data?.carona?.enderecoCep || '',
        bairro: data?.carona?.bairro || '',
        cidade: data?.carona?.cidade || '',
        estado: data?.carona?.estado || '',
        rua: data?.carona?.rua || '',
        enderecoNumero: data?.carona?.enderecoNumero || '',
        apelido: data?.carona?.apelido || '',
        observacaoMotorista: data?.carona?.observacaoMotorista || '',
      },
    },
  })

  const {
    handleSubmit,
    formState: { errors },
  } = form

  async function handleUpdateCarro(formDataInput: CarroFormDataInput) {
    const adaptForm: CarFormData = {
      ...formDataInput,
      carona:
        formDataInput.carona.id === '1'
          ? null
          : {
              id: formDataInput.carona.id,
              role: formDataInput.carona.role,
              nome: formDataInput.carona.nome || '',
              sobrenome: formDataInput.carona.sobrenome || '',
              celular: formDataInput.carona.celular || '',
              telefone: formDataInput.carona.telefone,
              email: formDataInput.carona.email || '',
              enderecoCep: formDataInput.carona.enderecoCep || '',
              bairro: formDataInput.carona.bairro || '',
              cidade: formDataInput.carona.cidade || '',
              estado: formDataInput.carona.estado || '',
              rua: formDataInput.carona.rua || '',
              enderecoNumero: formDataInput.carona.enderecoNumero || '',
              apelido: formDataInput.carona.apelido,
              observacaoMotorista: formDataInput.carona.observacaoMotorista,
            },
    }
    setIsSending(true)
    if (adaptForm.idCarro === '') {
      await api
        .post('carro', adaptForm)
        .then(async () => {
          router.push('/admin/externa/carros')
        })
        .catch((err) => console.log(err, errors))
    } else {
      await api
        .put(
          `carro/${adaptForm.idCarro}/${adaptForm.numeroEncontro}/update`,
          adaptForm,
        )
        .then(async () => {
          router.push('/admin/externa/carros')
        })
        .catch((err) => console.log(err, errors))
    }
  }

  return (
    <FormProvider {...form}>
      <form id="editCarroForm" onSubmit={handleSubmit(handleUpdateCarro)}>
        <div className="grid w-full grid-cols-12 gap-7">
          <Nav>
            <NavItem title="Carro" icon={Car} link="#car-section" />
            <NavItem title="Motorista" icon={CarFront} link="#driver-section" />
            <NavItem title="Carona" icon={Armchair} link="#copilot-section" />
            <NavItem title="Salvar" icon={Save} link="#save-section" />
          </Nav>
          <div className="col-span-full lg:col-start-4">
            <div className="flex flex-col gap-6">
              <CarroDetails disabled={disabled} />
              <MotoristaDetails disabled={disabled} />
              <CaronaDetails disabled={disabled} />
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
                      <Link href="/admin/externa/carros">
                        <Button
                          type="button"
                          variant="outline"
                          className="disabled:opacity-50' h-10 w-40 disabled:cursor-wait"
                          disabled={isSending}
                        >
                          Voltar
                        </Button>
                      </Link>
                      <Button
                        type="submit"
                        className="flex h-10 w-40 aria-hidden:hidden"
                        disabled={isSending}
                        aria-hidden={disabled}
                      >
                        {isCreating ? 'Criar' : 'Atualizar'}
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
