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
import { getCorEncontro } from '@/utils/fetch-domains'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'

const encontristaFiltersSchema = z.object({
  encontreiroName: z.string().optional(),
  corCirculo: z.string().optional(),
})

type encontristaFiltersFormInput = z.infer<typeof encontristaFiltersSchema>

export function EncontristasSecreTableFilters() {
  const { data: cores } = useQuery<SelectArray[]>({
    queryFn: async () => await getCorEncontro(),
    queryKey: ['cores'],
  })
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const searchedEncontreiroName = searchParams.get('encontreiroName')
  const searchedCorCirculo = searchParams.get('corCirculo')

  const form = useForm<encontristaFiltersFormInput>({
    resolver: zodResolver(encontristaFiltersSchema),
    defaultValues: {
      encontreiroName: searchedEncontreiroName ?? '',
      corCirculo: searchedCorCirculo ?? 'all',
    },
  })

  const { handleSubmit, control, reset } = form

  async function handleFilter({
    encontreiroName,
    corCirculo,
  }: encontristaFiltersFormInput) {
    const newSearch = new URLSearchParams()

    if (encontreiroName) {
      newSearch.append('encontreiroName', encontreiroName)
    } else {
      newSearch.delete('encontreiroName')
    }

    if (corCirculo && corCirculo !== 'all') {
      newSearch.append('corCirculo', corCirculo)
    } else {
      newSearch.delete('corCirculo')
    }

    newSearch.append('page', '1')

    router.push(`${pathname}?${newSearch.toString()}`)
  }

  function handleClearFilters() {
    const newSearch = new URLSearchParams()
    newSearch.delete('encontreiroName')
    newSearch.delete('corCirculo')
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
                placeholder="Nome do encontrista..."
                {...field}
              />
            )}
          />
          <FormField
            control={control}
            name="corCirculo"
            defaultValue="all"
            render={({ field }) => {
              return (
                <div className="lg:w-96">
                  <SelectGroupInput
                    onChange={field.onChange}
                    value={field.value}
                  >
                    <SelectItem value="all" text="Todos círculos" />
                    {cores &&
                      cores.map((cor) => {
                        return (
                          <SelectItem
                            key={cor.value}
                            value={cor.label}
                            text={cor.label}
                          />
                        )
                      })}
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
