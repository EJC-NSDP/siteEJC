import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Search, SearchX } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { SelectGroupInput } from '@/components/Form/SelectInput/SelectGroupInput'
import {
  SelectItem,
  type SelectArray,
} from '@/components/Form/SelectInput/SelectItem'
import { Button } from '@/components/ui/button'
import { Form, FormField } from '@/components/ui/form'
import { SearchInput } from '@/components/ui/search-input'
import { getCorEncontro } from '@/utils/fetch-domains'

const filtersSchema = z.object({
  encontreiroName: z.string().optional(),
  corCirculo: z.string().optional(),
})

type FiltersInput = z.infer<typeof filtersSchema>

export function EncontristasRecepcaoTableFilters() {
  const { data: cores } = useQuery<SelectArray[]>({
    queryFn: async () => await getCorEncontro(),
    queryKey: ['cores'],
  })
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const form = useForm<FiltersInput>({
    resolver: zodResolver(filtersSchema),
    defaultValues: {
      encontreiroName: searchParams.get('encontreiroName') ?? '',
      corCirculo: searchParams.get('corCirculo') ?? 'all',
    },
  })

  const { handleSubmit, control, reset } = form

  function handleFilter({ encontreiroName, corCirculo }: FiltersInput) {
    const p = new URLSearchParams()
    if (encontreiroName) p.append('encontreiroName', encontreiroName)
    if (corCirculo && corCirculo !== 'all') p.append('corCirculo', corCirculo)
    p.append('page', '1')
    router.push(`${pathname}?${p.toString()}`)
  }

  function handleClearFilters() {
    reset({ encontreiroName: '', corCirculo: 'all' })
    router.push(pathname)
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
            render={({ field }) => (
              <div className="lg:w-64">
                <SelectGroupInput onChange={field.onChange} value={field.value}>
                  <SelectItem value="all" text="Todos círculos" />
                  {cores?.map((cor) => (
                    <SelectItem
                      key={cor.value}
                      value={cor.label}
                      text={cor.label}
                    />
                  ))}
                </SelectGroupInput>
              </div>
            )}
          />
          <div className="flex gap-2">
            <Button type="submit" variant="secondary">
              <Search className="mr-2 h-4 w-4" />
              Buscar
            </Button>
            <Button onClick={handleClearFilters} type="button" variant="destructive">
              <SearchX className="mr-2 h-4 w-4" />
              Limpar
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
