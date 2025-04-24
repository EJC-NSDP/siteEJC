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

interface CaronaDetailsProps {
  disabled?: boolean
}

export function CaronaDetails({ disabled = false }: CaronaDetailsProps) {
  const form = useFormContext()

  const { data: possiveisExternas } = useQuery<SelectArray[]>({
    queryFn: async () => await getPossiveisTios(),
    queryKey: ['possiveisExternas'],
  })

  const { register, watch, control, setValue, trigger } = form

  const cepValue = watch('carona.enderecoCep')
  const idValue = watch('carona.id')
  const roleValue: Role = watch('carona.role')

  const noCarona = idValue !== '1'
  const cannotEdit = roleValue !== 'TIOEXTERNA' && idValue !== '0'

  useEffect(() => {
    async function fetchAddress(cep: string) {
      const response = await getCEPData(cep)
      if (response === undefined) {
        toast.error('Seu CEP não foi encontrado')
      } else {
        const addressData: CEPResponse = await response.json()
        setValue('carona.bairro', addressData.neighborhood, {
          shouldValidate: false,
        })
        setValue('carona.rua', addressData.street, { shouldValidate: false })
        setValue('carona.estado', addressData.state, {
          shouldValidate: false,
        })
        setValue('carona.cidade', addressData.city, {
          shouldValidate: false,
        })
      }
    }
    if (cepValue && cepValue[8] !== '_') {
      fetchAddress(cepValue)
    } else {
      setValue('carona.bairro', '')
      setValue('carona.rua', '')
      setValue('carona.estado', '')
      setValue('carona.cidade', '')
    }
  }, [cepValue, setValue])

  useEffect(() => {
    async function fetchPessoa(id: string) {
      const pessoa: CarPersonFormData = await getTioExternaData(id)
      if (pessoa === undefined) {
        toast.error('Erro ao carregar o tio de externa')
      } else {
        setValue('carona.id', pessoa.id, {
          shouldValidate: true,
        })
        setValue('carona.role', pessoa.role, {
          shouldValidate: true,
        })
        setValue('carona.nome', pessoa.nome, {
          shouldValidate: true,
        })
        setValue('carona.sobrenome', pessoa.sobrenome, {
          shouldValidate: true,
        })
        setValue('carona.apelido', pessoa.apelido, { shouldValidate: true })
        setValue('carona.celular', pessoa.celular, { shouldValidate: true })
        setValue('carona.telefone', pessoa.telefone, {
          shouldValidate: true,
        })
        setValue('carona.email', pessoa.email, { shouldValidate: true })
        setValue('carona.enderecoCep', pessoa.enderecoCep, {
          shouldValidate: true,
        })
        if (pessoa.enderecoNumero) {
          setValue('carona.endNumero', pessoa.enderecoNumero.toString(), {
            shouldValidate: true,
          })
        }
        setValue('carona.bairro', pessoa.bairro, {
          shouldValidate: true,
        })
        setValue('carona.estado', pessoa.estado, {
          shouldValidate: true,
        })
        setValue('carona.cidade', pessoa.cidade, {
          shouldValidate: true,
        })
        setValue('carona.rua', pessoa.rua, { shouldValidate: true })

        trigger([
          'carona.id',
          'carona.role',
          'carona.nome',
          'carona.sobrenome',
          'carona.apelido',
          'carona.celular',
          'carona.telefone',
          'carona.email',
          'carona.enderecoCep',
          'carona.enderecoNumero',
          'carona.bairro',
          'carona.estado',
          'carona.cidade',
          'carona.rua',
        ])
      }
    }

    function clearPessoa(id: string) {
      setValue('carona.id', id)
      setValue('carona.role', 'TIOEXTERNA')
      setValue('carona.nome', '')
      setValue('carona.sobrenome', '')
      setValue('carona.apelido', '')
      setValue('carona.celular', '')
      setValue('carona.telefone', '')
      setValue('carona.email', '')
      setValue('carona.enderecoCep', '')
      setValue('carona.enderecoNumero', 0)
      setValue('carona.bairro', '')
      setValue('carona.estado', '')
      setValue('carona.cidade', '')
      setValue('carona.rua', '')
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
    <CardForm title="Carona" sectionId="copilot-section">
      <div className="flex flex-col gap-4 pt-4 lg:gap-8">
        <div className="grid grid-cols-1 gap-4 lg:gap-8">
          <FormField
            control={control}
            name="carona.id"
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

                  <SelectItem
                    key={'sem_tio'}
                    value={'1'}
                    text={'Não terá carona'}
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

        {noCarona && (
          <div className="col-span-2 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
            <FormField
              control={control}
              name="carona.nome"
              render={({ field }) => (
                <TextInput label={'Nome *'}>
                  <Input readOnly={cannotEdit} {...field} />
                </TextInput>
              )}
            />
            <FormField
              control={control}
              name="carona.sobrenome"
              render={({ field }) => (
                <TextInput label={'Sobrenome *'}>
                  <Input readOnly={cannotEdit} {...field} />
                </TextInput>
              )}
            />
            <FormField
              control={control}
              name="carona.apelido"
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
              name="carona.email"
              render={({ field }) => (
                <TextInput label={'E-mail *'}>
                  <Input readOnly={cannotEdit} {...field} />
                </TextInput>
              )}
            />
            <FormField
              control={control}
              name="carona.celular"
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
              name="carona.telefone"
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
              name="carona.enderecoCep"
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
              name="carona.bairro"
              render={({ field }) => (
                <TextInput label={'Bairro *'}>
                  <Input readOnly={cannotEdit} {...field} />
                </TextInput>
              )}
            />
            <FormField
              control={control}
              name="carona.rua"
              render={({ field }) => (
                <TextInput label={'Rua *'}>
                  <Input readOnly={cannotEdit} {...field} />
                </TextInput>
              )}
            />
            <FormField
              control={control}
              name="carona.enderecoNumero"
              render={({ field }) => (
                <TextInput label={'Número do endereço*'}>
                  <Input readOnly={disabled} {...field} />
                </TextInput>
              )}
            />
            <FormField
              control={control}
              name="carona.estado"
              render={({ field }) => (
                <TextInput label={'Estado *'}>
                  <Input readOnly={true} {...field} />
                </TextInput>
              )}
            />
            <FormField
              control={control}
              name="carona.cidade"
              render={({ field }) => (
                <TextInput label={'Cidade *'}>
                  <Input readOnly={true} {...field} />
                </TextInput>
              )}
            />
          </div>
        )}
      </div>
    </CardForm>
  )
}
