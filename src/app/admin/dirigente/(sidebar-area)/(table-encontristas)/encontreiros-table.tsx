import {
  Table,
  TableBody,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import type { EncontreiroSummary } from '@/app/api/encontreiro/get-encontreiros-summary'
import { EmptyTableRow } from '@/components/Table/EmptyTableRow'
import { Pagination } from '@/components/Table/Pagination'
import { PaginationSkeleton } from '@/components/Table/PaginationSkeleton'
import { SortableTableHead } from '@/components/Table/SortableTableHead'
import { api } from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { EncontreiroTableFilters } from './encontreiros-table-filters'
import { EncontreiroTableRow } from './encontreiros-table-row'
import { EncontreiroTableSkeleton } from './encontreiros-table-skeleton'

interface SearchProps {
  pageIndex: number
  encontreiroName: string | null
  orderByField: string | null
  orderByDirection: string | null
}

async function getEncontreiros({
  pageIndex,
  encontreiroName,
  orderByField,
  orderByDirection,
}: SearchProps) {
  const nameSearch = encontreiroName ? `name=${encontreiroName}&` : ''
  const orderField = orderByField ? `orderByField=${orderByField}&` : ''
  const orderDirection = orderByDirection
    ? `orderDirection=${orderByDirection}&`
    : ''

  const path = `encontreiro?${nameSearch}${orderField}${orderDirection}page=${pageIndex}`

  const response: EncontreiroSummary = await api
    .get(path)
    .then((response) => response.data)
    .catch((err) => console.error(err))

  return response
}

export function EncontreirosTable() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const encontreiroName = searchParams.get('encontreiroName')
  const encontreiroStatus = searchParams.get('encontreiroStatus')
  const responsavelExterna = searchParams.get('responsavelExterna')
  const orderByField = searchParams.get('orderByField')
  const orderByDirection = searchParams.get('orderDirection')

  const pageIndex = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get('page') ?? '1')

  const { data: result, isLoading: isLoadingEncontreiro } =
    useQuery<EncontreiroSummary>({
      queryKey: [
        'encontreiros',
        {
          pageIndex,
          encontreiroName,
          encontreiroStatus,
          responsavelExterna,
          orderByField,
          orderByDirection,
        },
      ],
      queryFn: () =>
        getEncontreiros({
          pageIndex,
          encontreiroName,
          orderByField,
          orderByDirection,
        }),
    })

  function handlePaginate(pageIndex: number) {
    const newSearch = new URLSearchParams()
    if (encontreiroName)
      newSearch.append('encontreiroName', encontreiroName.toString())

    if (encontreiroStatus)
      newSearch.append('encontreiroStatus', encontreiroStatus.toString())

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

    if (encontreiroStatus)
      newSearch.append('encontreiroStatus', encontreiroStatus.toString())

    if (responsavelExterna)
      newSearch.append('responsavelExterna', responsavelExterna.toString())

    newSearch.append('orderByField', orderField)

    orderByField === orderField
      ? orderByDirection === 'asc'
        ? newSearch.append('orderDirection', 'desc')
        : newSearch.append('orderDirection', 'asc')
      : newSearch.append('orderDirection', 'asc')

    newSearch.append('page', (pageIndex + 1).toString())
    router.push(`${pathname}?${newSearch}`)
  }

  return (
    <>
      <div className="flex flex-col gap-4 py-1">
        <EncontreiroTableFilters />
        <div className="bg-transparent">
          <Table className="text-xs">
            <TableHeader>
              <TableRow className="px-2">
                <SortableTableHead
                  label="EJC"
                  value="numeroEncontro"
                  classname="text-nowrap rounded-tl-xl lg:w-[73px] w-7 pl-4"
                  orderByField={orderByField}
                  orderByDirection={orderByDirection}
                  handleFn={handleOrder}
                />
                <SortableTableHead
                  label="Nome"
                  value="nome"
                  orderByField={orderByField}
                  orderByDirection={orderByDirection}
                  handleFn={handleOrder}
                />
                <SortableTableHead
                  label="Bairro"
                  value="bairro"
                  orderByField={orderByField}
                  orderByDirection={orderByDirection}
                  handleFn={handleOrder}
                />
                <TableHead>Celular</TableHead>
                <TableHead className="w-7 lg:w-[178px]">Círculo</TableHead>
                <SortableTableHead
                  label="Status"
                  value="idStatus"
                  classname="lg:w-[178px] w-7"
                  orderByField={orderByField}
                  orderByDirection={orderByDirection}
                  handleFn={handleOrder}
                />
                <TableHead className="w-7 rounded-tr-xl lg:w-16">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-transparent">
              {isLoadingEncontreiro && <EncontreiroTableSkeleton />}
              {result &&
                result.encontreiros.length !== 0 &&
                result.encontreiros.map((encontreiro) => {
                  return (
                    <EncontreiroTableRow
                      key={encontreiro.id}
                      encontreiro={encontreiro}
                    />
                  )
                })}
              {result && result.encontreiros.length === 0 && (
                <EmptyTableRow
                  colspan={8}
                  content="Sem encontreiros cadastrados neste encontro"
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
