import {
  Table,
  TableBody,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import type { EncontreiroMontagemSummary } from '@/app/api/encontreiro/montagem/get-montagem-summary'
import { EmptyTableRow } from '@/components/Table/EmptyTableRow'
import { Pagination } from '@/components/Table/Pagination'
import { PaginationSkeleton } from '@/components/Table/PaginationSkeleton'
import { SortableTableHead } from '@/components/Table/SortableTableHead'
import { api } from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { EncontreiroTableRow } from './encontreiros-montagem-table-row'
import { EncontreiroMontagemTableSkeleton } from './encontreiros-montagem-table-skeleton'
import { EncontreiroTableFilters } from './encontreiros-table-filters'

interface SearchProps {
  pageIndex: number
  encontreiroName: string | null
  equipeValue: string | null
  orderByField: string | null
  orderByDirection: string | null
}

async function getEncontreiros({
  pageIndex,
  encontreiroName,
  equipeValue,
  orderByField,
  orderByDirection,
}: SearchProps) {
  const nameSearch = encontreiroName ? `name=${encontreiroName}&` : ''
  const equipeSearch = equipeValue ? `equipe=${equipeValue}&` : ''
  const orderField = orderByField ? `orderByField=${orderByField}&` : ''
  const orderDirection = orderByDirection
    ? `orderDirection=${orderByDirection}&`
    : ''

  const path = `encontreiro/montagem?${nameSearch}${equipeSearch}${orderField}${orderDirection}page=${pageIndex}`

  const response: EncontreiroMontagemSummary = await api
    .get(path)
    .then((response) => response.data)
    .catch((err) => console.error(err))

  return response
}

export function EncontreirosMontagemTable() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const encontreiroName = searchParams.get('encontreiroName')
  const equipeValue = searchParams.get('equipeValue')
  const responsavelExterna = searchParams.get('responsavelExterna')
  const orderByField = searchParams.get('orderByField')
  const orderByDirection = searchParams.get('orderDirection')

  const pageIndex = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get('page') ?? '1')

  const { data: result, isLoading: isLoadingEncontreiro } =
    useQuery<EncontreiroMontagemSummary>({
      queryKey: [
        'encontreiros',
        {
          pageIndex,
          encontreiroName,
          equipeValue,
          responsavelExterna,
          orderByField,
          orderByDirection,
        },
      ],
      queryFn: () =>
        getEncontreiros({
          pageIndex,
          encontreiroName,
          equipeValue,
          orderByField,
          orderByDirection,
        }),
    })

  function handlePaginate(pageIndex: number) {
    const newSearch = new URLSearchParams()
    if (encontreiroName)
      newSearch.append('encontreiroName', encontreiroName.toString())

    if (equipeValue) newSearch.append('equipeValue', equipeValue.toString())

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

    if (equipeValue) newSearch.append('equipeValue', equipeValue.toString())

    if (responsavelExterna)
      newSearch.append('responsavelExterna', responsavelExterna.toString())

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
        <EncontreiroTableFilters />
        <div className="w-full overflow-x-auto bg-transparent">
          <Table className="w-full text-xs lg:table-fixed">
            <TableHeader>
              <TableRow className="px-2">
                <SortableTableHead
                  label="Nome"
                  value="nome"
                  classname="w-auto rounded-tl-xl pl-4"
                  orderByField={orderByField}
                  orderByDirection={orderByDirection}
                  handleFn={handleOrder}
                />
                <SortableTableHead
                  label="Bairro"
                  value="bairro"
                  classname="w-[100px]"
                  orderByField={orderByField}
                  orderByDirection={orderByDirection}
                  handleFn={handleOrder}
                />
                <TableHead className="w-[110px]">Disponibilidade</TableHead>
                <TableHead className="w-[150px]">Preferências</TableHead>
                <SortableTableHead
                  label="Equipe"
                  value="equipe"
                  classname="w-[200px]"
                  orderByField={orderByField}
                  orderByDirection={orderByDirection}
                  handleFn={handleOrder}
                />
                <TableHead className="w-[90px]">Coordenador</TableHead>
                <TableHead className="w-[80px] rounded-tr-xl pr-4">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-transparent">
              {isLoadingEncontreiro && <EncontreiroMontagemTableSkeleton />}
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
                  colspan={7}
                  content="Sem encontreiros cadastrados"
                />
              )}
            </TableBody>
            <TableFooter>
              {isLoadingEncontreiro && <PaginationSkeleton totalCol={7} />}
              {result && (
                <Pagination
                  pageIndex={result.pageIndex}
                  totalCount={result.totalCount}
                  perPage={result.perPage}
                  onPageChange={handlePaginate}
                  totalCol={7}
                />
              )}
            </TableFooter>
          </Table>
        </div>
      </div>
    </>
  )
}
