import { DisabledInput } from '@/components/Form/DisabledInput'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useFormContext } from 'react-hook-form'
import { CardForm } from '../components/CardForm'

export function EncontroCard() {
  const form = useFormContext()
  const { watch } = form

  const encontroValue = watch('encontroQueFez')
  const circuloValue = watch('nomeCirculo')
  const corCirculoValue = watch('corCirculo')
  const equipeAnteriorValue = watch('equipeAnterior')
  const equipeAnteriorCoordValue = watch('equipeAnteriorCoord')
  const equiperValue = watch('equipe')
  const equipeCoordValue = watch('equipeCoord')

  return (
    <CardForm title="Sobre o EJC" sectionId="ejc-section">
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-6">
        <DisabledInput label="EJC que fez" value={`${encontroValue}º EJC`} />
        <DisabledInput label="Círculo" value={circuloValue}>
          {corCirculoValue && (
            <div
              className={cn(
                corCirculoValue,
                'flex h-5 w-5 items-center justify-center rounded-full  shadow-sm',
              )}
            />
          )}
        </DisabledInput>

        <DisabledInput
          label="Equipe no último encontro"
          value={equipeAnteriorValue}
        >
          <div> {equipeAnteriorCoordValue && <Badge>C</Badge>}</div>
        </DisabledInput>

        <DisabledInput label="Equipe nesse encontro" value={equiperValue}>
          <div> {equipeCoordValue && <Badge>C</Badge>}</div>
        </DisabledInput>
      </div>
    </CardForm>
  )
}
