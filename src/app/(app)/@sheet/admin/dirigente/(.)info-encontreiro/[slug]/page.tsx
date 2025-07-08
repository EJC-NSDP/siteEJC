import { CardEncontreiro } from '@/app/(app)/admin/dirigente/info-encontreiro/[slug]/CardEncontreiro'
import type { EncontreiroMontagemData } from '@/app/api/montagem/[slug]/get-encontreiro'
import { InterceptedSheetContent } from '@/components/intercepted-sheet-content'
import { Sheet, SheetTitle } from '@/components/ui/sheet'

async function getEncontreiroData(slug: string) {
  return await fetch(`${process.env.NEXTAUTH_URL}/api/montagem/${slug}`, {
    cache: 'no-store',
  }).then(async (res) => await res.json())
}

export default async function SheetEncontreiroScan(props: {
  params: Promise<{ slug: string }>
}) {
  const encontreiro: EncontreiroMontagemData = await getEncontreiroData(
    (await props.params).slug,
  )
  return (
    <Sheet defaultOpen>
      <InterceptedSheetContent side="bottom">
        <SheetTitle className="px-4" hidden>
          Informações do {encontreiro.apelido}
        </SheetTitle>
        <div className="px-0 pt-4 lg:px-4">
          <CardEncontreiro encontreiro={encontreiro} sheet />
        </div>
      </InterceptedSheetContent>
    </Sheet>
  )
}
