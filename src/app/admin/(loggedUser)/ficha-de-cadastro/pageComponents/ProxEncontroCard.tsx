import { SelectGroupInput } from '@/components/Form/SelectInput/SelectGroupInput'
import {
  SelectItem,
  type SelectArray
} from '@/components/Form/SelectInput/SelectItem'
import { TextInput } from '@/components/Form/TextInput'
import { FormField, FormLabel } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { getDisponibilidade, getEquipes } from '@/utils/fetch-domains'
import { useQuery } from '@tanstack/react-query'
import { useFormContext } from 'react-hook-form'
import { CardForm } from '../components/CardForm'

export function ProxEncontroCard() {
  const form = useFormContext()

  const { data: disponibilidade } = useQuery<SelectArray[]>({
    queryFn: async () => await getDisponibilidade(),
    queryKey: ['disponibilidade'],
  })

  const { data: equipes } = useQuery<SelectArray[]>({
    queryFn: async () => await getEquipes(),
    queryKey: ['equipes'],
  })

  const { control } = form

  return (
    <CardForm title="Sobre o próximo EJC" sectionId="prox-ejc-section">
      <div className="flex flex-col gap-6">
        <FormField
          control={control}
          name="disponibilidade"
          render={({ field }) => {
            return (
              <SelectGroupInput
                label="Qual a sua disponibilidade para o próximo encontrão?"
                placeholder="Selecione uma opção"
                onChange={field.onChange}
                value={field.value}
              >
                {disponibilidade &&
                  disponibilidade.map((item) => {
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
        <div className='flex flex-col gap-6'>
          <FormLabel>Lista de preferências:</FormLabel>
          <FormField
            control={control}
            name="preferencia1"
            render={({ field }) => {
              return (
                <label className='flex gap-4 w-full items-center'>
                  <FormLabel>1.</FormLabel>
                  <div className='w-full'>
                    <SelectGroupInput
                      placeholder="Selecione uma opção"
                      onChange={field.onChange}
                      value={field.value}
                    >
                      {equipes &&
                        equipes.map((item) => {
                          return (
                            <SelectItem
                              key={item.value}
                              value={item.value}
                              text={item.label}
                            />
                          )
                        })}
                    </SelectGroupInput>
                  </div>
                </label>
              )
            }}
          />
          <FormField
            control={control}
            name="preferencia2"
            render={({ field }) => {
              return (
                <label className='flex gap-4 w-full items-center'>
                  <FormLabel>2.</FormLabel>
                  <div className='w-full'>
                    <SelectGroupInput
                      placeholder="Selecione uma opção"
                      onChange={field.onChange}
                      value={field.value}
                    >
                      {equipes &&
                        equipes.map((item) => {
                          return (
                            <SelectItem
                              key={item.value}
                              value={item.value}
                              text={item.label}
                            />
                          )
                        })}
                    </SelectGroupInput>
                  </div>
                </label>
              )
            }}
          />

          <FormField
            control={control}
            name="preferencia3"
            render={({ field }) => {
              return (
                <label className='flex gap-4 w-full items-center'>
                  <FormLabel>3.</FormLabel>
                  <div className='w-full'>
                    <SelectGroupInput
                      placeholder="Selecione uma opção"
                      onChange={field.onChange}
                      value={field.value}
                    >
                      {equipes &&
                        equipes.map((item) => {
                          return (
                            <SelectItem
                              key={item.value}
                              value={item.value}
                              text={item.label}
                            />
                          )
                        })}
                    </SelectGroupInput>
                  </div>
                </label>
              )
            }}
          />
        </div>

        <FormField
          control={control}
          name="obsBanda"
          render={({ field }) => {
            return (
              <TextInput label={'Observações Banda'}>
                <Textarea {...field} />
              </TextInput>
            )
          }}
        />

        <FormField
          control={control}
          name="observacoes"
          render={({ field }) => {
            return (
              <TextInput label={'Observações Gerais'}>
                <Textarea {...field} />
              </TextInput>
            )
          }}
        />
      </div>
    </CardForm>
  )
}
