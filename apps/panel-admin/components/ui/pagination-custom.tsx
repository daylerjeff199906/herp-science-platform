'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize?: number
  siblingCount?: number
  className?: string
}

export function PaginationCustom({
  currentPage,
  totalPages,
  totalItems,
  pageSize = 10,
  siblingCount = 1,
  className,
}: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const generatePagination = () => {
    const pages: (number | string)[] = []

    if (totalPages <= 5 + siblingCount * 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      const leftSibling = Math.max(currentPage - siblingCount, 1)
      const rightSibling = Math.min(currentPage + siblingCount, totalPages)

      const showLeftDots = leftSibling > 2
      const showRightDots = rightSibling < totalPages - 1

      if (!showLeftDots && showRightDots) {
        for (let i = 1; i <= 3 + siblingCount * 2; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (showLeftDots && !showRightDots) {
        pages.push(1)
        pages.push('...')
        for (
          let i = totalPages - (2 + siblingCount * 2);
          i <= totalPages;
          i++
        ) {
          pages.push(i)
        }
      } else if (showLeftDots && showRightDots) {
        pages.push(1)
        pages.push('...')
        for (let i = leftSibling; i <= rightSibling; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }

  const pages = generatePagination()

  if (totalPages <= 1) return null

  return (
    <div className={cn('flex items-center justify-between px-2', className)}>
      <div className="text-xs text-muted-foreground">
        Mostrando{' '}
        <strong>
          {startItem}-{endItem}
        </strong>{' '}
        de <strong>{totalItems}</strong> resultados
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1 px-2">
          {pages.map((page, index) =>
            page === '...' ? (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-xs text-muted-foreground"
              >
                ...
              </span>
            ) : (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                size="sm"
                className="h-8 w-8 text-xs"
                onClick={() => handlePageChange(page as number)}
              >
                {page}
              </Button>
            )
          )}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
