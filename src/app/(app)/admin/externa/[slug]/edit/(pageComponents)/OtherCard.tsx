import tamanhoCamisaReference from '@/assets/TamanhoCamisaReference.jpeg'
import { CardForm } from '@/components/Form/CardForm'
import { CardFormSection } from '@/components/Form/CardFormSection'
import { SelectGroupInput } from '@/components/Form/SelectInput/SelectGroupInput'
import {
  SelectItem,
  type SelectArray,
} from '@/components/Form/SelectInput/SelectItem'
import { TextInput } from '@/components/Form/TextInput'
import { FormField } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { getTamanhoCamisa } from '@/utils/fetch-domains'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { useFormContext } from 'react-hook-form'

export function OtherCard() {
  const form = useFormContext()

  const { data: tamanhoCamisa } = useQuery<SelectArray[]>({
    queryFn: async () => await getTamanhoCamisa(),
    queryKey: ['tamanhoCamisa'],
  })

  const { control } = form

  return (
    <CardForm title="Outros" sectionId="other-section">
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
        <CardFormSection>
          <FormField
            control={control}
            name="tamanhoCamisa"
            render={({ field }) => {
              return (
                <SelectGroupInput
                  label="Qual é seu tamanho de camisa?"
                  placeholder="Selecione uma opção"
                  onChange={field.onChange}
                  value={field.value}
                  tip={
                    <Image
                      src={tamanhoCamisaReference}
                      alt="Tamanhos de camisa"
                    />
                  }
                >
                  {tamanhoCamisa &&
                    tamanhoCamisa.map((item) => {
                      return (
                        <SelectItem
                          key={item.value}
                          value={item.value}
                          text={item.label}
                        />
                      )
                    })}
                </SelectGroupInput>
              )
            }}
          />

          <FormField
            control={control}
            name="nomeMovimento"
            render={({ field }) => (
              <TextInput label={'De qual movimento você fez parte?'}>
                <Input {...field} />
              </TextInput>
            )}
          />
        </CardFormSection>
        <CardFormSection>
          <FormField
            control={control}
            name="restricoesAlimentares"
            render={({ field }) => (
              <TextInput label={'Restrições alimentares'}>
                <Input {...field} />
              </TextInput>
            )}
          />

          <FormField
            control={control}
            name="observacoes"
            render={({ field }) => (
              <TextInput label={'Observações'}>
                <Textarea {...field} />
              </TextInput>
            )}
          />
        </CardFormSection>
      </div>
    </CardForm>
  )
}
