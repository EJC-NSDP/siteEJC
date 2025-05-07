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
import { PastoraisSecreTableRow } from './pastorais-secre-table-row'
import { PastoraisSecreTableSkeleton } from './pastorais-secre-table-skeleton'

async function getPastorais(ano: number) {
  const response: PessoaPastoral[] = await api
    .get(`lideranca/${ano}/pastorais`)
    .then((response) => response.data)
    .catch((err) => console.error(err))

  return response
}

export function PastoraisSecreTable() {
  const totalCol = 3
  const thisYear = new Date().getFullYear()

  const { data: result, isLoading } = useQuery<PessoaPastoral[]>({
    queryKey: ['pastorais', thisYear],
    queryFn: () => getPastorais(thisYear),
  })

  return (
    <>
      <div className="flex flex-col gap-4 py-1">
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
