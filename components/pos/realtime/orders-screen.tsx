// components/realtime/simple-orders.tsx - SỬA LẠI
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  CreditCard,
  RefreshCw,
  Plus,
  Loader2,
  Wifi,
  WifiOff,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { formatPrice } from "@/lib/utils/number-utils";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useSimpleRealtime } from "@/hooks/useOrdersRealtime";
import { formatDate } from "@/lib/utils/date-utils";

export function OrderScreen() {
  const {
    orders,
    isConnected,
    connectionState,
    loading,
    connect,
    disconnect,
    createTestOrder,
  } = useSimpleRealtime();

  const getConnectionStatus = () => {
    switch (connectionState) {
      case "Connected":
        return {
          text: "Live",
          color: "text-green-600",
          bg: "bg-green-100",
          icon: CheckCircle,
        };
      case "Connecting":
      case "Reconnecting":
        return {
          text: "Connecting...",
          color: "text-yellow-600",
          bg: "bg-yellow-100",
          icon: Loader2,
        };
      case "Disconnected":
        return {
          text: "Offline",
          color: "text-red-600",
          bg: "bg-red-100",
          icon: WifiOff,
        };
      default:
        return {
          text: connectionState,
          color: "text-gray-600",
          bg: "bg-gray-100",
          icon: AlertCircle,
        };
    }
  };

  const status = getConnectionStatus();
  const StatusIcon = status.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="h-6 w-6" />
            Đơn Hàng Realtime
            {/* <Badge
              variant="outline"
              className={`ml-2 ${status.bg} ${status.color} border-0`}
            >
              <StatusIcon
                className={`h-3 w-3 mr-1 ${
                  connectionState === "Connecting" ? "animate-spin" : ""
                }`}
              />
              {status.text}
            </Badge> */}
          </h2>
          <p className="text-gray-600 mt-1">
            {isConnected
              ? `${orders.length} đơn hàng`
              : `Trạng thái: ${connectionState}`}
          </p>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          {isConnected ? (
            <>
              {/* <Button size="sm" onClick={createTestOrder} disabled={loading}>
                <Plus className="h-4 w-4 mr-2" />
                Tạo đơn test
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={disconnect}
                disabled={loading}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Ngắt kết nối
              </Button> */}
            </>
          ) : (
            <Button
              size="sm"
              onClick={connect}
              disabled={loading || connectionState === "Connecting"}
            >
              {loading || connectionState === "Connecting" ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang kết nối...
                </>
              ) : (
                <>
                  <Wifi className="h-4 w-4 mr-2" />
                  Kết nối lại
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Connection Info */}
      {/* {process.env.NODE_ENV === "development" && (
        <Card className="bg-gray-50">
          <CardContent className="p-3">
            <div className="text-sm text-gray-600 flex items-center justify-between">
              <span>
                Connection State:{" "}
                <code className="ml-1 px-2 py-1 bg-gray-200 rounded">
                  {connectionState}
                </code>
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={connect}
                className="h-7"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )} */}

      {/* Loading State */}
      {loading && connectionState === "Connecting" && (
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
            <p className="text-gray-500 mt-2">Đang kết nối đến server...</p>
            <p className="text-sm text-gray-400 mt-1">
              {process.env.NEXT_PUBLIC_API_URL}/orderHub
            </p>
          </CardContent>
        </Card>
      )}

      {/* Disconnected State */}
      {!loading && !isConnected && connectionState === "Disconnected" && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-8 text-center">
            <WifiOff className="h-12 w-12 mx-auto text-red-300 mb-4" />
            <h3 className="text-lg font-medium text-red-800">Mất kết nối</h3>
            <p className="text-red-600 mt-1">
              Không thể kết nối đến server SignalR
            </p>
            <div className="mt-4 space-y-2">
              <Button onClick={connect} className="w-full sm:w-auto">
                Thử kết nối lại
              </Button>
              <div className="text-xs text-red-500">
                Endpoint: {process.env.NEXT_PUBLIC_API_URL}/orderHub
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Orders List - CHỈ hiển thị khi connected */}
      {isConnected && (
        <>
          {orders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-700">
                  Chưa có đơn hàng
                </h3>
                <p className="text-gray-500 mt-1">
                  Khi có đơn hàng mới, chúng sẽ xuất hiện tại đây
                </p>
                <Button
                  onClick={createTestOrder}
                  className="mt-4"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo đơn hàng test
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {orders.map((order) => (
                  <Card
                    key={order.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      {/* Order Header */}
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-blue-500" />
                            <h3 className="font-bold text-gray-800">
                              #{order.orderNumber || order.id.slice(0, 8)}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {formatDate(
                              order.orderDate || order.createdDate || ""
                            )}
                          </p>
                        </div>

                        {/* Real-time indicator */}
                        <div
                          className={`
                          w-2 h-2 rounded-full animate-pulse
                          ${
                            Date.now() -
                              new Date(
                                order.createdDate || Date.now()
                              ).getTime() <
                            10000
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }
                        `}
                        />
                      </div>

                      {/* Order Total */}
                      <div className="flex justify-between items-center pt-3 border-t">
                        <span className="text-gray-600">Tổng tiền:</span>
                        <span className="text-lg font-bold text-green-600">
                          {formatPrice(order.totalAmount)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Stats */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      Hiển thị: {orders.length} đơn hàng mới nhất
                    </div>
                    <div className="text-sm font-medium text-green-600">
                      {formatPrice(
                        orders.reduce(
                          (sum, order) => sum + order.totalAmount,
                          0
                        )
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </>
      )}
    </div>
  );
}
