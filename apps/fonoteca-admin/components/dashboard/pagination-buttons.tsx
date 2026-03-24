"use client"

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function PaginationButtons({
  totalCount,
  pageSize = 10,
}: {
  totalCount: number;
  pageSize?: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentPage = Number(searchParams.get("page")) || 1;
  const totalPages = Math.ceil(totalCount / pageSize);

  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  }

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-2 px-2 py-4">
      <div className="text-sm text-muted-foreground">
        Mostrando {Math.min((currentPage - 1) * pageSize + 1, totalCount)} - {Math.min(currentPage * pageSize, totalCount)} de {totalCount} resultados
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => setPage(currentPage - 1)}
        >
          <ChevronLeft className="h-4 w-4" /> Anterior
        </Button>
        <div className="text-sm font-medium">
          Página {currentPage} de {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => setPage(currentPage + 1)}
        >
          Siguiente <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
