import type { EquipesMontagem } from '@/app/api/domains/equipes/montagem/get-equipes'
import type { EncontreiroMontagemSummary } from '@/app/api/encontreiro/montagem/get-montagem-summary'
import type { changeEquipeProps } from '@/app/api/montagem/alocate-equipe/alocate-equipe'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { api } from '@/lib/axios'
import { idPertenceARosa } from '@/utils/pertence'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'

export interface EncontreiroMontagemEquipeProps {
  idEncontreiro: string
  valueEquipe: string | null
  changeCoordStatus: (equipeValue: string) => void
}

async function getEquipes() {
  const response: EquipesMontagem[] = await api
    .get(`domains/equipes/montagem`)
    .then((response) => response.data)
    .catch((err) => {
      console.error(err)
      return []
    })

  return response
}

export async function changeEncontreiroEquipe({
  idEncontreiro,
  valueEquipe,
}: changeEquipeProps) {
  await api.post('montagem/alocate-equipe', {
    idEncontreiro,
    valueEquipe,
  })
}

export function EncontreiroMontagemEquipe({
  idEncontreiro,
  valueEquipe,
  changeCoordStatus,
}: EncontreiroMontagemEquipeProps) {
  const [selectEquipe, setSelectEquipe] = useState(
    valueEquipe || 'select_equipe',
  )
  const { data: equipes } = useQuery<EquipesMontagem[]>({
    queryKey: ['equipesMontagem'],
    queryFn: getEquipes,
  })

  const queryClient = useQueryClient()

  const { mutateAsync: changeEncontreiroEquipeFn } = useMutation({
    mutationFn: changeEncontreiroEquipe,

    onMutate: async ({ idEncontreiro, valueEquipe }) => {
      await queryClient.cancelQueries({ queryKey: ['encontreiros'] })

      const previousData =
        queryClient.getQueriesData<EncontreiroMontagemSummary>({
          queryKey: ['encontreiros'],
        })

      const coordStatus =
        valueEquipe === 'apresentacao' || idPertenceARosa(valueEquipe)

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
                    value: valueEquipe,
                    coordenando: coordStatus,
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

    onError: (_err, { valueEquipe }, context) => {
      toast.error('Erro ao atualizar a equipe. Tente novamente.')

      if (!context) return

      setSelectEquipe(valueEquipe)

      context.previousData.forEach(([cacheKey, cacheData]) => {
        queryClient.setQueryData(cacheKey, cacheData)
      })
    },

    onSuccess: (_err, { valueEquipe }) => {
      changeCoordStatus(valueEquipe)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['equipes'] })
    },
  })

  function handleChangeEncontreiroEquipe(valueEquipe: string) {
    setSelectEquipe(valueEquipe)
    changeEncontreiroEquipeFn({
      idEncontreiro,
      valueEquipe,
    })
  }

  return (
    <Select onValueChange={handleChangeEncontreiroEquipe} value={selectEquipe}>
      <SelectTrigger className="w-full text-xs">
        <SelectValue placeholder="Selecione uma equipe" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem key="select_equipe" value="select_equipe">
            Selecione uma equipe
          </SelectItem>
          {equipes &&
            equipes.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
