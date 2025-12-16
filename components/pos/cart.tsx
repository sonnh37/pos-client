"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  CreditCard,
  Trash2,
  Loader2,
  Package,
  Minus,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  clearCart,
  removeFromCart,
  setQuantity,
} from "@/lib/redux/slices/cart-slice";
import { toast } from "sonner";

interface CartProps {
  onCheckout: () => Promise<void>;
  loading: boolean;
}

export function Cart({ onCheckout, loading }: CartProps) {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart.items);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      dispatch(removeFromCart(itemId));
    } else {
      dispatch(setQuantity({ id: itemId, quantity: newQuantity }));
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Giỏ hàng trống");
      return;
    }
    await onCheckout();
  };

  return (
    <div className="sticky top-6">
      <Card className="border shadow-lg h-full">
        <CardContent className="p-0 h-full flex flex-col">
          {/* Cart Header */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Giỏ hàng</h2>
                  <p className="text-sm text-gray-500">{totalItems} sản phẩm</p>
                </div>
              </div>

              {cart.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => dispatch(clearCart())}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Xóa hết
                </Button>
              )}
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[400px]">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700">
                  Giỏ hàng trống
                </h3>
                <p className="text-gray-500 mt-1">
                  Chọn sản phẩm đang bán để thêm vào giỏ hàng
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="p-2 bg-white rounded-md">
                    <Package className="h-5 w-5 text-gray-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-800 truncate">
                      {item.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {item.price.toLocaleString()}đ × {item.quantity}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuantityChange(item.id, item.quantity - 1);
                      }}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>

                    <span className="font-medium min-w-[24px] text-center">
                      {item.quantity}
                    </span>

                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuantityChange(item.id, item.quantity + 1);
                      }}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="text-right min-w-[80px]">
                    <div className="font-semibold text-gray-800">
                      {(item.price * item.quantity).toLocaleString()}đ
                    </div>
                  </div>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-gray-400 hover:text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(removeFromCart(item.id));
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          <div className="border-t p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính:</span>
                <span>{total.toLocaleString()}đ</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Thuế (10%):</span>
                <span>{(total * 0.1).toLocaleString()}đ</span>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-800">
                  Tổng tiền:
                </span>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {total > 0 ? (total * 1.1).toLocaleString() : "0"}đ
                  </div>
                  <div className="text-sm text-gray-500">Đã bao gồm VAT</div>
                </div>
              </div>
            </div>

            <Button
              className="w-full h-12 text-lg font-semibold"
              disabled={cart.length === 0 || loading}
              onClick={handleCheckout}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Thanh toán
                  {total > 0 && (
                    <span className="ml-2 font-normal">
                      {(total * 1.1).toLocaleString()}đ
                    </span>
                  )}
                </>
              )}
            </Button>

            <p className="text-xs text-center text-gray-500">
              Chỉ có thể thêm sản phẩm "Đang bán" vào giỏ hàng
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
