import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import type { PessoaPastoral } from '@/app/api/lideranca/[ano]/pastorais/get-pastorais'
import { EmptyTableRow } from '@/components/Table/EmptyTableRow'
import { api } from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { PastoraisSecreTableFilters } from './pastorais-secre-table-filters'
import { PastoraisSecreTableRow } from './pastorais-secre-table-row'
import { PastoraisSecreTableSkeleton } from './pastorais-secre-table-skeleton'

interface SearchProps {
  ano: number
  encontreiroName: string | null
  pastorais: string | null
}

async function getPastorais({ ano, encontreiroName, pastorais }: SearchProps) {
  const nameSearch = encontreiroName ? `name=${encontreiroName}&` : ''
  const pastoralSearch = pastorais ? `pastoral=${pastorais}&` : ''

  const path = `lideranca/${ano}/pastorais?${nameSearch}${pastoralSearch}`

  const response: PessoaPastoral[] = await api
    .get(path)
    .then((response) => response.data)
    .catch((err) => console.error(err))

  return response
}

export function PastoraisSecreTable() {
  const totalCol = 3
  const ano = new Date().getFullYear()

  const searchParams = useSearchParams()

  const encontreiroName = searchParams.get('encontreiroName')
  const pastorais = searchParams.get('pastorais')

  const { data: result, isLoading } = useQuery<PessoaPastoral[]>({
    queryFn: () => getPastorais({ ano, encontreiroName, pastorais }),
    queryKey: ['pastorais', { ano, encontreiroName, pastorais }],
  })

  return (
    <>
      <div className="flex flex-col gap-4 py-1">
        <PastoraisSecreTableFilters />
        <div className="w-full overflow-x-auto bg-transparent">
          <Table className="w-full text-xs lg:table-fixed">
            <TableHeader>
              <TableRow className="px-2">
                <TableHead className="rounded-tl-xl pl-4">Nome</TableHead>
                <TableHead>Pastoral</TableHead>
                <TableHead className="rounded-tr-xl pr-4 lg:w-[90px]">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-transparent">
              {isLoading && <PastoraisSecreTableSkeleton />}
              {result &&
                result.length !== 0 &&
                result.map((lider) => {
                  return (
                    <PastoraisSecreTableRow key={lider.nome} pessoa={lider} />
                  )
                })}
              {result && result.length === 0 && (
                <EmptyTableRow
                  colspan={totalCol}
                  content="Sem pessoas cadastradas em pastorais"
                />
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={totalCol} className="rounded-b-xl">
                  {result ? result.length : '?'} pessoas
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </>
  )
}
