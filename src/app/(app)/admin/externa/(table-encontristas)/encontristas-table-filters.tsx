import { Search, SearchX } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { getEquipeExterna } from '@/app/api/encontro/atual/[ignorar]/externa/get-equipe-externa'
import { SelectGroupInput } from '@/components/Form/SelectInput/SelectGroupInput'
import { SelectItem } from '@/components/Form/SelectInput/SelectItem'
import type { SelectItemAvatarProps } from '@/components/Table/SelectItemAvatar'
import { Button } from '@/components/ui/button'
import { Form, FormField } from '@/components/ui/form'
import { SearchInput } from '@/components/ui/search-input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'

const encontristaFiltersSchema = z.object({
  encontristaName: z.string().optional(),
  encontristaStatus: z.string().optional(),
  responsavelExterna: z.string().optional(),
})

type encontristaFiltersFormInput = z.infer<typeof encontristaFiltersSchema>

export function EncontristaTableFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const searchedEncontristaName = searchParams.get('encontristaName')
  const searchedEncontristaStatus = searchParams.get('encontristaStatus')
  const searchedResponsavelExterna = searchParams.get('responsavelExterna')

  const form = useForm<encontristaFiltersFormInput>({
    resolver: zodResolver(encontristaFiltersSchema),
    defaultValues: {
      encontristaName: searchedEncontristaName ?? '',
      encontristaStatus: searchedEncontristaStatus ?? 'all',
      responsavelExterna: searchedResponsavelExterna ?? 'all',
    },
  })

  const { handleSubmit, control, reset } = form

  const { data: equipeExterna } = useQuery<SelectItemAvatarProps[]>({
    queryFn: async () => await getEquipeExterna(),
    queryKey: ['equipeExterna'],
  })

  async function handleFilter({
    encontristaName,
    encontristaStatus,
    responsavelExterna,
  }: encontristaFiltersFormInput) {
    const newSearch = new URLSearchParams()

    if (encontristaName) {
      newSearch.append('encontristaName', encontristaName)
    } else {
      newSearch.delete('encontristaName')
    }

    if (encontristaStatus && encontristaStatus !== 'all') {
      newSearch.append('encontristaStatus', encontristaStatus)
    } else {
      newSearch.delete('encontristaStatus')
    }

    if (responsavelExterna && responsavelExterna !== 'all') {
      newSearch.append('responsavelExterna', responsavelExterna)
    } else {
      newSearch.delete('responsavelExterna')
    }

    newSearch.append('page', '1')

    router.push(`${pathname}?${newSearch.toString()}`)
  }

  function handleClearFilters() {
    const newSearch = new URLSearchParams()
    newSearch.delete('encontristaName')
    newSearch.delete('encontristaStatus')
    newSearch.delete('responsavelExterna')
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
            name="encontristaName"
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
            name="encontristaStatus"
            defaultValue="all"
            render={({ field }) => {
              return (
                <div className="lg:w-96">
                  <SelectGroupInput
                    onChange={field.onChange}
                    value={field.value}
                  >
                    <SelectItem value="all" text="Todos status" />
                    <SelectItem value="confirmado" text="Confirmados" />
                    <SelectItem value="desistiu" text="Desistiu" />
                    <SelectItem value="ligar" text="Ligar" />
                    <SelectItem value="lista_espera" text="Lista de Espera" />
                    <SelectItem value="nao_atende" text="Não atende" />
                    <SelectItem
                      value="prox_encontro"
                      text="Próximo Encontrão"
                    />
                    <SelectItem value="vai_pensar" text="Vai Pensar" />
                  </SelectGroupInput>
                </div>
              )
            }}
          />

          <FormField
            control={control}
            name="responsavelExterna"
            defaultValue="all"
            render={({ field }) => {
              return (
                <div className="lg:w-100">
                  <SelectGroupInput
                    onChange={field.onChange}
                    value={field.value}
                  >
                    <SelectItem
                      key="all"
                      value="all"
                      text="Todos Responsáveis"
                    />
                    {equipeExterna &&
                      equipeExterna.map((membroExterna) => {
                        return (
                          <SelectItem
                            key={membroExterna.id}
                            value={membroExterna.id}
                            text={membroExterna.name}
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
