import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  pageCount: number;
  pageSize: number;
  totalItems: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  onPageChange: (pageNumber: number) => void;
}

export function Pagination({
  currentPage,
  pageCount,
  pageSize,
  totalItems,
  hasPreviousPage,
  hasNextPage,
  onPageChange,
}: PaginationProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  if (pageCount <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 p-4 bg-white rounded-lg border">
      <div className="text-sm text-gray-600">
        Hiển thị{" "}
        <span className="font-medium">
          {startItem}-{endItem}
        </span>{" "}
        trong <span className="font-medium">{totalItems}</span> sản phẩm
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPreviousPage}
        >
          <ChevronLeft className="h-4 w-4" />
          Trước
        </Button>

        <div className="flex items-center gap-1">
          {[...Array(pageCount)].map((_, i) => {
            const page = i + 1;
            // Chỉ hiển thị một số trang xung quanh trang hiện tại
            if (
              page === 1 ||
              page === pageCount ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  className="w-10 h-10"
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </Button>
              );
            }
            // Hiển thị dấu ... cho các trang bị ẩn
            if (page === currentPage - 2 || page === currentPage + 2) {
              return (
                <span key={page} className="px-2">
                  ...
                </span>
              );
            }
            return null;
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
        >
          Sau
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
