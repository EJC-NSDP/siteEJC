import { SelectGroupInput } from '@/components/Form/SelectInput/SelectGroupInput'
import {
  SelectItem,
  type SelectArray,
} from '@/components/Form/SelectInput/SelectItem'
import { TextInput } from '@/components/Form/TextInput'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FormField } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { getPalestras } from '@/utils/fetch-domains'
import { useQuery } from '@tanstack/react-query'
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

interface CardPalestraProps {
  index: number
  total: number
  remove: () => void
  moveUp: () => void
  moveDown: () => void
}

export function CardPalestra({
  index,
  total,
  remove,
  moveUp,
  moveDown,
}: CardPalestraProps) {
  const { control } = useFormContext()

  const { data: palestras } = useQuery<SelectArray[]>({
    queryFn: async () => await getPalestras(),
    queryKey: ['palestras'],
  })

  const isFirst = index === 0
  const isLast = index === total - 1

  return (
    <div className="flex items-center gap-2 lg:gap-4">
      <div className="flex flex-col items-center">
        <Button
          variant="ghost"
          className="p-0"
          disabled={isFirst}
          onClick={moveUp}
          type="button"
        >
          <ChevronUp className="size-5 text-zinc-700 hover:text-zinc-500" />
        </Button>

        <span>{index + 1}</span>

        <Button
          variant="ghost"
          className="p-0"
          disabled={isLast}
          onClick={moveDown}
          type="button"
        >
          <ChevronDown className="size-5 text-zinc-700 hover:text-zinc-500" />
        </Button>
      </div>

      <Card className="flex w-full flex-col items-center gap-4 p-4 lg:flex-row">
        <div className="w-full">
          <FormField
            control={control}
            name={`palestras.${index}.idPalestra`}
            render={({ field }) => (
              <SelectGroupInput
                label="Palestra"
                onChange={field.onChange}
                value={field.value}
              >
                {palestras?.map((item) => (
                  <SelectItem
                    key={item.value}
                    value={item.value}
                    text={item.label}
                  />
                ))}
              </SelectGroupInput>
            )}
          />
        </div>
        <div className="w-full">
          <FormField
            control={control}
            name={`palestras.${index}.nomePalestrante`}
            render={({ field }) => (
              <TextInput label="Nome do palestrante">
                <Input {...field} />
              </TextInput>
            )}
          />
        </div>
        <Button
          variant="destructive"
          className="flex w-full items-center gap-2 p-4 lg:w-auto"
          onClick={remove}
          type="button"
        >
          <Trash2 className="size-4 text-red-400 hover:text-red-500" />
          <span className="text-lg lg:sr-only">Remover</span>
        </Button>
      </Card>
    </div>
  )
}
