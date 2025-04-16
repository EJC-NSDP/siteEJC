import { Search, SearchX } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { SelectGroupInput } from '@/components/Form/SelectInput/SelectGroupInput'
import { SelectItem } from '@/components/Form/SelectInput/SelectItem'
import { Button } from '@/components/ui/button'
import { Form, FormField } from '@/components/ui/form'
import { SearchInput } from '@/components/ui/search-input'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'

const encontreiroFiltersSchema = z.object({
  encontreiroName: z.string().optional(),
  encontreiroStatus: z.string().optional(),
})

type encontreiroFiltersFormInput = z.infer<typeof encontreiroFiltersSchema>

export function EncontreiroTableFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const searchedEncontreiroName = searchParams.get('encontreiroName')
  const searchedEncontreiroStatus = searchParams.get('encontreiroStatus')

  const form = useForm<encontreiroFiltersFormInput>({
    resolver: zodResolver(encontreiroFiltersSchema),
    defaultValues: {
      encontreiroName: searchedEncontreiroName ?? '',
      encontreiroStatus: searchedEncontreiroStatus ?? 'all',
    },
  })

  const { handleSubmit, control, reset } = form

  async function handleFilter({
    encontreiroName,
    encontreiroStatus,
  }: encontreiroFiltersFormInput) {
    const newSearch = new URLSearchParams()

    if (encontreiroName) {
      newSearch.append('encontreiroName', encontreiroName)
    } else {
      newSearch.delete('encontreiroName')
    }

    if (encontreiroStatus && encontreiroStatus !== 'all') {
      newSearch.append('encontreiroStatus', encontreiroStatus)
    } else {
      newSearch.delete('encontreiroStatus')
    }

    newSearch.append('page', '1')

    router.push(`${pathname}?${newSearch.toString()}`)
  }

  function handleClearFilters() {
    const newSearch = new URLSearchParams()
    newSearch.delete('encontreiroName')
    newSearch.delete('encontreiroStatus')
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
            name="encontreiroStatus"
            defaultValue="all"
            render={({ field }) => {
              return (
                <div className="lg:w-96">
                  <SelectGroupInput
                    onChange={field.onChange}
                    value={field.value}
                  >
                    <SelectItem value="all" text="Todos status" />
                    <SelectItem value="ativo" text="Ativo" />
                    <SelectItem value="inativo" text="Inativo" />
                    <SelectItem
                      value="convidado_especial"
                      text="Convidado Especial"
                    />
                  </SelectGroupInput>
                </div>
              )
            }}
          />
          <div className="flex justify-between gap-2 py-2 lg:w-96 ">
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
