import { Input } from '@/components/ui/input'
import { CardCapas } from './CardCapas'

export function Capas() {
  return (
    <div className="space-y-4">
      <CardCapas title="Capa do quadrante">
        <Input className="w-full" />
      </CardCapas>
      <CardCapas title="Capa dos círculos">
        <Input className="w-full" />
      </CardCapas>
      <CardCapas title="Capa das equipes">
        <Input className="w-full" />
      </CardCapas>
    </div>
  )
}
