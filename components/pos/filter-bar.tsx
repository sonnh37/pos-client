// components/pos/filter-bar.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductStatus } from "@/types/entities/product";

interface FilterBarProps {
  searchQuery: string;
  activeFilter: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (filter: string) => void;
}

export function FilterBar({
  searchQuery,
  activeFilter,
  onSearchChange,
  onFilterChange,
}: FilterBarProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Tìm kiếm sản phẩm theo tên hoặc mã..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            autoFocus
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <Filter className="h-4 w-4 text-gray-400 shrink-0" />
          <div className="flex gap-2">
            <Button
              variant={activeFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange("all")}
              className={cn(
                "whitespace-nowrap",
                activeFilter === "all" && "bg-blue-600 hover:bg-blue-700"
              )}
            >
              Tất cả
            </Button>
            <Button
              variant={activeFilter === "available" ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange("available")}
              className={cn(
                "whitespace-nowrap",
                activeFilter === "available" &&
                  "bg-green-600 hover:bg-green-700"
              )}
            >
              Có sẵn
            </Button>
            <Button
              variant={activeFilter === "outofstock" ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange("outofstock")}
              className="whitespace-nowrap"
            >
              Hết hàng
            </Button>
            <Button
              variant={activeFilter === "comingsoon" ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange("comingsoon")}
              className="whitespace-nowrap"
            >
              Sắp có
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
