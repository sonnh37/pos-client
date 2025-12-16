"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { processResponse } from "@/lib/utils";
import { formatDateWithTime } from "@/lib/utils/date-utils";
import { formatPrice } from "@/lib/utils/number-utils";
import { orderService } from "@/services/order-service";
import { OrderGetAllQuery } from "@/types/cqrs/queries/order-query";
import { Order } from "@/types/entities/order";
import { QueryResult } from "@/types/models/query-result";
import {
  Calendar,
  ChevronRight,
  CreditCard,
  ExternalLink,
  Loader2,
  Package,
  Receipt,
} from "lucide-react";
import { useEffect, useState } from "react";

interface RealtimeOrdersScreenProps {
  title?: string;
  maxOrders?: number; // Số lượng đơn hàng tối đa hiển thị
  showFilters?: boolean; // Hiển thị bộ lọc
  showOrderDetails?: boolean; // Cho phép xem chi tiết đơn hàng
}

export function RealtimeOrdersScreen({
  title = "Đơn Hàng Mới Nhất",
  maxOrders = 20,
  showFilters = true,
  showOrderDetails = true,
}: RealtimeOrdersScreenProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<string>("today");
  const [sortBy, setSortBy] = useState<string>("newest");

  // ===== Fetch orders =====
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const query: OrderGetAllQuery = {
        pagination: {
          isPagingEnabled: true,
          pageNumber: 1,
          pageSize: maxOrders,
        },
      };

      // Apply time filter
      if (timeRange === "today") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        query.fromDate = today.toISOString();
      } else if (timeRange === "yesterday") {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        query.fromDate = yesterday.toISOString();
        query.toDate = today.toISOString();
      } else if (timeRange === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        query.fromDate = weekAgo.toISOString();
      }

      // Apply sort
      //   if (sortBy === "newest") {
      //     query.sorting?.sortField = "orderDate";
      //     query.sortDirection = "desc";
      //   } else if (sortBy === "oldest") {
      //     query.sortBy = "orderDate";
      //     query.sortDirection = "asc";
      //   } else if (sortBy === "highest") {
      //     query.sortBy = "totalAmount";
      //     query.sortDirection = "desc";
      //   } else if (sortBy === "lowest") {
      //     query.sortBy = "totalAmount";
      //     query.sortDirection = "asc";
      //   }

      const res = await orderService.getAll(query);
      processResponse(res);

      const queryResult = res.data as QueryResult<Order>;
      setOrders(queryResult.results || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchOrders();
  }, [timeRange, sortBy, maxOrders]);

  // ===== Get order summary =====
  const getOrderSummary = (order: Order) => {
    const itemCount =
      order.orderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    const productCount = order.orderItems?.length || 0;

    return `${itemCount} sản phẩm (${productCount} loại)`;
  };

  // ===== Calculate statistics =====
  const calculateStats = () => {
    if (orders.length === 0) return null;

    const totalAmount = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const averageAmount = totalAmount / orders.length;
    const todayCount = orders.filter((order) => {
      const orderDate = new Date(order.orderDate);
      const today = new Date();
      return orderDate.toDateString() === today.toDateString();
    }).length;

    return {
      totalOrders: orders.length,
      totalAmount,
      averageAmount,
      todayCount,
    };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="h-6 w-6 text-blue-600" />
            {title}
          </h2>
          <p className="text-gray-600 mt-1">
            Hiển thị {maxOrders} đơn hàng gần nhất
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalOrders}
              </div>
              <div className="text-sm text-gray-500">Tổng đơn</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatPrice(stats.totalAmount)}
              </div>
              <div className="text-sm text-gray-500">Tổng tiền</div>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Thời gian
                </label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn khoảng thời gian" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Hôm nay</SelectItem>
                    <SelectItem value="yesterday">Hôm qua</SelectItem>
                    <SelectItem value="week">7 ngày qua</SelectItem>
                    <SelectItem value="all">Tất cả</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Sắp xếp
                </label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sắp xếp theo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Mới nhất</SelectItem>
                    <SelectItem value="oldest">Cũ nhất</SelectItem>
                    <SelectItem value="highest">Giá cao nhất</SelectItem>
                    <SelectItem value="lowest">Giá thấp nhất</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="self-end">
                <Button
                  variant="outline"
                  onClick={fetchOrders}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Làm mới"
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
            <p className="text-gray-500 mt-2">Đang tải đơn hàng...</p>
          </CardContent>
        </Card>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 mx-auto text-gray-300" />
            <h3 className="text-lg font-medium text-gray-700 mt-4">
              Không có đơn hàng
            </h3>
            <p className="text-gray-500 mt-1">
              Chưa có đơn hàng nào trong khoảng thời gian này
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Orders Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {orders.map((order) => (
              <Card
                key={order.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Order Header */}
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CreditCard className="h-4 w-4 text-blue-500" />
                          <h3 className="font-bold text-gray-800">
                            Đơn hàng #
                            {order.orderNumber ||
                              order.id.slice(0, 8).toUpperCase()}
                          </h3>
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {formatDateWithTime(order.orderDate)}
                        </div>
                      </div>

                      {showOrderDetails && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <Separator />

                    {/* Order Items Summary */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {getOrderSummary(order)}
                        </span>
                      </div>

                      <Badge variant="outline" className="text-xs">
                        {order.orderItems?.length || 0} loại
                      </Badge>
                    </div>

                    {/* Order Total */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-2">
                        <Receipt className="h-4 w-4 text-green-500" />
                        <span className="font-medium text-gray-700">
                          Tổng tiền:
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-600">
                          {formatPrice(order.totalAmount)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Đã bao gồm VAT
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    {showOrderDetails && (
                      <div className="pt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            // TODO: Implement order details view
                            console.log("View order details:", order.id);
                          }}
                        >
                          Xem chi tiết
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary Footer */}
          {stats && (
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Tổng đơn hàng</div>
                    <div className="text-xl font-bold">{stats.totalOrders}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Tổng doanh thu</div>
                    <div className="text-xl font-bold text-green-600">
                      {formatPrice(stats.totalAmount)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500">
                      Đơn hàng trung bình
                    </div>
                    <div className="text-xl font-bold">
                      {formatPrice(stats.averageAmount)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Đơn hôm nay</div>
                    <div className="text-xl font-bold text-blue-600">
                      {stats.todayCount}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
