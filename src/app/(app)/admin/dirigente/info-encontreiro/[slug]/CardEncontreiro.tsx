'use client'

import { ArrowLeft, Baby, Instagram } from 'lucide-react'
import Link from 'next/link'

import type { EncontreiroMontagemData } from '@/app/api/montagem/[slug]/get-encontreiro'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { cleanValueEnum } from '@/utils/clean-value-enum'
import { getCirculoColor } from '@/utils/fetch-color'
import { getInitials } from '@/utils/get-initials'

interface CardEncontreiroProps {
  encontreiro: EncontreiroMontagemData
  sheet?: boolean
}

export function CardEncontreiro({
  encontreiro,
  sheet = false,
}: CardEncontreiroProps) {
  return (
    <Card className={cn('w-full rounded-xl border-none shadow-2xl')}>
      <div
        className={cn(
          'h-12 w-full rounded-t-xl',
          getCirculoColor(encontreiro.corCirculo || ''),
        )}
      />
      <CardTitle className="flex -translate-y-10 items-center gap-4 px-4 py-0 lg:-translate-y-6 lg:gap-8 lg:px-8">
        <Avatar className="size-24 ring-4 ring-white lg:size-44">
          <AvatarImage src={encontreiro.avatarUrl} />
          <AvatarFallback>
            {encontreiro.nome !== '-' ? getInitials(encontreiro.nome) : '-'}
          </AvatarFallback>
        </Avatar>
        <div className="flex h-32 w-full translate-y-9 items-center justify-between gap-8 lg:translate-y-6">
          <div className="flex w-full flex-col font-bold">
            <h2 className="text-base text-zinc-800 lg:text-2xl">
              {`${encontreiro.nome} (${encontreiro.apelido})`}
            </h2>
            <span className="text-xs text-zinc-500 lg:text-xl">
              {`${encontreiro.numeroEncontro || '?'}º EJC`}
            </span>
            <div className="flex w-full items-center justify-between pt-2">
              <div className="flex items-center gap-4">
                {encontreiro.instagram && (
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="text-tertiary disabled:cursor-auto disabled:opacity-50"
                    asChild
                  >
                    <a
                      href={`https://www.instagram.com/${encontreiro.instagram}/`}
                      target="_blank"
                    >
                      <Instagram className="size-5" />
                    </a>
                  </Button>
                )}

                {encontreiro.statusMontagem === 'CONVIDADO_ESPECIAL' && (
                  <Tooltip>
                    <TooltipTrigger>
                      <Baby className="size-5 cursor-auto" />
                    </TooltipTrigger>
                    <TooltipContent className="w-40 text-center">
                      <span className="text-zinc-400">Convidado especial</span>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              {!sheet && (
                <Link href={`/admin/dirigente/montagem`}>
                  <Button
                    variant="outline"
                    className="border-primary/80 flex items-center gap-2"
                  >
                    <ArrowLeft className="text-primary size-5" />
                    <span className="hidden text-base lg:flex">Voltar</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </CardTitle>
      <CardContent className="flex flex-col gap-8 pt-0 lg:flex-row">
        <ScrollArea className="h-60 w-full rounded-md bg-zinc-100 lg:h-auto lg:w-1/2">
          <div className="w-full p-8">
            <div className="flex w-full flex-col gap-8 lg:flex-row">
              <div className="flex flex-col gap-4 lg:w-2/3">
                <div>
                  <h4 className="mb-4 text-xl leading-none font-bold lg:text-2xl">
                    Informações gerais
                  </h4>
                  <h4 className="text-xs text-zinc-400">Bairro</h4>
                  <span className="text-base font-semibold text-zinc-700 lg:text-lg">
                    {encontreiro.bairro}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs text-zinc-400">Toca instrumento?</h4>
                  <span className="text-base font-semibold text-zinc-700 lg:text-lg">
                    {encontreiro.obsBanda || '-'}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs text-zinc-400">
                    Disponibilidade no pré-encontro
                  </h4>
                  <span className="text-base font-semibold text-zinc-700 lg:text-lg">
                    {encontreiro.disponibilidade
                      ? cleanValueEnum(encontreiro.disponibilidade)
                      : cleanValueEnum('NAO_PREENCHEU')}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs text-zinc-400">Observações</h4>
                  <span className="text-base font-semibold text-zinc-700 lg:text-xl">
                    {encontreiro.obs || '-'}
                  </span>
                </div>
              </div>
              <div className="lg:w-1/3">
                <h4 className="mb-4 text-lg leading-none font-bold text-nowrap lg:text-xl">
                  Lista de preferência
                </h4>
                {encontreiro.preferencias.length > 0 ? (
                  encontreiro.preferencias.map((preferencia) => (
                    <div key={preferencia.posicao}>
                      <div className="flex items-center justify-between text-sm">
                        {preferencia.posicao}º - {preferencia.equipe}
                      </div>
                      <Separator className="my-2" />
                    </div>
                  ))
                ) : (
                  <span className="text-sm text-zinc-500">Não preenchido</span>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        <ScrollArea className="h-40 w-full rounded-md bg-zinc-100 lg:h-88 lg:w-1/2">
          <div className="w-full p-8">
            <h4 className="mb-4 text-xl leading-none font-bold lg:text-2xl">
              Últimas equipes
            </h4>
            {encontreiro.equipeEncontro.length > 0 ? (
              encontreiro.equipeEncontro.map((equipe) => (
                <div key={equipe.encontro}>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <div className="text-nowrap">
                      {equipe.encontro}º - {equipe.equipe}
                    </div>
                    <div> {equipe.coordenou && <Badge>C</Badge>}</div>
                  </div>
                  <Separator className="my-2" />
                </div>
              ))
            ) : (
              <span className="text-sm text-zinc-500">Nunca trabalhou</span>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
