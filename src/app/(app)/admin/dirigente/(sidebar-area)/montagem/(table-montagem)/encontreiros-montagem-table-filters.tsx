import { Search, SearchX } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { SelectGroupInput } from '@/components/Form/SelectInput/SelectGroupInput'
import {
  SelectItem,
  type SelectArray,
} from '@/components/Form/SelectInput/SelectItem'
import { Button } from '@/components/ui/button'
import { Form, FormField } from '@/components/ui/form'
import { SearchInput } from '@/components/ui/search-input'
import { getEquipes } from '@/utils/fetch-domains'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'

const encontreiroFiltersSchema = z.object({
  encontreiroName: z.string().optional(),
  encontreiroEquipe: z.string().optional(),
  preferenciaEquipe: z.string().optional(),
})

type encontreiroFiltersFormInput = z.infer<typeof encontreiroFiltersSchema>

export function EncontreiroMontagemTableFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const searchedEncontreiroName = searchParams.get('nome')
  const searchedEncontreiroEquipe = searchParams.get('equipe')
  const searchedPreferenciaEquipe = searchParams.get('preferencia')

  const form = useForm<encontreiroFiltersFormInput>({
    resolver: zodResolver(encontreiroFiltersSchema),
    defaultValues: {
      encontreiroName: searchedEncontreiroName ?? '',
      encontreiroEquipe: searchedEncontreiroEquipe ?? 'all_equipes',
      preferenciaEquipe: searchedPreferenciaEquipe ?? 'all_equipes',
    },
  })

  const { handleSubmit, control, reset } = form

  async function handleFilter({
    encontreiroName,
    encontreiroEquipe,
    preferenciaEquipe,
  }: encontreiroFiltersFormInput) {
    const newSearch = new URLSearchParams()

    if (encontreiroName) {
      newSearch.append('nome', encontreiroName)
    } else {
      newSearch.delete('encontreiroName')
    }

    if (encontreiroEquipe && encontreiroEquipe !== 'all_equipes') {
      newSearch.append('equipe', encontreiroEquipe)
    } else {
      newSearch.delete('equipe')
    }

    if (preferenciaEquipe && preferenciaEquipe !== 'all_equipes') {
      newSearch.append('preferencia', preferenciaEquipe)
    } else {
      newSearch.delete('preferencia')
    }

    newSearch.append('page', '1')

    router.push(`${pathname}?${newSearch.toString()}`)
  }

  function handleClearFilters() {
    const newSearch = new URLSearchParams()
    newSearch.delete('nome')
    newSearch.delete('equipe')
    newSearch.delete('preferencia')
    newSearch.append('page', '1')
    reset()
    router.push(`${pathname}`)
  }

  const { data: equipes } = useQuery<SelectArray[]>({
    queryKey: ['equipesSelect'],
    queryFn: () => getEquipes(),
  })

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(handleFilter)}
        className="flex items-center gap-2"
      >
        <div className="flex w-full flex-col gap-2 lg:flex-row lg:items-center">
          <FormField
            control={control}
            name="encontreiroName"
            render={({ field }) => (
              <SearchInput
                className="h-5 w-fit"
                placeholder="Nome do encontreiro..."
                {...field}
              />
            )}
          />
          <FormField
            control={control}
            name="preferenciaEquipe"
            defaultValue="all_equipes"
            render={({ field }) => {
              return (
                <div className="lg:w-100">
                  <SelectGroupInput
                    onChange={field.onChange}
                    value={field.value}
                  >
                    <SelectItem
                      key="all_equipes"
                      value="all_equipes"
                      text="Preferências"
                    />
                    <SelectItem
                      key="qualquer_equipe"
                      value="0"
                      text="Qualquer Equipe"
                    />
                    {equipes &&
                      equipes
                        .filter((equipe) => equipe.value !== '0')
                        .map((equipe) => {
                          return (
                            <SelectItem
                              key={equipe.value}
                              value={equipe.value}
                              text={equipe.label}
                            />
                          )
                        })}
                  </SelectGroupInput>
                </div>
              )
            }}
          />
          <FormField
            control={control}
            name="encontreiroEquipe"
            defaultValue="all_equipes"
            render={({ field }) => {
              return (
                <div className="lg:w-96">
                  <SelectGroupInput
                    onChange={field.onChange}
                    value={field.value}
                  >
                    <SelectItem
                      key="all_equipes"
                      value="all_equipes"
                      text="Todas equipes"
                    />
                    <SelectItem
                      key="sem_equipe"
                      value="sem_equipe"
                      text="Sem equipe"
                    />
                    {equipes &&
                      equipes
                        .filter((equipe) => equipe.value !== '0')
                        .map((equipe) => {
                          return (
                            <SelectItem
                              key={equipe.value}
                              value={equipe.value}
                              text={equipe.label}
                            />
                          )
                        })}
                  </SelectGroupInput>
                </div>
              )
            }}
          />

          <div className="flex justify-between gap-2 py-2 lg:w-96">
            <Button type="submit" variant="secondary">
              <Search className="mr-2 h-4 w-4" />
              Buscar
            </Button>
            <Button
              onClick={handleClearFilters}
              type="button"
              variant="destructive"
            >
              <SearchX className="mr-2 h-4 w-4" />
              Limpar busca
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
