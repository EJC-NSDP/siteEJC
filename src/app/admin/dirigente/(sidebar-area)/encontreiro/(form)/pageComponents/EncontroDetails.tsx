'use client'

import { CardForm } from '@/app/admin/(loggedUser)/ficha-de-cadastro/components/CardForm'
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
import { useQuery } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { useEffect } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'

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
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
        <FormField
          control={control}
          name="encontro.idEncontro"
          render={({ field }) => {
            return (
              <SelectGroupInput
                label="EJC que fez *"
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
                label="Cor do círculo de origem"
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
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Equipes:</span>
            <Button
              className="size-8"
              type="button"
              onClick={() => addEquipe()}
            >
              +
            </Button>
          </div>
          {fields.map((field, index) => {
            const equipeSelecionada = watch(
              `encontro.equipes.${index}.idEquipe`,
            )

            return (
              <Card
                key={field.id}
                className="mt-4 flex w-full items-center justify-between gap-12 bg-zinc-100 px-6 py-4"
              >
                <div className="flex w-full items-start justify-between gap-8">
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
                          <div className="flex h-full flex-col items-center gap-4">
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
                  variant="ghost"
                  className="p-0"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="size-5 text-red-400 hover:text-red-500" />
                </Button>
              </Card>
            )
          })}
        </div>
      </div>
    </CardForm>
  )
}
