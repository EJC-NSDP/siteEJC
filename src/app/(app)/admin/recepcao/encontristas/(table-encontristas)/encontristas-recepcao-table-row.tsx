import type { EncontristaRecepcaoData } from '@/app/api/recepcao/encontristas/get-encontristas-recepcao'
import { TableCell, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { getCirculoColor } from '@/utils/fetch-color'

interface Props {
  encontrista: EncontristaRecepcaoData
}

export function EncontristasRecepcaoTableRow({ encontrista }: Props) {
  const nomeCompleto = `${encontrista.nome} ${encontrista.sobrenome}${encontrista.apelido ? ` (${encontrista.apelido})` : ''}`
  const cor = getCirculoColor(encontrista.corCirculo ?? '')

  const tios = encontrista.tiosExterna

  return (
    <TableRow className="items-center bg-white">
      <TableCell className="font-medium">{nomeCompleto}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className={cn('h-2 w-2 flex-shrink-0 rounded-full', cor)} />
          <span>{encontrista.corCirculo ?? '—'}</span>
        </div>
      </TableCell>
      <TableCell className="text-nowrap">
        <span
          className={cn(
            'rounded px-2 py-0.5 text-xs font-medium',
            encontrista.familiaOk
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-red-100 text-red-700',
          )}
        >
          {encontrista.familiaOk ? 'Sim' : 'Não'}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-0.5">
          <span className="font-medium">{encontrista.nomeContato1 || '—'}</span>
          {encontrista.telContato1 && (
            <span className="text-xs text-zinc-400">
              {encontrista.telContato1}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>
        {encontrista.nomeContato2 ? (
          <div className="flex flex-col gap-0.5">
            <span className="font-medium">{encontrista.nomeContato2}</span>
            {encontrista.telContato2 && (
              <span className="text-xs text-zinc-400">
                {encontrista.telContato2}
              </span>
            )}
          </div>
        ) : (
          <span className="text-zinc-300">—</span>
        )}
      </TableCell>
      <TableCell>{tios || <span className="text-zinc-300">—</span>}</TableCell>
    </TableRow>
  )
}
