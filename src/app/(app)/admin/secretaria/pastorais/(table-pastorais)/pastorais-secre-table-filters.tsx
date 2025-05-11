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
import { getAllPastorais } from '@/utils/fetch-domains'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'

const pastoraisFiltersSchema = z.object({
  encontreiroName: z.string().optional(),
  pastorais: z.string().optional(),
})

type pastoraisFiltersFormInput = z.infer<typeof pastoraisFiltersSchema>

export function PastoraisSecreTableFilters() {
  const { data: pastorais } = useQuery<SelectArray[]>({
    queryFn: () => getAllPastorais(),
    queryKey: ['pastorais'],
  })
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const searchedEncontreiroName = searchParams.get('encontreiroName')
  const searchedPastorais = searchParams.get('pastorais')

  const form = useForm<pastoraisFiltersFormInput>({
    resolver: zodResolver(pastoraisFiltersSchema),
    defaultValues: {
      encontreiroName: searchedEncontreiroName ?? '',
      pastorais: searchedPastorais ?? 'all',
    },
  })

  const { handleSubmit, control, reset } = form

  async function handleFilter({
    encontreiroName,
    pastorais,
  }: pastoraisFiltersFormInput) {
    const newSearch = new URLSearchParams()

    if (encontreiroName) {
      newSearch.append('encontreiroName', encontreiroName)
    } else {
      newSearch.delete('encontreiroName')
    }

    if (pastorais && pastorais !== 'all') {
      newSearch.append('pastorais', pastorais)
    } else {
      newSearch.delete('pastorais')
    }

    router.push(`${pathname}?${newSearch.toString()}`)
  }

  function handleClearFilters() {
    const newSearch = new URLSearchParams()
    newSearch.delete('encontreiroName')
    newSearch.delete('pastorais')
    reset()
    router.push(`${pathname}`)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(handleFilter)}
        className="flex flex-col gap-2 lg:flex-row lg:items-center"
      >
        <div className="flex w-full flex-col gap-2 lg:flex-row lg:items-center">
          <FormField
            control={control}
            name="encontreiroName"
            render={({ field }) => (
              <SearchInput
                className="w-fit"
                placeholder="Nome do encontreiro..."
                {...field}
              />
            )}
          />
          <FormField
            control={control}
            name="pastorais"
            defaultValue="all"
            render={({ field }) => {
              return (
                <SelectGroupInput
                  onChange={field.onChange}
                  value={field.value}
                  className="lg:w-96"
                >
                  <SelectItem value="all" text="Todas pastorais" />
                  {pastorais &&
                    pastorais.map((pastoral) => {
                      return (
                        <SelectItem
                          key={pastoral.value}
                          value={pastoral.value}
                          text={pastoral.label}
                        />
                      )
                    })}
                </SelectGroupInput>
              )
            }}
          />
        </div>
        <div className="flex flex-col justify-between gap-2 lg:flex-row lg:items-center lg:py-2">
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
      </form>
    </Form>
  )
}
