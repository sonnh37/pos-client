// hooks/useSimpleRealtime.ts - SỬA LẠI
import { signalR } from "@/lib/signalr/signalr-service";
import { useEffect, useState, useCallback, useRef } from "react";

interface Order {
  id: string;
  orderNumber?: string;
  totalAmount: number;
  orderDate: string;
  createdDate?: string;
}

export function useSimpleRealtime() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connectionState, setConnectionState] = useState("Disconnected");

  // Dùng ref để tránh re-render
  const eventHandlersRef = useRef<{ [key: string]: (data: any) => void }>({});

  // Xử lý khi nhận đơn hàng mới
  const handleNewOrder = useCallback((newOrder: Order) => {
    console.log("📦 New order received:", newOrder);
    setOrders((prev) => [newOrder, ...prev.slice(0, 49)]); // Giới hạn 50 đơn
  }, []);

  // Xử lý khi nhận tất cả đơn hàng
  const handleAllOrders = useCallback((allOrders: Order[]) => {
    console.log("📋 Received orders:", allOrders.length);
    setOrders(allOrders.slice(0, 50)); // Giới hạn 50 đơn
  }, []);

  // Lưu event handlers vào ref
  useEffect(() => {
    eventHandlersRef.current.ReceiveNewOrder = handleNewOrder;
    eventHandlersRef.current.ReceiveAllOrders = handleAllOrders;
  }, [handleNewOrder, handleAllOrders]);

  // Kết nối SignalR - FIXED
  const connect = useCallback(async () => {
    try {
      setLoading(true);

      // 1. Connect to SignalR
      await signalR.connect();
      setIsConnected(true);
      setConnectionState(signalR.getState());

      // 2. Đăng ký event handlers
      Object.entries(eventHandlersRef.current).forEach(
        ([eventName, handler]) => {
          signalR.on(eventName, handler);
        }
      );

      // 3. ĐỢI connection ready trước khi gửi request
      await signalR.waitForConnection(5000);

      // 4. Chỉ gửi request khi đã connected
      if (signalR.isConnected()) {
        try {
          // Yêu cầu tất cả đơn hàng hiện tại
          await signalR.send("SendAllOrders");
        } catch (sendError) {
          console.warn("⚠️ Could not fetch initial orders:", sendError);
          // Không throw error ở đây, vẫn tiếp tục
        }
      }
    } catch (error) {
      console.error("Connection error:", error);
      setIsConnected(false);
      setConnectionState("Disconnected");
    } finally {
      setLoading(false);
    }
  }, []);

  // Ngắt kết nối
  const disconnect = useCallback(async () => {
    try {
      // Hủy đăng ký event handlers
      Object.keys(eventHandlersRef.current).forEach((eventName) => {
        signalR.off(eventName);
      });

      await signalR.disconnect();
      setIsConnected(false);
      setConnectionState("Disconnected");
      console.log("🔌 Disconnected successfully");
    } catch (error) {
      console.error("Error disconnecting:", error);
    }
  }, []);

  // Theo dõi connection state
  useEffect(() => {
    const interval = setInterval(() => {
      const state = signalR.getState();
      setConnectionState(state);
      setIsConnected(state === "Connected");
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Auto connect với delay
  useEffect(() => {
    const timer = setTimeout(() => {
      connect();
    }, 1000); // Delay 1s để tránh race condition

    return () => {
      clearTimeout(timer);
      disconnect();
    };
  }, [connect, disconnect]);

  // Tạo đơn hàng test - CHỈ gọi khi connected
  const createTestOrder = useCallback(async () => {
    if (!signalR.isConnected()) {
      console.warn("⚠️ Not connected, attempting to connect first...");
      await connect();
    }

    try {
      // Có thể dùng fetch thay vì signalR.send nếu cần
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/test`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        console.log("✅ Test order created");
        // Order mới sẽ tự động nhận qua SignalR event
      } else {
        console.error("❌ Failed to create test order");
      }
    } catch (error) {
      console.error("Error creating test order:", error);
    }
  }, [connect]);

  return {
    orders,
    isConnected,
    connectionState,
    loading,
    connect,
    disconnect,
    createTestOrder,
  };
}
