import type { EquipeSecre } from '@/app/api/secretaria/equipe/get-equipes-secre'
import { TextInput } from '@/components/Form/TextInput'
import { FormField } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { useFormContext } from 'react-hook-form'

export interface EquipeRowProps {
  equipe: EquipeSecre
  index: number
}

export function EquipeRow({ equipe, index }: EquipeRowProps) {
  const form = useFormContext()

  const { control } = form

  return (
    <div className="flex w-full gap-10">
      <FormField
        control={control}
        name={`equipe[${index}].equipeValue`}
        render={() => <></>}
      />
      <div className="flex-1">
        <FormField
          control={control}
          name={`equipe[${index}].description`}
          render={({ field }) => {
            return (
              <TextInput label={equipe.equipeLabel}>
                <Textarea {...field} />
              </TextInput>
            )
          }}
        />
      </div>
    </div>
  )
}
