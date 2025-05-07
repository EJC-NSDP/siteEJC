'use client'

import LogoEJCColorido from '@/assets/LogoEJCColorido'
import { Menu } from 'lucide-react'
import { Button } from '../ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible'
import { FooterNavigation } from './FooterNavigation'
import { MainNavigation } from './MainNavigation'

export function DirigenteSidebar() {
  return (
    <Collapsible className="z-20 flex flex-col gap-12 bg-tertiary p-4 lg:h-full lg:min-h-screen lg:px-2 lg:py-12">
      <div className="flex items-center justify-between lg:justify-center">
        <LogoEJCColorido />
        <CollapsibleTrigger asChild className="lg:hidden">
          <Button variant="ghost">
            <Menu className="h-6 w-6" />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent
        forceMount
        className="flex flex-1 flex-col gap-12 data-[state=closed]:hidden lg:data-[state=closed]:flex"
      >
        <MainNavigation />
        <FooterNavigation />
      </CollapsibleContent>
    </Collapsible>
  )
}
