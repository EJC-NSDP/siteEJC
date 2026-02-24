import { useQuery } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'

import type { CirculosSummary } from '@/app/api/circulo/get-circulos-summary'
import { EmptyTableRow } from '@/components/Table/EmptyTableRow'
import { Pagination } from '@/components/Table/Pagination'
import { PaginationSkeleton } from '@/components/Table/PaginationSkeleton'
import {
  Table,
  TableBody,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { api } from '@/lib/axios'

import { CirculosTableFilters } from './circulos-table-filters'
import { CirculosTableRow } from './circulos-table-row'
import { CirculosTableSkeleton } from './circulos-table-skeleton'

interface SearchProps {
  pageIndex: number
  encontroNumber: string | null
  colorLable: string | null
}

async function getCirculos({
  pageIndex,
  encontroNumber,
  colorLable,
}: SearchProps) {
  const encontroSearch = encontroNumber ? `encontro=${encontroNumber}&` : ''
  const colorSearch = colorLable ? `cor=${colorLable}&` : ''

  const path = `circulo?${encontroSearch}${colorSearch}page=${pageIndex}`

  const response: CirculosSummary = await api
    .get(path)
    .then((response) => response.data)
    .catch((err) => console.error(err))

  return response
}

export function CirculosTable() {
  const totalCol = 6
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const encontroNumber = searchParams.get('encontroNumber')
  const colorLable = searchParams.get('colorLable')

  const pageIndex = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get('page') ?? '1')

  const { data: result, isLoading: isLoadingEncontreiro } =
    useQuery<CirculosSummary>({
      queryKey: [
        'circulos',
        {
          pageIndex,
          encontroNumber,
          colorLable,
        },
      ],
      queryFn: () =>
        getCirculos({
          pageIndex,
          encontroNumber,
          colorLable,
        }),
    })

  function handlePaginate(pageIndex: number) {
    const newSearch = new URLSearchParams()
    if (encontroNumber)
      newSearch.append('encontroNumber', encontroNumber.toString())

    if (colorLable) newSearch.append('colorLable', colorLable.toString())

    newSearch.append('page', (pageIndex + 1).toString())
    router.push(`${pathname}?${newSearch}`)
  }

  return (
    <>
      <div className="flex flex-col gap-4 py-1">
        <CirculosTableFilters />
        <div className="w-full overflow-x-auto bg-transparent">
          <Table className="w-full text-xs lg:table-fixed">
            <TableHeader>
              <TableRow className="px-2">
                <TableHead className="w-[60px] rounded-tl-xl pl-4 text-nowrap">
                  EJC
                </TableHead>
                <TableHead className="w-[150px]">Cor</TableHead>
                <TableHead className="w-[220px]">Nome</TableHead>
                <TableHead className="w-auto">Tio Aparente</TableHead>
                <TableHead className="w-auto">Tio Secreto</TableHead>
                <TableHead className="w-[80px] rounded-tr-xl pr-4">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-transparent">
              {isLoadingEncontreiro && <CirculosTableSkeleton />}
              {result &&
                result.circulos.length !== 0 &&
                result.circulos.map((circulo) => {
                  return <CirculosTableRow key={circulo.id} circulo={circulo} />
                })}
              {result && result.circulos.length === 0 && (
                <EmptyTableRow
                  colspan={totalCol}
                  content="Sem círculos cadastrados"
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
