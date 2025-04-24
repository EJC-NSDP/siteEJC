'use client'

import type { CarPersonFormData } from '@/@types/carro'
import { CardForm } from '@/components/Form/CardForm'
import { SelectGroupInput } from '@/components/Form/SelectInput/SelectGroupInput'
import {
  SelectItem,
  type SelectArray,
} from '@/components/Form/SelectInput/SelectItem'
import { TextInput } from '@/components/Form/TextInput'
import { FormField } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { getCEPData, type CEPResponse } from '@/utils/fetch-cep'
import { getPossiveisTios } from '@/utils/fetch-this-encontro'
import { getTioExternaData } from '@/utils/fetch-tio-externa'
import type { Role } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { toast } from 'sonner'
import { useHookFormMask } from 'use-mask-input'

interface MotoristaDetailsProps {
  disabled?: boolean
}

export function MotoristaDetails({ disabled = false }: MotoristaDetailsProps) {
  const form = useFormContext()

  const { data: possiveisExternas } = useQuery<SelectArray[]>({
    queryFn: async () => await getPossiveisTios(),
    queryKey: ['possiveisExternas'],
  })

  const { register, watch, control, setValue, trigger } = form

  const cepValue = watch('motorista.enderecoCep')
  const idValue = watch('motorista.id')
  const roleValue: Role = watch('motorista.role')

  const cannotEdit = roleValue !== 'TIOEXTERNA' && idValue !== '0'

  useEffect(() => {
    async function fetchAddress(cep: string) {
      const response = await getCEPData(cep)
      if (response === undefined) {
        toast.error('Seu CEP não foi encontrado')
      } else {
        const addressData: CEPResponse = await response.json()
        setValue('motorista.bairro', addressData.neighborhood, {
          shouldValidate: false,
        })
        setValue('motorista.rua', addressData.street, { shouldValidate: false })
        setValue('motorista.estado', addressData.state, {
          shouldValidate: false,
        })
        setValue('motorista.cidade', addressData.city, {
          shouldValidate: false,
        })
      }
    }
    if (cepValue && cepValue[8] !== '_') {
      fetchAddress(cepValue)
    } else {
      setValue('motorista.bairro', '')
      setValue('motorista.rua', '')
      setValue('motorista.estado', '')
      setValue('motorista.cidade', '')
    }
  }, [cepValue, setValue])

  useEffect(() => {
    async function fetchPessoa(id: string) {
      const pessoa: CarPersonFormData = await getTioExternaData(id)
      if (pessoa === undefined) {
        toast.error('Erro ao carregar o tio de externa')
      } else {
        setValue('motorista.id', pessoa.id, {
          shouldValidate: true,
        })
        setValue('motorista.role', pessoa.role, {
          shouldValidate: true,
        })
        setValue('motorista.nome', pessoa.nome, {
          shouldValidate: true,
        })
        setValue('motorista.sobrenome', pessoa.sobrenome, {
          shouldValidate: true,
        })
        setValue('motorista.apelido', pessoa.apelido, { shouldValidate: true })
        setValue('motorista.celular', pessoa.celular, { shouldValidate: true })
        setValue('motorista.telefone', pessoa.telefone, {
          shouldValidate: true,
        })
        setValue('motorista.email', pessoa.email, { shouldValidate: true })
        setValue('motorista.enderecoCep', pessoa.enderecoCep, {
          shouldValidate: true,
        })
        if (pessoa.enderecoNumero) {
          setValue(
            'motorista.enderecoNumero',
            pessoa.enderecoNumero.toString(),
            {
              shouldValidate: true,
            },
          )
        }
        setValue('motorista.bairro', pessoa.bairro, {
          shouldValidate: true,
        })
        setValue('motorista.estado', pessoa.estado, {
          shouldValidate: true,
        })
        setValue('motorista.cidade', pessoa.cidade, {
          shouldValidate: true,
        })
        setValue('motorista.rua', pessoa.rua, { shouldValidate: true })

        trigger([
          'motorista.id',
          'motorista.role',
          'motorista.nome',
          'motorista.sobrenome',
          'motorista.apelido',
          'motorista.celular',
          'motorista.telefone',
          'motorista.email',
          'motorista.enderecoCep',
          'motorista.enderecoNumero',
          'motorista.bairro',
          'motorista.estado',
          'motorista.cidade',
          'motorista.rua',
          'motorista.observacaoMotorista',
        ])
      }
    }

    function clearPessoa(id: string) {
      setValue('motorista.id', id)
      setValue('motorista.role', 'TIOEXTERNA')
      setValue('motorista.nome', '')
      setValue('motorista.sobrenome', '')
      setValue('motorista.apelido', '')
      setValue('motorista.celular', '')
      setValue('motorista.telefone', '')
      setValue('motorista.email', '')
      setValue('motorista.enderecoCep', '')
      setValue('motorista.enderecoNumero', 0)
      setValue('motorista.bairro', '')
      setValue('motorista.estado', '')
      setValue('motorista.cidade', '')
      setValue('motorista.rua', '')
      setValue('motorista.observacaoMotorista', '')
    }

    if (
      idValue === '-1' ||
      idValue === '0' ||
      idValue === '1' ||
      idValue === undefined
    ) {
      clearPessoa(idValue)
    } else {
      fetchPessoa(idValue)
    }
  }, [idValue, setValue, trigger])

  const registerWithMask = useHookFormMask(register)

  return (
    <CardForm title="Motorista" sectionId="driver-section">
      <div className="flex flex-col gap-4 pt-4 lg:gap-8">
        <div className="grid grid-cols-1 gap-4 lg:gap-8">
          <FormField
            control={control}
            name="motorista.id"
            render={({ field }) => {
              return (
                <SelectGroupInput
                  label="Selecione o tio de externa:"
                  onChange={field.onChange}
                  value={field.value}
                  disabled={disabled}
                >
                  <SelectItem
                    key={'novo_tio'}
                    value={'0'}
                    text={'Novo Tio de externa'}
                  />
                  {possiveisExternas &&
                    possiveisExternas.map((item) => {
                      return (
                        <SelectItem
                          key={item.value}
                          value={item.value}
                          text={item.label}
                          badge={item.badge}
                        />
                      )
                    })}
                </SelectGroupInput>
              )
            }}
          />
        </div>

        <div className="col-span-2 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
          <FormField
            control={control}
            name="motorista.nome"
            render={({ field }) => (
              <TextInput label={'Nome *'}>
                <Input readOnly={cannotEdit} {...field} />
              </TextInput>
            )}
          />
          <FormField
            control={control}
            name="motorista.sobrenome"
            render={({ field }) => (
              <TextInput label={'Sobrenome *'}>
                <Input readOnly={cannotEdit} {...field} />
              </TextInput>
            )}
          />
          <FormField
            control={control}
            name="motorista.apelido"
            render={({ field }) => {
              return (
                <TextInput label={'Apelido'}>
                  <Input readOnly={cannotEdit} {...field} />
                </TextInput>
              )
            }}
          />
          <FormField
            control={control}
            name="motorista.email"
            render={({ field }) => (
              <TextInput label={'E-mail *'}>
                <Input readOnly={cannotEdit} {...field} />
              </TextInput>
            )}
          />
          <FormField
            control={control}
            name="motorista.celular"
            render={({ field }) => {
              return (
                <TextInput label={'Celular *'}>
                  <Input
                    readOnly={cannotEdit}
                    {...field}
                    {...registerWithMask(field.name, '(99) [9]9999-9999')}
                    placeholder="(__) _____-____"
                  />
                </TextInput>
              )
            }}
          />
          <FormField
            control={control}
            name="motorista.telefone"
            render={({ field }) => {
              return (
                <TextInput label={'Telefone'}>
                  <Input
                    readOnly={cannotEdit}
                    {...field}
                    {...registerWithMask(field.name, '(99) [9]9999-9999')}
                    placeholder="(__) _____-____"
                  />
                </TextInput>
              )
            }}
          />
          <FormField
            control={control}
            name="motorista.enderecoCep"
            render={({ field }) => (
              <TextInput label={'CEP *'}>
                <Input
                  readOnly={cannotEdit}
                  {...field}
                  {...registerWithMask(field.name, '99999-999')}
                />
              </TextInput>
            )}
          />
          <FormField
            control={control}
            name="motorista.bairro"
            render={({ field }) => (
              <TextInput label={'Bairro *'}>
                <Input readOnly={cannotEdit} {...field} />
              </TextInput>
            )}
          />
          <FormField
            control={control}
            name="motorista.rua"
            render={({ field }) => (
              <TextInput label={'Rua *'}>
                <Input readOnly={cannotEdit} {...field} />
              </TextInput>
            )}
          />
          <FormField
            control={control}
            name="motorista.enderecoNumero"
            render={({ field }) => (
              <TextInput label={'Número do endereço*'}>
                <Input readOnly={disabled} {...field} />
              </TextInput>
            )}
          />
          <FormField
            control={control}
            name="motorista.estado"
            render={({ field }) => (
              <TextInput label={'Estado *'}>
                <Input readOnly={true} {...field} />
              </TextInput>
            )}
          />
          <FormField
            control={control}
            name="motorista.cidade"
            render={({ field }) => (
              <TextInput label={'Cidade *'}>
                <Input readOnly={true} {...field} />
              </TextInput>
            )}
          />
        </div>
      </div>
    </CardForm>
  )
}
