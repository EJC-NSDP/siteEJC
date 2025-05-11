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
  fichaPreenchida: z.string().optional(),
})

type encontreiroFiltersFormInput = z.infer<typeof encontreiroFiltersSchema>

export function EncontreiroSecreTableFilters() {
  const { data: equipes } = useQuery<SelectArray[]>({
    queryFn: async () => await getEquipes(),
    queryKey: ['equipes'],
  })
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const searchedEncontreiroName = searchParams.get('encontreiroName')
  const searchedEncontreiroEquipe = searchParams.get('encontreiroEquipe')
  const searchedFichaPreenchida = searchParams.get('fichaPreenchida')

  const form = useForm<encontreiroFiltersFormInput>({
    resolver: zodResolver(encontreiroFiltersSchema),
    defaultValues: {
      encontreiroName: searchedEncontreiroName ?? '',
      encontreiroEquipe: searchedEncontreiroEquipe ?? 'all',
      fichaPreenchida: searchedFichaPreenchida ?? 'all',
    },
  })

  const { handleSubmit, control, reset } = form

  async function handleFilter({
    encontreiroName,
    encontreiroEquipe,
    fichaPreenchida,
  }: encontreiroFiltersFormInput) {
    const newSearch = new URLSearchParams()

    if (encontreiroName) {
      newSearch.append('encontreiroName', encontreiroName)
    } else {
      newSearch.delete('encontreiroName')
    }

    if (encontreiroEquipe && encontreiroEquipe !== 'all') {
      newSearch.append('encontreiroEquipe', encontreiroEquipe)
    } else {
      newSearch.delete('encontreiroEquipe')
    }

    if (fichaPreenchida && fichaPreenchida !== 'all') {
      newSearch.append('fichaPreenchida', fichaPreenchida)
    } else {
      newSearch.delete('fichaPreenchida')
    }

    newSearch.append('page', '1')

    router.push(`${pathname}?${newSearch.toString()}`)
  }

  function handleClearFilters() {
    const newSearch = new URLSearchParams()
    newSearch.delete('encontreiroName')
    newSearch.delete('encontreiroEquipe')
    newSearch.delete('fichaPreenchida')
    newSearch.append('page', '1')
    reset()
    router.push(`${pathname}`)
  }

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
            name="encontreiroEquipe"
            defaultValue="all"
            render={({ field }) => {
              return (
                <div className="lg:w-96">
                  <SelectGroupInput
                    onChange={field.onChange}
                    value={field.value}
                  >
                    <SelectItem value="all" text="Todas equipes" />
                    {equipes &&
                      equipes.map((equipe) => {
                        if (
                          equipe.value !== '0' &&
                          equipe.value !== 'nao_participara'
                        )
                          return (
                            <SelectItem
                              key={equipe.value}
                              value={equipe.value}
                              text={equipe.label}
                            />
                          )
                        return null
                      })}
                  </SelectGroupInput>
                </div>
              )
            }}
          />
          <FormField
            control={control}
            name="fichaPreenchida"
            defaultValue="all"
            render={({ field }) => {
              return (
                <div className="lg:w-96">
                  <SelectGroupInput
                    onChange={field.onChange}
                    value={field.value}
                  >
                    <SelectItem value="all" text="Ficha de Cadastro" />
                    <SelectItem value="sim" text="Sim" />
                    <SelectItem value="nao" text="Não" />
                  </SelectGroupInput>
                </div>
              )
            }}
          />
          <div className="flex flex-col justify-between gap-2 lg:w-96 lg:flex-row lg:items-center">
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
