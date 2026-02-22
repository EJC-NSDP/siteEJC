import type { CarroFromEncontro } from '@/app/api/encontro/atual/[ignorar]/carros/get-carros'
import { TableCell, TableRow } from '@/components/ui/table'

interface TiosExternaSecreTableRowProps {
  carro: CarroFromEncontro
}

export function TiosExternaSecreTableRow({
  carro,
}: TiosExternaSecreTableRowProps) {
  return (
    <TableRow className="items-center bg-white">
      <TableCell className="font-medium text-nowrap">
        {carro.motorista.nome} {carro.carona ? `e ${carro.carona.nome}` : ''}
      </TableCell>
      <TableCell>{carro.bairro}</TableCell>
    </TableRow>
  )
}
