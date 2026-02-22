import { Anton } from 'next/font/google'
import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/utils'

const anton = Anton({
  weight: ['400'],
  subsets: ['latin'],
})

export interface QuadrantePeoplePageProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  titleColor?: string
  description?: string
  children: ReactNode
}

export function QuadranteTitlePage({
  title,
  titleColor,
  description,
  children,
  ...pros
}: QuadrantePeoplePageProps) {
  return (
    <div className="mt-0 flex flex-col gap-8" {...pros}>
      <div
        className={cn(
          anton.className,
          'flex flex-col items-center gap-6 py-4 text-center',
        )}
      >
        <h1
          className={cn(
            titleColor || 'text-black',
            'w-full text-center text-8xl font-bold tracking-wider',
          )}
        >
          {title.toUpperCase()}
        </h1>
        {description && (
          <h2 className="w-4/5 text-2xl text-pretty text-zinc-800 italic">
            {description}
          </h2>
        )}
      </div>
      {children}
    </div>
  )
}
