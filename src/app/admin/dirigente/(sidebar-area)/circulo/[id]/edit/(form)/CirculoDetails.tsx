'use client'

import { CardForm } from '@/components/Form/CardForm'
import { DisabledInput } from '@/components/Form/DisabledInput'
import { SelectGroupInput } from '@/components/Form/SelectInput/SelectGroupInput'
import {
  SelectItem,
  type SelectArray,
} from '@/components/Form/SelectInput/SelectItem'
import { TextInput } from '@/components/Form/TextInput'
import { FormField } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { getCirculoColor } from '@/utils/fetch-color'
import { getTiosCirculoFromEncontro } from '@/utils/fetch-encontros'
import { useQuery } from '@tanstack/react-query'
import { useFormContext } from 'react-hook-form'

export function CirculoDetails() {
  const form = useFormContext()

  const { control, watch } = form

  const corCirculoValue = watch('corCirculo')

  const idEncontro = watch('idEncontro')
  const corCirculo = getCirculoColor(corCirculoValue || '')

  const { data: tiosCirculo } = useQuery<SelectArray[]>({
    queryFn: async () => await getTiosCirculoFromEncontro(idEncontro),
    queryKey: ['tiosCirculo', idEncontro],
    enabled: !!idEncontro,
  })

  return (
    <CardForm title="Círculo" sectionId="circulo-section">
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
        <FormField
          control={control}
          name="nome"
          render={({ field }) => (
            <TextInput label={'Nome'}>
              <Input autoFocus {...field} />
            </TextInput>
          )}
        />

        <DisabledInput label="Círculo" value={corCirculoValue}>
          {corCirculo && (
            <div
              className={cn(
                corCirculo,
                'flex h-5 w-5 items-center justify-center rounded-full shadow-sm',
              )}
            />
          )}
        </DisabledInput>

        <FormField
          control={control}
          name="tioAparente.id"
          render={({ field }) => (
            <SelectGroupInput
              label="Tio Aparente"
              onChange={field.onChange}
              value={field.value}
              className="w-full"
            >
              <SelectItem key="unknown" value="unknown" text="Não sabemos" />
              {tiosCirculo &&
                tiosCirculo.map((item) => {
                  return (
                    <SelectItem
                      key={item.value}
                      value={item.value}
                      text={item.label}
                    />
                  )
                })}
            </SelectGroupInput>
          )}
        />
        <FormField
          control={control}
          name="tioSecreto.id"
          render={({ field }) => (
            <SelectGroupInput
              label="Tio Secreto"
              onChange={field.onChange}
              value={field.value}
              className="w-full"
            >
              <SelectItem key="unknown" value="unknown" text="Não sabemos" />
              {tiosCirculo &&
                tiosCirculo.map((item) => {
                  return (
                    <SelectItem
                      key={item.value}
                      value={item.value}
                      text={item.label}
                    />
                  )
                })}
            </SelectGroupInput>
          )}
        />
      </div>
    </CardForm>
  )
}
