import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import type { CarroFromEncontro } from '@/app/api/encontro/atual/[ignorar]/carros/get-carros'
import { EmptyTableRow } from '@/components/Table/EmptyTableRow'
import { api } from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'
import { TiosExternaSecreTableRow } from './encontreiros-secre-table-row'
import { TiosExternaSecreTableSkeleton } from './encontreiros-secre-table-skeleton'

export function ordenarCarrosPorNomeMotorista(
  carros: CarroFromEncontro[],
): CarroFromEncontro[] {
  return [...carros].sort((a, b) =>
    a.motorista.nome.localeCompare(b.motorista.nome, 'pt-BR', {
      sensitivity: 'base',
    }),
  )
}

async function getTiosExterna() {
  const response: CarroFromEncontro[] = await api
    .get('encontro/atual/1/carros')
    .then((response) => response.data)
    .catch((err) => console.error(err))

  return ordenarCarrosPorNomeMotorista(response)
}

export function TiosExternaSecreTable() {
  const { data: result, isLoading: isLoadingTios } = useQuery<
    CarroFromEncontro[]
  >({
    queryKey: ['tios-externa'],
    queryFn: () => getTiosExterna(),
  })

  return (
    <>
      <div className="flex flex-col gap-4 py-1">
        <div className="w-full overflow-x-auto bg-transparent">
          <Table className="w-full text-xs lg:table-fixed">
            <TableHeader>
              <TableRow className="px-2">
                <TableHead className="rounded-tl-xl pl-4">
                  Tio de Externa
                </TableHead>
                <TableHead className="rounded-tr-xl pr-4">Bairro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-transparent">
              {isLoadingTios && <TiosExternaSecreTableSkeleton />}
              {result &&
                result.length !== 0 &&
                result.map((carro) => {
                  return (
                    <TiosExternaSecreTableRow key={carro.id} carro={carro} />
                  )
                })}
              {result && result.length === 0 && (
                <EmptyTableRow
                  colspan={2}
                  content="Sem encontreiros cadastrados"
                />
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2} className="rounded-b-xl">
                  {result ? result.length : '?'} carros
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </>
  )
}
