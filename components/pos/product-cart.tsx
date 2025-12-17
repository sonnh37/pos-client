import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product, ProductStatus } from "@/types/entities/product";
import {
  Plus,
  Package,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/lib/redux/hooks";
import { addToCart } from "@/lib/redux/slices/cart-slice";
import { formatPrice } from "@/lib/utils/number-utils";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();

  const getStatusBadge = (status: ProductStatus) => {
    switch (status) {
      case ProductStatus.Available:
        return {
          label: "Có sẵn",
          icon: CheckCircle,
          className: "bg-green-100 text-green-800 border-green-200",
          iconColor: "text-green-500",
          canAddToCart: true,
        };
      case ProductStatus.OutOfStock:
        return {
          label: "Hết hàng",
          icon: XCircle,
          className: "bg-red-100 text-red-800 border-red-200",
          iconColor: "text-red-500",
          canAddToCart: false,
        };
      case ProductStatus.Discontinued:
        return {
          label: "Ngừng bán",
          icon: XCircle,
          className: "bg-gray-100 text-gray-800 border-gray-200",
          iconColor: "text-gray-500",
          canAddToCart: false,
        };
      case ProductStatus.ComingSoon:
        return {
          label: "Sắp có",
          icon: Clock,
          className: "bg-blue-100 text-blue-800 border-blue-200",
          iconColor: "text-blue-500",
          canAddToCart: false,
        };
      default:
        return {
          label: "Không xác định",
          icon: AlertCircle,
          className: "bg-gray-100 text-gray-800 border-gray-200",
          iconColor: "text-gray-500",
          canAddToCart: false,
        };
    }
  };

  const statusBadge = getStatusBadge(product.status);
  console.log("check_statusbadge", statusBadge);
  const StatusIcon = statusBadge.icon;

  const handleAddToCart = () => {
    if (statusBadge.canAddToCart) {
      dispatch(addToCart(product));
    } else {
      // Hiển thị thông báo tùy theo trạng thái
      let message = "";
      switch (product.status) {
        case ProductStatus.OutOfStock:
          message = "Sản phẩm đã hết hàng";
          break;
        case ProductStatus.Discontinued:
          message = "Sản phẩm đã ngừng bán";
          break;
        case ProductStatus.ComingSoon:
          message = "Sản phẩm sắp có hàng";
          break;
        default:
          message = "Không thể thêm sản phẩm vào giỏ hàng";
      }
      toast.warning(message);
    }
  };

  // Tính toán số lượng đã bán từ orderItems
  const soldCount =
    product.orderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <Card
      className={cn(
        "cursor-pointer border hover:shadow-lg transition-all duration-200 overflow-hidden group",
        product.status === ProductStatus.Available
          ? "hover:border-green-300 hover:scale-[1.02]"
          : product.status === ProductStatus.OutOfStock
          ? "hover:border-red-200 opacity-90"
          : product.status === ProductStatus.ComingSoon
          ? "hover:border-blue-200 opacity-90"
          : "hover:border-gray-200 opacity-70 cursor-not-allowed"
      )}
      onClick={handleAddToCart}
    >
      <CardContent className="p-0">
        {/* Product Image Placeholder with Status */}
        <div
          className={cn(
            "h-40 flex items-center justify-center transition-colors relative",
            product.status === ProductStatus.Available
              ? "bg-gradient-to-br from-green-50 to-green-100 group-hover:from-green-100 group-hover:to-green-200"
              : product.status === ProductStatus.OutOfStock
              ? "bg-gradient-to-br from-red-50 to-red-100 group-hover:from-red-100 group-hover:to-red-200"
              : product.status === ProductStatus.ComingSoon
              ? "bg-gradient-to-br from-blue-50 to-blue-100 group-hover:from-blue-100 group-hover:to-blue-200"
              : "bg-gradient-to-br from-gray-50 to-gray-100 group-hover:from-gray-100 group-hover:to-gray-200"
          )}
        >
          {/* Overlay cho sản phẩm không thể bán */}
          {(product.status === ProductStatus.OutOfStock ||
            product.status === ProductStatus.Discontinued) && (
            <div className="absolute inset-0 bg-white/50 z-10"></div>
          )}

          <Package
            className={cn(
              "h-16 w-16 z-20",
              statusBadge.iconColor,
              (product.status === ProductStatus.OutOfStock ||
                product.status === ProductStatus.Discontinued) &&
                "opacity-60"
            )}
          />

          {/* Status Badge */}
          <div className="absolute top-3 right-3 z-20">
            <Badge
              className={cn(
                "flex items-center gap-1 px-2 py-1 text-xs font-medium",
                statusBadge.className
              )}
            >
              <StatusIcon className="h-3 w-3" />
              {statusBadge.label}
            </Badge>
          </div>

          {/* Coming Soon Badge */}
          {product.status === ProductStatus.ComingSoon && (
            <div className="absolute bottom-3 left-0 right-0 text-center z-20">
              <Badge className="bg-blue-600 text-white px-3 py-1">
                Sắp có hàng
              </Badge>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-800 truncate text-sm">
            {product.name}
          </h3>

          <div className="flex items-center justify-between mt-3">
            <div>
              <div
                className={cn(
                  "text-lg font-bold",
                  product.status === ProductStatus.Available
                    ? "text-green-600"
                    : product.status === ProductStatus.OutOfStock
                    ? "text-red-600"
                    : "text-gray-600"
                )}
              >
                {formatPrice(product.price)}
              </div>
            </div>

            {soldCount > 0 && (
              <div className="text-right">
                <div className="text-sm text-gray-500">Đã bán</div>
                <div className="font-semibold text-gray-700">{soldCount}</div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="mt-4">
            {product.status === ProductStatus.Available ? (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm vào giỏ
                </Button>
              </div>
            ) : (
              <div className="mt-2">
                <Button
                  size="sm"
                  className="w-full"
                  variant="outline"
                  disabled
                  onClick={(e) => {
                    e.stopPropagation(); // Ngăn chặn event bubbling
                  }}
                >
                  {product.status === ProductStatus.OutOfStock
                    ? "Đã hết hàng"
                    : product.status === ProductStatus.Discontinued
                    ? "Ngừng bán"
                    : "Sắp có hàng"}
                </Button>
              </div>
            )}
          </div>

          {/* Additional info for Out of Stock */}
          {product.status === ProductStatus.OutOfStock && soldCount > 0 && (
            <div className="mt-2 text-xs text-gray-500 text-center">
              Sản phẩm đã bán được {soldCount} lần
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
