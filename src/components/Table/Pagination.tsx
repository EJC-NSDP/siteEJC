import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../ui/button'
import { TableCell, TableRow } from '../ui/table'

export interface PaginationProps {
  pageIndex: number
  perPage: number
  totalCount: number
  totalCol: number
  onPageChange: (pageIndex: number) => Promise<void> | void
}

export function Pagination({
  pageIndex,
  perPage,
  totalCount,
  onPageChange,
  totalCol,
}: PaginationProps) {
  const totalPages = Math.ceil(totalCount / perPage) || 1
  const firstOnPage = (pageIndex - 1) * perPage + 1
  const lastOnPage =
    pageIndex - 1 === totalPages - 1
      ? firstOnPage - 1 + (totalCount % perPage || perPage)
      : firstOnPage - 1 + perPage

  const spanLeft = totalCol / 2
  const spanRight = totalCol / 2 + (totalCol % 2)

  const getPages = () => {
    const visiblePages = 10
    const pages: (number | 'dots')[] = []

    if (totalPages <= visiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const currentPage = pageIndex + 1 // Convertendo para base 1
    const firstPages = [1, 2]
    const lastPages = [totalPages - 1, totalPages]

    const middlePages = []

    // Determina o range do meio
    const start = Math.max(currentPage - 2, 3)
    const end = Math.min(currentPage, totalPages - 2)

    for (let i = start; i <= end; i++) {
      middlePages.push(i)
    }

    const shouldShowLeftDots = start > 3
    const shouldShowRightDots = end < totalPages - 2

    if (shouldShowLeftDots) {
      pages.push(...firstPages, 'dots')
    } else {
      pages.push(...Array.from({ length: start - 1 }, (_, i) => i + 1))
    }

    pages.push(...middlePages)

    if (shouldShowRightDots) {
      pages.push('dots', ...lastPages)
    } else {
      pages.push(
        ...Array.from({ length: totalPages - end }, (_, i) => end + 1 + i),
      )
    }

    return pages
  }

  const pageNumbers = getPages()

  return (
    <TableRow>
      <TableCell colSpan={spanLeft} className="rounded-bl-xl">
        <span className="text-muted-foreground text-sm">
          {firstOnPage}-{lastOnPage} de {totalCount}
        </span>
      </TableCell>
      <TableCell colSpan={spanRight} className="rounded-br-xl">
        <div className="flex items-center justify-end gap-2 space-x-2">
          <Button
            onClick={() => onPageChange(pageIndex - 2)}
            variant="ghost"
            className="flex gap-1 disabled:opacity-50"
            disabled={pageIndex === 1}
          >
            <ChevronLeft className="h-4 w-4 text-tertiary" />
            <span className="font-medium text-tertiary">Anterior</span>
          </Button>

          {pageNumbers.map((item, index) =>
            item === 'dots' ? (
              <span
                key={`dots-${index}`}
                className="text-muted-foreground px-2 text-sm"
              >
                ...
              </span>
            ) : (
              <Button
                key={item}
                onClick={() => onPageChange(item - 1)}
                variant="ghost"
                className="flex gap-1"
                disabled={pageIndex === item}
              >
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full ${
                    pageIndex === item
                      ? 'bg-primary text-zinc-50'
                      : 'bg-violet-200 text-tertiary hover:bg-violet-100'
                  }`}
                >
                  <span>{item}</span>
                </div>
              </Button>
            ),
          )}

          <Button
            onClick={() => onPageChange(pageIndex)}
            variant="ghost"
            className="flex gap-1 disabled:opacity-50"
            disabled={totalPages <= pageIndex + 1}
          >
            <span className="font-medium text-tertiary">Próximo</span>
            <ChevronRight className="h-4 w-4 text-tertiary" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
