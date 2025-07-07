import type { EncontreiroMontagemSummary } from '@/app/api/encontreiro/montagem/get-montagem-summary'
import type { changeCoordStatusProps } from '@/app/api/montagem/change-coord-status/change-equipe-montagem'

import { Checkbox } from '@/components/ui/checkbox'
import { api } from '@/lib/axios'
import type { CheckedState } from '@radix-ui/react-checkbox'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'

export interface EncontreiroMontagemCoordProps {
  idEncontreiro: string
  coordStatus: boolean
}

export async function changeCoordStatus({
  idEncontreiro,
  coordenando,
}: changeCoordStatusProps) {
  return await api.patch('montagem/change-coord-status', {
    idEncontreiro,
    coordenando,
  })
}

export function EncontreiroMontagemCoord({
  idEncontreiro,
  coordStatus,
}: EncontreiroMontagemCoordProps) {
  const [check, setCheck] = useState(coordStatus)
  const queryClient = useQueryClient()

  const { mutateAsync: coordStatusFn } = useMutation({
    mutationFn: changeCoordStatus,

    onMutate: async ({ idEncontreiro, coordenando }) => {
      await queryClient.cancelQueries({ queryKey: ['encontreiros'] })

      // Atualiza UI imediatamente
      setCheck(coordenando)

      const previousData =
        queryClient.getQueriesData<EncontreiroMontagemSummary>({
          queryKey: ['encontreiros'],
        })

      previousData.forEach(([cacheKey, cacheData]) => {
        if (!cacheData) return

        queryClient.setQueryData<EncontreiroMontagemSummary>(cacheKey, {
          ...cacheData,
          encontreiros: cacheData.encontreiros.map((encontreiro) => {
            if (encontreiro.id === idEncontreiro && encontreiro.equipe) {
              return {
                ...encontreiro,
                encontreiro: {
                  equipe: {
                    value: encontreiro.equipe.value,
                    coordenando,
                  },
                },
              }
            }
            return encontreiro
          }),
        })
      })

      return { previousData }
    },

    onError: (_err, _variables, context) => {
      toast.error('Erro ao alterar o status de coordenação.')

      if (!context) return

      context.previousData.forEach(([cacheKey, cacheData]) => {
        queryClient.setQueryData(cacheKey, cacheData)
      })

      // Reverte o check do checkbox
      setCheck((prev) => !prev)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['equipes'] })
    },
  })

  function handleChangeOnCoordStatus(checked: boolean) {
    coordStatusFn({
      idEncontreiro,
      coordenando: checked,
    })
  }

  async function updateCoordStatus(checked: CheckedState) {
    if (checked !== 'indeterminate') {
      handleChangeOnCoordStatus(checked)
    }
  }

  return (
    <Checkbox
      id={idEncontreiro}
      checked={check}
      onCheckedChange={updateCoordStatus}
    />
  )
}
