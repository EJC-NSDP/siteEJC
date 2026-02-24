import { ElementType } from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export interface NavItemGroupProps {
  title: string
  value: string
  icon: ElementType
  children: React.ReactNode
}

export function NavItemGroup({
  title,
  value,
  icon: Icon,
  children,
}: NavItemGroupProps) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value={value} className="border-none">
        <AccordionTrigger className="group hover:bg-primary/20 flex h-full w-full items-center gap-4 rounded-xl px-6 py-4 text-zinc-50">
          <div className="flex items-center gap-4">
            <Icon className="h-6 w-6 text-zinc-50" />
            <span className="text-sm font-medium text-nowrap text-zinc-50">
              {title}
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2 py-2 pl-4">
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
