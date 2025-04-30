'use client'

import type { EquipeSecre } from '@/app/api/secretaria/equipe/get-equipes-secre'
import { TextInput } from '@/components/Form/TextInput'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

interface EditEquipesProps {
  equipes: EquipeSecre[]
}

const equipeSecreFormScheme = z.object({
  equipes: z.array(
    z.object({
      equipeValue: z.string(),
      equipeLabel: z.string(),
      description: z.string(),
    }),
  ),
})

export type EquipeSecreFormDataInput = z.infer<typeof equipeSecreFormScheme>

export function EquipesForm({ equipes }: EditEquipesProps) {
  const [isUpdating, setUpdating] = useState(false)
  // const router = useRouter()

  const form = useForm<EquipeSecreFormDataInput>({
    resolver: zodResolver(equipeSecreFormScheme),
    defaultValues: {
      equipes,
    },
  })

  const {
    handleSubmit,
    control,
    // formState: { errors },
  } = form

  async function handleUpdateEquipes(formDataInput: {
    equipes: EquipeSecre[]
  }) {
    setUpdating(true)
    console.log(formDataInput)
    // if (formDataInput.slug === '') {
    //   await api
    //     .post('encontreiro', formDataInput)
    //     .then(async () => {
    //       router.push('/admin/dirigente')
    //     })
    //     .catch((err) => console.log(err, errors))
    // } else {
    //   await api
    //     .put(`encontreiro/update/${formDataInput.slug}`, formDataInput)
    //     .then(async () => {
    //       router.push('/admin/dirigente')
    //     })
    //     .catch((err) => console.log(err, errors))
    // }
  }

  return (
    <FormProvider {...form}>
      <form
        id="editEquipeSecreForm"
        onSubmit={handleSubmit(handleUpdateEquipes)}
      >
        <div className="flex flex-col gap-4">
          {equipes.map((equipe, index) => {
            return (
              <div
                className="flex w-full gap-10 rounded-xl border border-tertiary/20 p-4"
                key={index}
              >
                <FormField
                  control={control}
                  name={`equipes.${index}.equipeValue`}
                  render={() => <></>}
                />
                <div className="flex-1">
                  <FormField
                    control={control}
                    name={`equipes.${index}.description`}
                    render={({ field }) => {
                      return (
                        <TextInput label={equipe.equipeLabel}>
                          <Input {...field} />
                        </TextInput>
                      )
                    }}
                  />
                </div>
              </div>
            )
          })}
          <div className="flex items-center justify-between gap-3">
            <span className="text-2xl font-bold lg:text-nowrap">
              Salvar Mudanças
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
            <div className="px-0 py-5 text-lg lg:py-7">
              Lembre-se de salvar qualquer mudança realizada nessa página.
            </div>
            <div className="flex items-center justify-end gap-5 px-0 py-5 text-lg lg:flex-row lg:gap-7 lg:py-7">
              <Button type="submit" className="h-10 w-40" disabled={isUpdating}>
                Atualizar
              </Button>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
