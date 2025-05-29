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
import { Download, FolderOpen } from 'lucide-react'
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
            <span className="text-xl text-zinc-800 lg:text-3xl">
              {equipeName}
            </span>
            <div className="flex gap-4">
              {result.idEquipe === 'cozinha' && (
                <Link href="/api/export/cozinha">
                  <Button
                    variant="secondary"
                    className="flex items-center gap-2 text-tertiary"
                  >
                    <Download className="size-4 text-tertiary" />
                    <span className="text-sm font-medium">
                      Baixar Restrições Alimentares
                    </span>
                  </Button>
                </Link>
              )}
              {result.idEquipe === 'vigilia' && (
                <Link href="/api/export/vigilia/encontreiros">
                  <Button
                    variant="secondary"
                    className="flex items-center gap-2 text-tertiary"
                  >
                    <Download className="size-4 text-tertiary" />
                    <span className="text-sm font-medium">
                      Baixar Lista de Encontreiros
                    </span>
                  </Button>
                </Link>
              )}
              {result.idEquipe === 'vigilia' && (
                <Link href="/api/export/vigilia/encontristas">
                  <Button
                    variant="secondary"
                    className="flex items-center gap-2 text-tertiary"
                  >
                    <Download className="size-4 text-tertiary" />
                    <span className="text-sm font-medium">
                      Baixar Lista de Encontristas
                    </span>
                  </Button>
                </Link>
              )}
              {result.idEquipe !== 'dirigente' && (
                <Link href={result.pastaUrl}>
                  <Button
                    variant="default"
                    className="flex items-center gap-2 text-tertiary"
                  >
                    <FolderOpen className="size-4" />
                    <span className="text-sm font-medium">Pasta Virtual</span>
                  </Button>
                </Link>
              )}
            </div>
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
