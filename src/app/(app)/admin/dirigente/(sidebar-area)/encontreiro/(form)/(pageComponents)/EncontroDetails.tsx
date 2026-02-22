'use client'

import { useQuery } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { useEffect } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'

import { CardForm } from '@/components/Form/CardForm'
import { SelectGroupInput } from '@/components/Form/SelectInput/SelectGroupInput'
import {
  SelectItem,
  type SelectArray,
} from '@/components/Form/SelectInput/SelectItem'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { FormField, FormLabel } from '@/components/ui/form'
import { getValidEquipes } from '@/utils/fetch-domains'
import { getCirculosEncontro, getEncontros } from '@/utils/fetch-encontros'

const COORDENA_TRUE = [
  'apresentacao',
  'compras',
  'dirigente',
  'externa',
  'meditacao',
  'recepcao',
  'vigilia',
]

const COORDENA_FALSE = [
  'boa_vontade',
  'tio_aparente',
  'tio_circulo',
  'tio_secreto',
]

export function EncontroDetails() {
  const form = useFormContext()

  const { data: encontros } = useQuery<SelectArray[]>({
    queryFn: async () => await getEncontros(),
    queryKey: ['encontros'],
  })

  const { data: equipes } = useQuery<SelectArray[]>({
    queryFn: async () => await getValidEquipes(),
    queryKey: ['equipes'],
  })

  const { control, watch } = form

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'encontro.equipes',
  })

  useEffect(() => {
    fields.forEach((_, index) => {
      const idEquipe = watch(`encontro.equipes.${index}.idEquipe`)

      if (COORDENA_TRUE.includes(idEquipe)) {
        form.setValue(`encontro.equipes.${index}.coordenou`, true)
      } else if (COORDENA_FALSE.includes(idEquipe)) {
        form.setValue(`encontro.equipes.${index}.coordenou`, false)
      }
    })
  }, [fields, watch, form])

  const idEncontroValue = watch('encontro.idEncontro')

  const { data: circulos } = useQuery<SelectArray[]>({
    queryKey: ['circulos', idEncontroValue],
    queryFn: async () => await getCirculosEncontro(idEncontroValue),
    enabled: !!idEncontroValue,
  })

  function addEquipe() {
    append({
      coordenou: false,
      idEquipe: '',
      idEncontro: '',
    })
  }

  return (
    <CardForm title="No EJC" sectionId="ejc-section">
      <div className="mt-4 flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-8">
        <FormField
          control={control}
          name="encontro.idEncontro"
          render={({ field }) => {
            return (
              <SelectGroupInput
                label="Encontro em que entrou *"
                onChange={field.onChange}
                value={field.value}
              >
                {encontros &&
                  encontros.map((item) => {
                    return (
                      <SelectItem
                        key={item.value}
                        value={item.value}
                        text={item.label}
                      />
                    )
                  })}
              </SelectGroupInput>
            )
          }}
        />

        <FormField
          control={control}
          name="encontro.idCirculo"
          render={({ field }) => {
            return (
              <SelectGroupInput
                label="Círculo de origem"
                onChange={field.onChange}
                value={field.value}
              >
                <SelectItem key={0} value={'nao_sei'} text={'Não sei'} />
                {circulos &&
                  circulos.map((item) => {
                    return (
                      <SelectItem
                        key={item.value}
                        value={item.value}
                        text={item.label}
                      />
                    )
                  })}
              </SelectGroupInput>
            )
          }}
        />
        <div className="col-span-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium">Equipes:</span>
            <Button size="xs" type="button" onClick={() => addEquipe()}>
              + Adicionar equipe
            </Button>
          </div>
          {fields.map((field, index) => {
            const equipeSelecionada = watch(
              `encontro.equipes.${index}.idEquipe`,
            )

            return (
              <Card
                key={field.id}
                className="mt-4 flex w-full flex-col items-center justify-between gap-8 bg-zinc-100 px-4 py-4 lg:flex-row lg:gap-12 lg:px-6"
              >
                <div className="flex w-full flex-col items-start justify-between gap-4 lg:flex-row lg:gap-8">
                  <FormField
                    control={control}
                    name={`encontro.equipes.${index}.idEncontro`}
                    render={({ field }) => (
                      <SelectGroupInput
                        label="EJC"
                        onChange={field.onChange}
                        value={field.value}
                        className="w-full"
                      >
                        {encontros &&
                          encontros.map((item) => {
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
                    name={`encontro.equipes.${index}.idEquipe`}
                    render={({ field }) => (
                      <SelectGroupInput
                        label="Equipe"
                        onChange={field.onChange}
                        value={field.value}
                        className="w-full"
                      >
                        {equipes?.map((item) => (
                          <SelectItem
                            key={item.value}
                            value={item.value}
                            text={item.label}
                          />
                        ))}
                      </SelectGroupInput>
                    )}
                  />
                  {!COORDENA_TRUE.includes(equipeSelecionada) &&
                    !COORDENA_FALSE.includes(equipeSelecionada) && (
                      <FormField
                        control={control}
                        name={`encontro.equipes.${index}.coordenou`}
                        render={({ field }) => (
                          <div className="flex h-full w-full flex-row items-center justify-between lg:w-auto lg:flex-col lg:gap-4">
                            <FormLabel>Coordenou?</FormLabel>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </div>
                        )}
                      />
                    )}
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  className="w-full lg:w-auto"
                  onClick={() => remove(index)}
                >
                  <div className="flex items-center gap-2">
                    <Trash2 className="size-4 text-red-500" />{' '}
                    <span className="text-red-500 lg:sr-only">Deletar</span>
                  </div>
                </Button>
              </Card>
            )
          })}
        </div>
      </div>
    </CardForm>
  )
}
