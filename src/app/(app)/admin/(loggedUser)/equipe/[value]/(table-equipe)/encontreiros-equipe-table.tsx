'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import type { EncontreiroEmEquipe } from '@/app/api/encontreiro/[id]/equipe/get-equipe'
import { EmptyTableRow } from '@/components/Table/EmptyTableRow'
import { cn } from '@/lib/utils'
import { EncontreiroEquipeTableRow } from './encontreiros-equipe-table-row'

interface EncontreirosEquipeTableProps {
  equipe: EncontreiroEmEquipe[]
  labelEquipe: string
}

export function EncontreirosEquipeTable({
  equipe,
  labelEquipe,
}: EncontreirosEquipeTableProps) {
  // const isRosa = labelPertenceARosa(equipe[0].equipeLabel)

  // const showAction = !isRosa && equipe[0].equipeLabel !== 'Dirigente'

  const showAction = false

  const totalCol = showAction ? 9 : 8

  return (
    <>
      <div className="flex flex-col gap-4 py-1">
        <div className="w-full overflow-x-auto bg-transparent">
          <Table className="w-full text-xs lg:table-fixed">
            <TableHeader>
              <TableRow className="px-2">
                <TableHead className="w-[60px] text-nowrap rounded-tl-xl pl-4">
                  EJC
                </TableHead>
                <TableHead className="w-auto">Nome</TableHead>
                <TableHead className="w-[120px]">Celular</TableHead>
                <TableHead className="w-[120px]">Bairro</TableHead>
                <TableHead className="w-[120px]">Instagram</TableHead>
                <TableHead className="w-[120px]">Email</TableHead>
                <TableHead className="w-[120px]">Equipe</TableHead>
                <TableHead
                  className={cn(
                    !showAction && 'rounded-tr-xl pr-4',
                    'w-[150px] text-nowrap',
                  )}
                >
                  Ficha preenchida
                </TableHead>
                {showAction && (
                  <TableHead className="w-[60px] rounded-tr-xl pr-4">
                    Ações
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody className="bg-transparent">
              {equipe.length !== 0 &&
                equipe.map((encontreiro) => {
                  return (
                    <EncontreiroEquipeTableRow
                      key={encontreiro.slug}
                      encontreiro={encontreiro}
                      labelEquipeUser={labelEquipe}
                    />
                  )
                })}
              {equipe.length === 0 && (
                <EmptyTableRow
                  colspan={8}
                  content="Sem encontreiros cadastrados"
                />
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={totalCol} className="rounded-b-xl">
                  {equipe.length} encontreiros
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </>
  )
}
