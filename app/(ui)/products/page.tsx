"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { productService } from "@/services/product-service";
import { orderService } from "@/services/order-service";
import { Product, ProductStatus } from "@/types/entities/product";
import { processResponse } from "@/lib/utils";
import { Status } from "@/types/models/business-result";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { Package, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProductGetAllQuery } from "@/types/cqrs/queries/product-query";
import { QueryResult } from "@/types/models/query-result";
import { FilterBar } from "@/components/pos/filter-bar";
import { Pagination } from "@/components/pos/pagination";
import { Cart } from "@/components/pos/cart";
import { ProductsGrid } from "@/components/pos/product-grid";
import { formatPrice } from "@/lib/utils/number-utils";
import { Item, OrderCreateCommand } from "@/types/cqrs/commands/order-command";

export default function PosScreen() {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart.items);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Pagination states
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 12,
    pageCount: 1,
    totalItemCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalProducts = products.filter((p) => !p.isDeleted).length;
  const activeProducts = products.filter(
    (p) => p.status === ProductStatus.Available
  ).length;

  // ===== Build query =====
  // Trong main component, xử lý filter
  const buildQuery = (): ProductGetAllQuery => {
    const query: ProductGetAllQuery = {
      pagination: {
        isPagingEnabled: true,
        pageNumber: pagination.pageNumber,
        pageSize: pagination.pageSize,
      },
      name: searchQuery || undefined,
    };

    // Map filter string sang ProductStatus
    if (activeFilter === "available") {
      query.status = ProductStatus.Available;
    } else if (activeFilter === "outofstock") {
      query.status = ProductStatus.OutOfStock;
    } else if (activeFilter === "comingsoon") {
      query.status = ProductStatus.ComingSoon;
    } else if (activeFilter === "discontinued") {
      query.status = ProductStatus.Discontinued;
    }

    return query;
  };

  // ===== Fetch products =====
  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const query = buildQuery();
      const res = await productService.getAll(query);
      processResponse(res);

      const queryResult = res.data as QueryResult<Product>;
      setProducts(queryResult.results || []);

      // Update pagination info from API response
      setPagination((prev) => ({
        ...prev,
        pageCount: queryResult.pageCount || 1,
        totalItemCount: queryResult.totalItemCount || 0,
        hasPreviousPage: queryResult.hasPreviousPage || false,
        hasNextPage: queryResult.hasNextPage || false,
      }));
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Lỗi khi tải sản phẩm");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Initial fetch and refetch when filters/pagination change
  useEffect(() => {
    fetchProducts();
  }, [pagination.pageNumber, pagination.pageSize, activeFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.pageNumber === 1) {
        fetchProducts();
      } else {
        // Reset to first page when searching
        setPagination((prev) => ({ ...prev, pageNumber: 1 }));
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ===== Handle page change =====
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= pagination.pageCount) {
      setPagination((prev) => ({ ...prev, pageNumber }));
    }
  };

  // ===== Checkout =====
  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setLoading(true);
    try {
      const createCommand: OrderCreateCommand = {
        items: cart.map(
          (i) =>
            ({
              productId: i.id,
              quantity: i.quantity,
            } as Item)
        ),
      };
      const res = await orderService.create(createCommand);
      processResponse(res);

      toast.success("Thanh toán thành công", {
        description: `Đơn hàng đã được xử lý. Tổng tiền: ${formatPrice(
          res.data?.totalAmount ?? 0
        )}`,
      });
    } catch (error) {
      toast.error("Thanh toán thất bại");
    } finally {
      setLoading(false);
    }
  };

  // ===== Clear filters =====
  const handleClearFilters = () => {
    setSearchQuery("");
    setActiveFilter("all");
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Hệ thống bán hàng POS
              </h1>
              <p className="text-gray-600 mt-1">
                Quản lý bán hàng nhanh chóng và hiệu quả
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border">
                <Package className="h-5 w-5 text-blue-500" />
                <div className="text-sm">
                  <div className="font-medium">{totalProducts} sản phẩm</div>
                  <div className="text-xs text-gray-500">
                    {activeProducts} đang bán
                  </div>
                </div>
              </div>

              <div className="relative">
                <Badge className="absolute -top-2 -right-2 px-2 py-1 min-w-[24px] h-6 flex items-center justify-center bg-red-500 text-white">
                  {totalItems}
                </Badge>
                <div className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg shadow-sm border">
                  <ShoppingCart className="h-5 w-5 text-gray-700" />
                  <div className="hidden md:block">
                    <div className="text-sm text-gray-500">Tổng giỏ hàng</div>
                    <div className="font-bold text-gray-800">
                      {formatPrice(total)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products Section - 2/3 width */}
          <div className="lg:col-span-2">
            <FilterBar
              searchQuery={searchQuery}
              activeFilter={activeFilter}
              onSearchChange={setSearchQuery}
              onFilterChange={setActiveFilter}
            />

            {/* Products Grid */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Danh sách sản phẩm
                {searchQuery && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({pagination.totalItemCount} kết quả)
                  </span>
                )}
              </h2>

              <ProductsGrid
                products={products}
                isLoading={isLoadingProducts}
                searchQuery={searchQuery}
                onClearFilters={handleClearFilters}
              />

              {/* Pagination */}
              <Pagination
                currentPage={pagination.pageNumber}
                pageCount={pagination.pageCount}
                pageSize={pagination.pageSize}
                totalItems={pagination.totalItemCount}
                hasPreviousPage={pagination.hasPreviousPage}
                hasNextPage={pagination.hasNextPage}
                onPageChange={handlePageChange}
              />
            </div>
          </div>

          {/* Cart Section - 1/3 width */}
          <div className="lg:col-span-1">
            <Cart onCheckout={handleCheckout} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}
