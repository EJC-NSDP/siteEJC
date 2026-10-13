import type { PalestraEncontro } from '@/app/api/encontro/atual/[ignorar]/palestrantes/get-palestrantes'
import type { Palestra } from '@/app/api/domains/palestras/get-palestra'
import { Card } from '@/components/ui/card'

interface PalestraReadOnlyProps {
  palestras: PalestraEncontro[]
  dominios: Palestra[]
}

export function PalestraReadOnly({ palestras, dominios }: PalestraReadOnlyProps) {
  if (palestras.length === 0) {
    return (
      <Card className="flex w-full items-center justify-center gap-4 p-4 text-center text-zinc-500">
        Nenhum palestrante cadastrado para este encontrão.
      </Card>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-zinc-500">
            <th className="px-4 py-3 font-medium">#</th>
            <th className="px-4 py-3 font-medium">Palestra</th>
            <th className="px-4 py-3 font-medium">Palestrante</th>
          </tr>
        </thead>
        <tbody>
          {palestras.map((p, index) => {
            const nomePalestra =
              dominios.find((d) => String(d.id) === p.idPalestra)?.nome ??
              p.idPalestra

            return (
              <tr
                key={`${p.idPalestra}-${index}`}
                className="border-b border-zinc-100 last:border-0"
              >
                <td className="px-4 py-3 text-zinc-400">{index + 1}</td>
                <td className="px-4 py-3 text-zinc-700">{nomePalestra}</td>
                <td className="px-4 py-3 font-medium text-zinc-700">
                  {p.nomePalestrante ?? '—'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
