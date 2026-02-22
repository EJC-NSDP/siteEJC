import Link from 'next/link'
import type { ElementType } from 'react'

import { Button } from '@/components/ui/button'

export interface ButtonLabelProps {
  label: string
  icon: ElementType
  link: string
}

export function ButtonLabel({ label, icon: Icon, link }: ButtonLabelProps) {
  return (
    <Link
      href={link}
      className="text-tertiary flex w-full flex-row items-center justify-start gap-4 text-center lg:w-16 lg:flex-col"
    >
      <Button>
        <Icon className="h-6 w-6" />
      </Button>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  )
}
