import { useQuery } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'

import { EncontristasSecreTableFilters } from './encontristas-secre-table-filters'
import { EncontristasSecreTableRow } from './encontristas-secre-table-row'
import { EncontristasSecreTableSkeleton } from './encontristas-secre-table-skeleton'

import type { EncontristaSecreSummary } from '@/app/api/secretaria/encontrista/get-encontristas-secre'
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
  corCirculo: string | null
  orderByField: string | null
  orderByDirection: string | null
}

async function getEncontristasSecre({
  pageIndex,
  encontreiroName,
  corCirculo,
  orderByField,
  orderByDirection,
}: SearchProps) {
  const nameSearch = encontreiroName ? `name=${encontreiroName}&` : ''
  const corSearch = corCirculo ? `cor=${corCirculo}&` : ''
  const orderField = orderByField ? `orderByField=${orderByField}&` : ''
  const orderDirection = orderByDirection
    ? `orderDirection=${orderByDirection}&`
    : ''

  const path = `secretaria/encontrista?${nameSearch}${corSearch}${orderField}${orderDirection}page=${pageIndex}`

  const response: EncontristaSecreSummary = await api
    .get(path)
    .then((response) => response.data)
    .catch((err) => console.error(err))

  return response
}

export function EncontristasSecreTable() {
  const totalCol = 7
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const encontreiroName = searchParams.get('encontreiroName')
  const corCirculo = searchParams.get('corCirculo')
  const orderByField = searchParams.get('orderByField')
  const orderByDirection = searchParams.get('orderDirection')

  const pageIndex = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get('page') ?? '1')

  const { data: result, isLoading: isLoadingEncontreiro } =
    useQuery<EncontristaSecreSummary>({
      queryKey: [
        'encontrista',
        {
          pageIndex,
          encontreiroName,
          corCirculo,
          orderByField,
          orderByDirection,
        },
      ],
      queryFn: () =>
        getEncontristasSecre({
          pageIndex,
          encontreiroName,
          corCirculo,
          orderByField,
          orderByDirection,
        }),
    })

  function handlePaginate(pageIndex: number) {
    const newSearch = new URLSearchParams()
    if (encontreiroName)
      newSearch.append('encontreiroName', encontreiroName.toString())

    if (corCirculo) newSearch.append('corCirculo', corCirculo.toString())

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

    if (corCirculo) newSearch.append('corCirculo', corCirculo.toString())

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
        <EncontristasSecreTableFilters />
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
                  label="Círculo"
                  value="cor"
                  classname="w-[150px]"
                  orderByField={orderByField}
                  orderByDirection={orderByDirection}
                  handleFn={handleOrder}
                />
                <TableHead className="w-[120px]">Nascimento</TableHead>
                <TableHead className="w-[120px]">Celular</TableHead>
                <TableHead className="w-[120px]">Bairro</TableHead>
                <TableHead className="w-[180px]">Instagram</TableHead>
                <TableHead className="w-[60px] rounded-tr-xl pr-4">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-transparent">
              {isLoadingEncontreiro && <EncontristasSecreTableSkeleton />}
              {result &&
                result.encontristas.length !== 0 &&
                result.encontristas.map((encontrista) => {
                  return (
                    <EncontristasSecreTableRow
                      key={encontrista.slug}
                      encontrista={encontrista}
                    />
                  )
                })}
              {result && result.encontristas.length === 0 && (
                <EmptyTableRow
                  colspan={totalCol}
                  content="Sem encontristas cadastrados"
                />
              )}
            </TableBody>
            <TableFooter>
              {isLoadingEncontreiro && (
                <PaginationSkeleton totalCol={totalCol} />
              )}
              {result && (
                <Pagination
                  pageIndex={result.pageIndex}
                  totalCount={result.totalCount}
                  perPage={result.perPage}
                  onPageChange={handlePaginate}
                  totalCol={totalCol}
                />
              )}
            </TableFooter>
          </Table>
        </div>
      </div>
    </>
  )
}
