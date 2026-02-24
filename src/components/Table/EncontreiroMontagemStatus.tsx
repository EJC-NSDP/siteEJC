import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, Clock } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import type { EncontreiroSummary } from '@/app/api/encontreiro/get-encontreiros-summary'
import type { StatusEncontreiro } from '@/enums'
import { api } from '@/lib/axios'

import { Form, FormControl, FormField, FormItem } from '../ui/form'
import { Select, SelectContent, SelectTrigger, SelectValue } from '../ui/select'

import { SelectItemIcon, type SelectItemIconProps } from './SelectItemIcon'

interface EncontreiroStatusProps {
  encontreiroId: string
  status: StatusEncontreiro
}
export async function changeStatus({
  encontreiroId,
  status,
}: EncontreiroStatusProps) {
  await api.patch(`encontreiro/${encontreiroId}/change-status`, {
    id: encontreiroId,
    status,
  })
}

const encontreiroStatusSchema = z.object({
  statusEncontreiro: z.string(),
})

type encontreiroStatusFormInput = z.infer<typeof encontreiroStatusSchema>

const statusData: SelectItemIconProps[] = [
  {
    color: 'text-green-600',
    icon: Check,
    label: 'Ativo',
    value: 'ATIVO',
  },
  {
    color: 'text-amber-400',
    icon: Clock,
    label: 'Inativo',
    value: 'INATIVO',
  },
]

export function EncontreiroMontagemStatus({
  encontreiroId,
  status,
}: EncontreiroStatusProps) {
  const form = useForm<encontreiroStatusFormInput>({
    resolver: zodResolver(encontreiroStatusSchema),
  })

  const queryClient = useQueryClient()

  function updateEncontreiroStatusOnCache(
    encontreiroId: string,
    status: StatusEncontreiro,
  ) {
    const encontreiroListCache = queryClient.getQueriesData<EncontreiroSummary>(
      { queryKey: ['encontreiros'] },
    )

    encontreiroListCache.forEach(([cacheKey, cacheData]) => {
      if (!cacheData) return

      queryClient.setQueryData<EncontreiroSummary>(cacheKey, {
        ...cacheData,
        encontreiros: cacheData.encontreiros.map((encontreiro) => {
          if (encontreiro.id === encontreiroId) {
            return { ...encontreiro, idStatus: status }
          }
          return encontreiro
        }),
      })
    })
  }

  const { mutateAsync: statusEncontreiroFn } = useMutation({
    mutationFn: changeStatus,
    onSuccess: (_, { encontreiroId, status }) => {
      updateEncontreiroStatusOnCache(encontreiroId, status)
    },
  })

  function handleChangeStatus(selectData: encontreiroStatusFormInput) {
    const status = selectData.statusEncontreiro as StatusEncontreiro
    statusEncontreiroFn({ encontreiroId, status })
  }

  return (
    <Form {...form}>
      <form
        onChange={form.handleSubmit(handleChangeStatus)}
        className="flex items-center gap-2"
      >
        <FormField
          control={form.control}
          name="statusEncontreiro"
          defaultValue={status}
          render={({ field }) => {
            return (
              <div className="w-full">
                <FormItem>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="houtline-none text-xs">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statusData.map((statusItem) => {
                        return (
                          <SelectItemIcon
                            key={statusItem.value}
                            color={statusItem.color}
                            icon={statusItem.icon}
                            label={statusItem.label}
                            value={statusItem.value}
                          />
                        )
                      })}
                    </SelectContent>
                  </Select>
                </FormItem>
              </div>
            )
          }}
        />
      </form>
    </Form>
  )
}
