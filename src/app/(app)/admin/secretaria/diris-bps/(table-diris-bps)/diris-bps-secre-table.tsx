import { useQuery } from '@tanstack/react-query'

import { DirisBpsSecreTableRow } from './diris-bps-secre-table-row'
import { DirisBpsSecreTableSkeleton } from './diris-bps-secre-table-skeleton'

import type { DiriBP } from '@/app/api/lideranca/[ano]/diris-bps/get-diris-bps'
import { EmptyTableRow } from '@/components/Table/EmptyTableRow'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { api } from '@/lib/axios'

async function getDirisBps(ano: number) {
  const response: DiriBP[] = await api
    .get(`lideranca/${ano}/diris-bps`)
    .then((response) => response.data)
    .catch((err) => console.error(err))

  return response
}

export function DirisBpsSecreTable() {
  const thisYear = new Date().getFullYear()

  const { data: result, isLoading } = useQuery<DiriBP[]>({
    queryKey: ['diris-bps', thisYear],
    queryFn: () => getDirisBps(thisYear),
  })

  return (
    <>
      <div className="flex flex-col gap-4 py-1">
        <div className="w-full overflow-x-auto bg-transparent">
          <Table className="w-full text-xs lg:table-fixed">
            <TableHeader>
              <TableRow className="px-2">
                <TableHead className="rounded-tl-xl pl-4">Nome</TableHead>
                <TableHead className="rounded-tr-xl pr-4">Função</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-transparent">
              {isLoading && <DirisBpsSecreTableSkeleton />}
              {result &&
                result.length !== 0 &&
                result.map((lider) => {
                  return (
                    <DirisBpsSecreTableRow key={lider.nome} pessoa={lider} />
                  )
                })}
              {result && result.length === 0 && (
                <EmptyTableRow
                  colspan={2}
                  content="Sem diris ou bps cadastrados"
                />
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2} className="rounded-b-xl">
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
