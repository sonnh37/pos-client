import { Product } from "@/types/entities/product";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { ProductCard } from "./product-cart";

interface ProductsGridProps {
  products: Product[];
  isLoading: boolean;
  searchQuery: string;
  onClearFilters: () => void;
}

export function ProductsGrid({
  products,
  isLoading,
  searchQuery,
  onClearFilters,
}: ProductsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-0">
              <Skeleton className="h-40 w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border">
        <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-700">
          Không tìm thấy sản phẩm
        </h3>
        <p className="text-gray-500 mt-1">
          {searchQuery
            ? `Không có sản phẩm nào phù hợp với "${searchQuery}"`
            : "Không có sản phẩm nào trong danh mục này"}
        </p>
        {searchQuery && (
          <Button variant="outline" className="mt-4" onClick={onClearFilters}>
            Xóa bộ lọc
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
