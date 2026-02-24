'use client'

import dayjs from 'dayjs'

import type { CurrentEncontro } from '@/app/api/encontro/atual/[ignorar]/get-current-encontro/get-current-encontro'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getMonthBR } from '@/utils/get-month-locale'

interface EncontroCardProps {
  currentEncontro: CurrentEncontro
}

export function EncontroCard({ currentEncontro  }: EncontroCardProps) {

  return (
    <Card className="w-full border-none bg-zinc-100 p-4 px-2 lg:w-2/6 lg:p-8">
      <CardContent className="flex flex-col justify-start gap-4">
        <div>
          <h4 className="text-sm text-zinc-400">Edição</h4>
          {!currentEncontro ? (
            <Skeleton className="h-5 w-14" />
          ) : (
            <span className="text-zinc-700">
              {currentEncontro.numeroEncontro}º EJC
            </span>
          )}
        </div>
        <div>
          <h4 className="text-sm text-zinc-400">Data</h4>
          {!currentEncontro ? (
            <Skeleton className="h-5 w-36" />
          ) : (
            <span className="text-zinc-700">
              {dayjs(currentEncontro.dataInicio).format('DD')} de{' '}
              {getMonthBR(currentEncontro.dataInicio)} de{' '}
              {dayjs(currentEncontro.dataInicio).format('YYYY')}
            </span>
          )}
        </div>
        <div>
          <h4 className="text-sm text-zinc-400">Local</h4>
          {!currentEncontro ? (
            <Skeleton className="h-5 w-48" />
          ) : (
            <span className="text-zinc-700">
              {currentEncontro.local.nomeLocal}
            </span>
          )}
        </div>
        <div>
          <h4 className="text-sm text-zinc-400">Tema espiritual</h4>
          {!currentEncontro ? (
            <Skeleton className="h-5 w-44" />
          ) : (
            <span className="text-zinc-700">
              {currentEncontro.temaEspiritual}
            </span>
          )}
        </div>
        <div>
          <h4 className="text-sm text-zinc-400">Tema fantasia</h4>
          {!currentEncontro ? (
            <Skeleton className="h-5 w-14" />
          ) : (
            <span className="text-zinc-700">
              {currentEncontro.temaFantasia}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
