import { useQuery } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'

import { EncontreiroSecreTableFilters } from './encontreiros-secre-table-filters'
import { EncontreiroSecreTableRow } from './encontreiros-secre-table-row'
import { EncontreiroSecreTableSkeleton } from './encontreiros-secre-table-skeleton'

import type { EncontreiroSecreSummary } from '@/app/api/secretaria/encontreiro/get-encontreiros-secre'
import { EmptyTableRow } from '@/components/Table/EmptyTableRow'
import { Pagination } from '@/components/Table/Pagination'
import { PaginationSkeleton } from '@/components/Table/PaginationSkeleton'
import { SortableTableHead } from '@/components/Table/SortableTableHead'
import {
  Table,
  TableBody,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { api } from '@/lib/axios'

interface SearchProps {
  pageIndex: number
  encontreiroName: string | null
  encontreiroEquipe: string | null
  fichaPreenchida: string | null
  orderByField: string | null
  orderByDirection: string | null
}

async function getEncontreiros({
  pageIndex,
  encontreiroName,
  encontreiroEquipe,
  fichaPreenchida,
  orderByField,
  orderByDirection,
}: SearchProps) {
  const nameSearch = encontreiroName ? `name=${encontreiroName}&` : ''
  const equipeSearch = encontreiroEquipe ? `equipe=${encontreiroEquipe}&` : ''
  const fichaSearch = fichaPreenchida
    ? `fichaPreenchida=${fichaPreenchida}&`
    : ''
  const orderField = orderByField ? `orderByField=${orderByField}&` : ''
  const orderDirection = orderByDirection
    ? `orderDirection=${orderByDirection}&`
    : ''

  const path = `secretaria/encontreiro?${nameSearch}${equipeSearch}${fichaSearch}${orderField}${orderDirection}page=${pageIndex}`

  const response: EncontreiroSecreSummary = await api
    .get(path)
    .then((response) => response.data)
    .catch((err) => console.error(err))

  return response
}

export function EncontreirosSecreTable() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const encontreiroName = searchParams.get('encontreiroName')
  const encontreiroEquipe = searchParams.get('encontreiroEquipe')
  const fichaPreenchida = searchParams.get('fichaPreenchida')
  const orderByField = searchParams.get('orderByField')
  const orderByDirection = searchParams.get('orderDirection')

  const pageIndex = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get('page') ?? '1')

  const { data: result, isLoading: isLoadingEncontreiro } =
    useQuery<EncontreiroSecreSummary>({
      queryKey: [
        'encontreiros',
        {
          pageIndex,
          encontreiroName,
          encontreiroEquipe,
          fichaPreenchida,
          orderByField,
          orderByDirection,
        },
      ],
      queryFn: () =>
        getEncontreiros({
          pageIndex,
          encontreiroName,
          encontreiroEquipe,
          fichaPreenchida,
          orderByField,
          orderByDirection,
        }),
    })

  function handlePaginate(pageIndex: number) {
    const newSearch = new URLSearchParams()
    if (encontreiroName)
      newSearch.append('encontreiroName', encontreiroName.toString())

    if (encontreiroEquipe)
      newSearch.append('encontreiroEquipe', encontreiroEquipe.toString())

    if (fichaPreenchida)
      newSearch.append('fichaPreenchida', fichaPreenchida.toString())

    if (orderByField) newSearch.append('orderByField', orderByField.toString())

    if (orderByDirection)
      newSearch.append('orderDirection', orderByDirection.toString())

    newSearch.append('page', (pageIndex + 1).toString())
    router.push(`${pathname}?${newSearch}`)
  }

  function handleOrder(orderField: string) {
    const newSearch = new URLSearchParams()
    if (encontreiroName)
      newSearch.append('encontreiroName', encontreiroName.toString())

    if (encontreiroEquipe)
      newSearch.append('encontreiroEquipe', encontreiroEquipe.toString())

    if (fichaPreenchida)
      newSearch.append('fichaPreenchida', fichaPreenchida.toString())

    newSearch.append('orderByField', orderField)

    const direction =
      orderByField === orderField && orderByDirection === 'asc' ? 'desc' : 'asc'
    newSearch.append('orderDirection', direction)

    newSearch.append('page', (pageIndex + 1).toString())
    router.push(`${pathname}?${newSearch}`)
  }

  return (
    <>
      <div className="flex flex-col gap-4 py-1">
        <EncontreiroSecreTableFilters />
        <div className="w-full overflow-x-auto bg-transparent">
          <Table className="w-full text-xs lg:table-fixed">
            <TableHeader>
              <TableRow className="px-2">
                <SortableTableHead
                  label="EJC"
                  value="numeroEncontro"
                  classname="text-nowrap rounded-tl-xl w-[60px] pl-4"
                  orderByField={orderByField}
                  orderByDirection={orderByDirection}
                  handleFn={handleOrder}
                />
                <SortableTableHead
                  label="Nome"
                  value="nome"
                  classname="w-auto"
                  orderByField={orderByField}
                  orderByDirection={orderByDirection}
                  handleFn={handleOrder}
                />
                <SortableTableHead
                  label="Equipe"
                  value="equipeLabel"
                  classname="w-[150px]"
                  orderByField={orderByField}
                  orderByDirection={orderByDirection}
                  handleFn={handleOrder}
                />
                <TableHead className="w-[120px]">Celular</TableHead>
                <TableHead className="w-[120px]">Bairro</TableHead>
                <TableHead className="w-[120px]">Instagram</TableHead>
                <SortableTableHead
                  label="Ficha preenchida"
                  value="fichaPreenchida"
                  classname="text-nowrap w-[150px] "
                  orderByField={orderByField}
                  orderByDirection={orderByDirection}
                  handleFn={handleOrder}
                />
                <TableHead className="w-[60px] rounded-tr-xl pr-4">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-transparent">
              {isLoadingEncontreiro && <EncontreiroSecreTableSkeleton />}
              {result &&
                result.encontreiros.length !== 0 &&
                result.encontreiros.map((encontreiro) => {
                  return (
                    <EncontreiroSecreTableRow
                      key={encontreiro.slug}
                      encontreiro={encontreiro}
                    />
                  )
                })}
              {result && result.encontreiros.length === 0 && (
                <EmptyTableRow
                  colspan={8}
                  content="Sem encontreiros cadastrados"
                />
              )}
            </TableBody>
            <TableFooter>
              {isLoadingEncontreiro && <PaginationSkeleton totalCol={8} />}
              {result && (
                <Pagination
                  pageIndex={result.pageIndex}
                  totalCount={result.totalCount}
                  perPage={result.perPage}
                  onPageChange={handlePaginate}
                  totalCol={8}
                />
              )}
            </TableFooter>
          </Table>
        </div>
      </div>
    </>
  )
}
