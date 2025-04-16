import type { encontreiroEmEquipe } from '@/app/api/encontreiro/[id]/profile/get-profile'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { generateFallBack } from '@/utils/generate-fallback'

interface AvatarGroupProps {
  encontreiros: encontreiroEmEquipe[]
  loose?: boolean
}

export default function AvatarGroup({
  encontreiros,
  loose = false,
}: AvatarGroupProps) {
  const spacing = loose ? 'gap-6' : '-space-x-2 space-x-reverse'

  const tropa =
    encontreiros.length > 5 ? encontreiros.slice(0, 5) : encontreiros

  return (
    <div
      className={cn(
        'flex flex-row-reverse justify-end *:ring *:ring-white',
        spacing,
      )}
    >
      {encontreiros.length > 5 && (
        <Avatar key="tropa">
          <AvatarFallback className="bg-zinc-200 pl-1.5 text-sm">
            +{encontreiros.length - 5}
          </AvatarFallback>
        </Avatar>
      )}

      {tropa.map((encontreiro, index) => {
        const avatarFallback = generateFallBack(encontreiro.nome)
        return (
          <Avatar key={index} title={encontreiro.nome}>
            <AvatarImage
              src={encontreiro.avatarUrl ? encontreiro.avatarUrl : undefined}
            />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
        )
      })}
    </div>
  )
}
