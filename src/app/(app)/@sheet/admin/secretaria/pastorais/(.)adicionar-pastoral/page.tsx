import { AdicionarPastoralForm } from '@/app/(app)/admin/secretaria/pastorais/(form)/AdicionarPastoralForm'
import { InterceptedSheetContent } from '@/components/intercepted-sheet-content'
import { Sheet, SheetHeader, SheetTitle } from '@/components/ui/sheet'

export default function SheetAdicionarPastoral() {
  return (
    <Sheet defaultOpen>
      <InterceptedSheetContent side="bottom">
        <SheetHeader>
          <SheetTitle className="px-4 text-zinc-700">
            Adicionar encontreiro a pastoral
          </SheetTitle>
        </SheetHeader>

        <div className="p-4">
          <AdicionarPastoralForm sheet />
        </div>
      </InterceptedSheetContent>
    </Sheet>
  )
}
