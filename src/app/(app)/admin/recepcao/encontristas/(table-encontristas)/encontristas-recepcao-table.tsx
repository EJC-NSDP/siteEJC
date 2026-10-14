import { useQuery } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'

import type { EncontristaRecepcaoSummary } from '@/app/api/recepcao/encontristas/get-encontristas-recepcao'
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

import { EncontristasRecepcaoTableFilters } from './encontristas-recepcao-table-filters'
import { EncontristasRecepcaoTableRow } from './encontristas-recepcao-table-row'
import { EncontristasRecepcaoTableSkeleton } from './encontristas-recepcao-table-skeleton'

const TOTAL_COL = 6

interface SearchProps {
  pageIndex: number
  encontreiroName: string | null
  corCirculo: string | null
  orderByField: string | null
  orderByDirection: string | null
}

async function fetchEncontristas({
  pageIndex,
  encontreiroName,
  corCirculo,
  orderByField,
  orderByDirection,
}: SearchProps): Promise<EncontristaRecepcaoSummary> {
  const p = new URLSearchParams()
  p.append('page', String(pageIndex))
  if (encontreiroName) p.append('name', encontreiroName)
  if (corCirculo) p.append('cor', corCirculo)
  if (orderByField) p.append('orderByField', orderByField)
  if (orderByDirection) p.append('orderDirection', orderByDirection)

  const response: EncontristaRecepcaoSummary = await api
    .get(`recepcao/encontristas?${p.toString()}`)
    .then((r) => r.data)
    .catch((err) => console.error(err))

  return response
}

export function EncontristasRecepcaoTable() {
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

  const { data: result, isLoading } = useQuery<EncontristaRecepcaoSummary>({
    queryKey: [
      'recepcao-encontristas',
      {
        pageIndex,
        encontreiroName,
        corCirculo,
        orderByField,
        orderByDirection,
      },
    ],
    queryFn: () =>
      fetchEncontristas({
        pageIndex,
        encontreiroName,
        corCirculo,
        orderByField,
        orderByDirection,
      }),
  })

  function handlePaginate(pageIndex: number) {
    const p = new URLSearchParams()
    if (encontreiroName) p.append('encontreiroName', encontreiroName)
    if (corCirculo) p.append('corCirculo', corCirculo)
    if (orderByField) p.append('orderByField', orderByField)
    if (orderByDirection) p.append('orderDirection', orderByDirection)
    p.append('page', String(pageIndex + 1))
    router.push(`${pathname}?${p.toString()}`)
  }

  function handleOrder(orderField: string) {
    const p = new URLSearchParams()
    if (encontreiroName) p.append('encontreiroName', encontreiroName)
    if (corCirculo) p.append('corCirculo', corCirculo)
    p.append('orderByField', orderField)
    const direction =
      orderByField === orderField && orderByDirection === 'asc' ? 'desc' : 'asc'
    p.append('orderDirection', direction)
    p.append('page', String(pageIndex + 1))
    router.push(`${pathname}?${p.toString()}`)
  }

  return (
    <div className="flex flex-col gap-4 py-1">
      <EncontristasRecepcaoTableFilters />
      <div className="w-full overflow-x-auto bg-transparent">
        <Table className="w-full text-xs lg:table-fixed">
          <TableHeader>
            <TableRow>
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
                classname="w-[120px]"
                orderByField={orderByField}
                orderByDirection={orderByDirection}
                handleFn={handleOrder}
              />
              <TableHead className="w-[150px] text-nowrap">
                Família Confirmada
              </TableHead>
              <TableHead className="w-[180px]">Contato 1</TableHead>
              <TableHead className="w-[180px]">Contato 2</TableHead>
              <TableHead className="w-[180px] rounded-tr-xl pr-4">
                Tios de Externa
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-transparent">
            {isLoading && <EncontristasRecepcaoTableSkeleton />}
            {result &&
              result.encontristas.length > 0 &&
              result.encontristas.map((e) => (
                <EncontristasRecepcaoTableRow key={e.id} encontrista={e} />
              ))}
            {result && result.encontristas.length === 0 && (
              <EmptyTableRow
                colspan={TOTAL_COL}
                content="Nenhum encontrista encontrado"
              />
            )}
          </TableBody>
          <TableFooter>
            {isLoading && <PaginationSkeleton totalCol={TOTAL_COL} />}
            {result && (
              <Pagination
                pageIndex={result.pageIndex}
                totalCount={result.totalCount}
                perPage={result.perPage}
                onPageChange={handlePaginate}
                totalCol={TOTAL_COL}
              />
            )}
          </TableFooter>
        </Table>
      </div>
    </div>
  )
}
