import { useState, useEffect } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Truck } from "lucide-react";

export function ControlePaginacao({
  items = [],
  renderItem,
  itemsPerPage = 9,
  gridClassName = "grid gap-4 md:grid-cols-2 lg:grid-cols-3",
  showInfo = true
}) {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset para página 1 quando os itens mudarem(aumentar ou diminuir)
  useEffect(() => {
    setCurrentPage(1);
  }, [items.length]);

  // Calcular índices dos cards
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  //quantidade de páginas para a quantidade de cards -> Quantidade total de cars pela de cards por página =6;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Gerar números de páginas
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  // Se não houver itens, mostrar mensagem
  if (items.length === 0) {
    return (
      <div className="flex flex-col gap-5 text-center py-12 text-muted-foreground items-center">
        Nenhum item encontrado
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Grid de itens */}
      <div className={gridClassName}>
        {currentItems.map((item) => renderItem(item))}
      </div>

      {/* Informações de quantidade */}
      {showInfo && items.length > itemsPerPage && (
        <div className="text-sm text-muted-foreground text-center">
          Mostrando {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, items.length)} de {items.length} itens
        </div>
      )}

      {/* Paginação */}
      {items.length > itemsPerPage && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>

            {getPageNumbers().map((page, index) => (
              <PaginationItem key={index}>
                {page === '...' ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
