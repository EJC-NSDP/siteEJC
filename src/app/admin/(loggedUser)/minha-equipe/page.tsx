'use client'

import type { MinhaEquipe } from '@/app/api/encontreiro/[id]/equipe/get-equipe'
import { CardLoading } from '@/components/CardLoading'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/axios'
import { cn } from '@/lib/utils'
import { getEquipeColor } from '@/utils/fetch-color'
import { idPertenceARosa, idPertenceASala } from '@/utils/pertence'
import { useQuery } from '@tanstack/react-query'
import { FolderOpen } from 'lucide-react'
import { getSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { EncontreirosEquipeTable } from './(table-equipe)/encontreiros-equipe-table'

async function getEncontreirosEquipe(id: string) {
  const response: MinhaEquipe = await api
    .get(`encontreiro/${id}/equipe`)
    .then((response) => response.data)
    .catch((err) => console.error(err))

  return response
}

export default function MinhaEquipe() {
  // const tempIdDiri = '6b53a4f9-e4e7-4708-b623-c7a2e00b5269' // Clara
  // const tempIdSala = '3a8634a5-b729-411c-9ae1-e113c40c8638' // Lou
  // const tempIdEquipeComTropa = 'cddc8bdf-5cff-45f5-9e94-6c82f763effd' // Esther (Mini)

  const [sessionId, setSessionId] = useState<string | undefined>(undefined)
  const [corEquipe, setCorEquipe] = useState<string>('bg-zinc-200')
  const [equipeName, setEquipeName] = useState<string>('Carregando...')

  const { data: result } = useQuery<MinhaEquipe>({
    queryKey: ['encontreiros', sessionId],
    queryFn: () => getEncontreirosEquipe(sessionId!),
    enabled: !!sessionId,
  })

  useEffect(() => {
    async function fetchSession() {
      const session = await getSession()
      if (session) {
        setSessionId(session.user.id)
      }
    }
    fetchSession()
  }, [])

  useEffect(() => {
    async function fetchEquipeHeader() {
      if (result) {
        setCorEquipe(getEquipeColor(result.idEquipe))
        const adaptEquipeName = idPertenceARosa(result.idEquipe)
          ? 'Rosa'
          : idPertenceASala(result.idEquipe)
            ? 'Sala'
            : result.equipeLabel

        setEquipeName(adaptEquipeName)
      }
    }
    fetchEquipeHeader()
  }, [result])

  return (
    <div className="w-full p-4 lg:px-24 lg:py-8">
      {!result ? (
        <CardLoading />
      ) : (
        <Card className="w-full overflow-hidden rounded-xl border-zinc-50">
          <div className={cn('h-8 w-full lg:h-8', corEquipe)} />
          <CardTitle className="flex justify-between px-4 py-4 lg:px-8 lg:py-8">
            <span className="text-xl text-zinc-800  lg:text-3xl">
              {equipeName}
            </span>
            {result.idEquipe !== 'dirigente' && (
              <Link href={result.pastaUrl}>
                <Button
                  variant="default"
                  className="flex items-center gap-4 text-tertiary"
                >
                  <FolderOpen className="h-6 w-6" />
                  <span className="text-sm font-medium">Pasta Virtual</span>
                </Button>
              </Link>
            )}
          </CardTitle>
          <CardContent className="flex flex-col gap-4 lg:flex-row lg:gap-8">
            <EncontreirosEquipeTable
              equipe={result.encontreiros}
              labelEquipe={result.equipeLabel}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
