import { EditarBPsForm } from '@/app/(app)/admin/dirigente/(sidebar-area)/diris-bps/(form)/EditarBPsForm'
import { InterceptedSheetContent } from '@/components/intercepted-sheet-content'
import { Sheet, SheetHeader, SheetTitle } from '@/components/ui/sheet'

export default function SheetEditarBPs() {
  return (
    <Sheet defaultOpen>
      <InterceptedSheetContent side="bottom">
        <SheetHeader>
          <SheetTitle className="px-4 text-zinc-700">Editar BPs</SheetTitle>
        </SheetHeader>

        <div className="p-4">
          <EditarBPsForm sheet />
        </div>
      </InterceptedSheetContent>
    </Sheet>
  )
}
