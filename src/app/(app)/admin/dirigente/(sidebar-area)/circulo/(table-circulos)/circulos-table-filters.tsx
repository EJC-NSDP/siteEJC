import { Search, SearchX } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { SelectGroupInput } from '@/components/Form/SelectInput/SelectGroupInput'
import {
  SelectItem,
  type SelectArray,
} from '@/components/Form/SelectInput/SelectItem'
import { Button } from '@/components/ui/button'
import { Form, FormField } from '@/components/ui/form'
import { getCoresEncontro, getEncontrosNumber } from '@/utils/fetch-encontros'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'

const circuloFiltersSchema = z.object({
  encontroNumber: z.string().optional(),
  colorLable: z.string().optional(),
})

type circuloFiltersFormInput = z.infer<typeof circuloFiltersSchema>

export function CirculosTableFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const { data: encontros } = useQuery<SelectArray[]>({
    queryFn: async () => await getEncontrosNumber(),
    queryKey: ['encontros'],
  })

  const { data: cores } = useQuery<SelectArray[]>({
    queryFn: async () => await getCoresEncontro(),
    queryKey: ['cores'],
  })

  const searchedEncontroNumber = searchParams.get('encontroNumber')
  const searchedColorLable = searchParams.get('colorLable')

  const form = useForm<circuloFiltersFormInput>({
    resolver: zodResolver(circuloFiltersSchema),
    defaultValues: {
      encontroNumber: searchedEncontroNumber ?? 'all',
      colorLable: searchedColorLable ?? 'all',
    },
  })

  const { handleSubmit, control, reset } = form

  async function handleFilter({
    encontroNumber,
    colorLable,
  }: circuloFiltersFormInput) {
    const newSearch = new URLSearchParams()

    if (encontroNumber && encontroNumber !== 'all') {
      newSearch.append('encontroNumber', encontroNumber)
    } else {
      newSearch.delete('encontroNumber')
    }

    if (colorLable && colorLable !== 'all') {
      newSearch.append('colorLable', colorLable)
    } else {
      newSearch.delete('colorLable')
    }

    newSearch.append('page', '1')

    router.push(`${pathname}?${newSearch.toString()}`)
  }

  function handleClearFilters() {
    const newSearch = new URLSearchParams()
    newSearch.delete('encontroNumber')
    newSearch.delete('colorLable')
    newSearch.append('page', '1')
    reset()
    router.push(`${pathname}`)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(handleFilter)}
        className="flex w-full flex-col items-center gap-2 lg:flex-row"
      >
        <FormField
          control={control}
          name="encontroNumber"
          defaultValue="all"
          render={({ field }) => {
            return (
              <div className="lg:w-full">
                <SelectGroupInput onChange={field.onChange} value={field.value}>
                  <SelectItem key="all" value="all" text="Todos os encontros" />
                  {encontros &&
                    encontros.map((encontro) => {
                      return (
                        <SelectItem
                          key={encontro.value}
                          value={encontro.value}
                          text={encontro.label}
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
          name="colorLable"
          defaultValue="all"
          render={({ field }) => {
            return (
              <div className="lg:w-full">
                <SelectGroupInput onChange={field.onChange} value={field.value}>
                  <SelectItem key="all" value="all" text="Todas as cores" />

                  {cores &&
                    cores.map((cor) => {
                      return (
                        <SelectItem
                          key={cor.value}
                          value={cor.value}
                          text={cor.label}
                        />
                      )
                    })}
                </SelectGroupInput>
              </div>
            )
          }}
        />
        <div className="flex w-full justify-end gap-2 py-2">
          <Button type="submit" variant="secondary" className="w-full">
            <Search className="mr-2 size-4" />
            Buscar
          </Button>
          <Button
            onClick={handleClearFilters}
            type="button"
            variant="destructive"
            className="w-full"
          >
            <SearchX className="mr-2 h-4 w-4" />
            Limpar busca
          </Button>
        </div>
      </form>
    </Form>
  )
}
