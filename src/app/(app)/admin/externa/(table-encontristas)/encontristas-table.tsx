import { useQuery } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'

import type { EncontristaSummary } from '@/app/api/encontrista/get-encontristas-summary'
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

import { EncontristaTableFilters } from './encontristas-table-filters'
import { EncontristaTableRow } from './encontristas-table-row'
import { EncontristaTableSkeleton } from './encontristas-table-skeleton'

interface SearchProps {
  pageIndex: number
  encontristaName: string | null
  encontristaStatus: string | null
  responsavelExterna: string | null
  orderByField: string | null
  orderByDirection: string | null
}

async function getEncontrista({
  pageIndex,
  encontristaName,
  encontristaStatus,
  responsavelExterna,
  orderByField,
  orderByDirection,
}: SearchProps) {
  const nameSearch = encontristaName ? `name=${encontristaName}&` : ''
  const statusSearch = encontristaStatus ? `status=${encontristaStatus}&` : ''
  const externaSearch = responsavelExterna
    ? `idExterna=${responsavelExterna}&`
    : ''
  const orderField = orderByField ? `orderByField=${orderByField}&` : ''
  const orderDirection = orderByDirection
    ? `orderDirection=${orderByDirection}&`
    : ''

  const path = `encontrista?${nameSearch}${statusSearch}${externaSearch}${orderField}${orderDirection}page=${pageIndex}`

  const response: EncontristaSummary = await api
    .get(path)
    .then((response) => response.data)
    .catch((err) => console.error(err))

  return response
}

export function EncontristasTable() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const encontristaName = searchParams.get('encontristaName')
  const encontristaStatus = searchParams.get('encontristaStatus')
  const responsavelExterna = searchParams.get('responsavelExterna')
  const orderByField = searchParams.get('orderByField')
  const orderByDirection = searchParams.get('orderDirection')

  const pageIndex = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get('page') ?? '1')

  const { data: result, isLoading: isLoadingEncontrista } =
    useQuery<EncontristaSummary>({
      queryKey: [
        'encontristas',
        {
          pageIndex,
          encontristaName,
          encontristaStatus,
          responsavelExterna,
          orderByField,
          orderByDirection,
        },
      ],
      queryFn: () =>
        getEncontrista({
          pageIndex,
          encontristaName,
          encontristaStatus,
          responsavelExterna,
          orderByField,
          orderByDirection,
        }),
    })

  function handlePaginate(pageIndex: number) {
    const newSearch = new URLSearchParams()
    if (encontristaName)
      newSearch.append('encontristaName', encontristaName.toString())

    if (encontristaStatus)
      newSearch.append('encontristaStatus', encontristaStatus.toString())

    if (orderByField) newSearch.append('orderByField', orderByField.toString())

    if (orderByDirection)
      newSearch.append('orderDirection', orderByDirection.toString())

    newSearch.append('page', (pageIndex + 1).toString())
    router.push(`${pathname}?${newSearch}`)
  }

  function handleOrder(orderField: string) {
    const newSearch = new URLSearchParams()
    if (encontristaName)
      newSearch.append('encontristaName', encontristaName.toString())

    if (encontristaStatus)
      newSearch.append('encontristaStatus', encontristaStatus.toString())

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
        <EncontristaTableFilters />
        <div className="bg-transparent">
          <Table className="text-xs lg:table-fixed">
            <TableHeader>
              <TableRow className="px-2">
                <SortableTableHead
                  label="Inscrito em"
                  value="createdAt"
                  classname="text-nowrap rounded-tl-xl lg:w-[85px] pl-4"
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
                  label="Idade"
                  value="dataNasc"
                  classname="w-[60px]"
                  orderByField={orderByField}
                  orderByDirection={orderByDirection}
                  handleFn={handleOrder}
                />
                <SortableTableHead
                  label="Status"
                  value="idStatus"
                  classname="lg:w-[230px]"
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
                <TableHead className="w-[130px] text-nowrap">Celular</TableHead>
                <TableHead className="lg:w-[190px]">Responsável</TableHead>
                <TableHead className="rounded-tr-xl pr-4 lg:w-[90px]">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-transparent">
              {isLoadingEncontrista && <EncontristaTableSkeleton />}
              {result &&
                result.encontristas.length !== 0 &&
                result.encontristas.map((encontrista) => {
                  return (
                    <EncontristaTableRow
                      key={encontrista.id}
                      encontrista={encontrista}
                    />
                  )
                })}
              {result && result.encontristas.length === 0 && (
                <EmptyTableRow
                  colspan={8}
                  content="Sem encontristas cadastrados neste encontro"
                />
              )}
            </TableBody>
            <TableFooter>
              {isLoadingEncontrista && <PaginationSkeleton totalCol={8} />}
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
