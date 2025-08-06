import type { EquipeThisEncontro } from '@/app/api/encontro/atual/[ignorar]/equipe/[value]/get-equipe'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { getEquipeColor } from '@/utils/fetch-color'
import { idPertenceARosa, idPertenceASala } from '@/utils/pertence'
import { Download, FolderOpen } from 'lucide-react'
import Link from 'next/link'
import { EncontreirosEquipeTable } from './(table-equipe)/encontreiros-equipe-table'

async function getEncontreirosEquipe(equipeValue: string) {
  const response = await fetch(
    `${process.env.NEXTAUTH_URL}/api/encontro/atual/1/equipe/${equipeValue}`,
    { cache: 'no-store' },
  ).then(async (res) => await res.json())

  return response
}

export default async function EquipeValue(props: {
  params: Promise<{ value: string }>
}) {
  const equipe: EquipeThisEncontro = await getEncontreirosEquipe(
    (await props.params).value,
  )

  const corEquipe = getEquipeColor(equipe.idEquipe)

  const adaptEquipeName = idPertenceARosa(equipe.idEquipe)
    ? 'Rosa'
    : idPertenceASala(equipe.idEquipe)
      ? 'Sala'
      : equipe.equipeLabel

  return (
    <div className="w-full p-4 lg:px-24 lg:py-8">
      <Card className="w-full overflow-hidden rounded-xl border-zinc-50">
        <div className={cn('h-8 w-full lg:h-8', corEquipe)} />
        <CardTitle className="flex justify-between px-4 py-4 lg:px-8 lg:py-8">
          <span className="text-xl text-zinc-800 lg:text-3xl">
            {adaptEquipeName}
          </span>
          <div className="flex gap-4">
            {equipe.idEquipe === 'cozinha' && (
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
            {equipe.idEquipe === 'vigilia' && (
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
            {equipe.idEquipe === 'vigilia' && (
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
            {equipe.idEquipe === 'dirigente' && (
              <Link href="/api/export/dirigente/encontreiros">
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
            {equipe.idEquipe !== 'dirigente' && (
              <Link href={equipe.pastaUrl}>
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
            equipe={equipe.encontreiros}
            labelEquipe={equipe.equipeLabel}
          />
        </CardContent>
      </Card>
    </div>
  )
}
