"use client";

import { RealtimeOrdersScreen } from "@/components/pos/realtime/orders-screen";

export default function PosOrderScreen() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Màn Hình Realtime
          </h1>
          <p className="text-gray-600 mt-2">
            Theo dõi các đơn hàng mới nhất trong hệ thống
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - 2/3 width */}
          <div className="lg:col-span-2">
            <RealtimeOrdersScreen
              title="Đơn Hàng Mới Nhất"
              maxOrders={20}
              showFilters={false}
              showOrderDetails={true}
            />
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-semibold text-gray-800 mb-4">
                Thống Kê Nhanh
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Đơn hàng hôm nay</span>
                  <span className="font-bold text-blue-600">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Doanh thu hôm nay</span>
                  <span className="font-bold text-green-600">8.450.000đ</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Đơn hàng trung bình</span>
                  <span className="font-bold">704.167đ</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tổng đơn hàng</span>
                  <span className="font-bold">156</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            {/* <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-semibold text-gray-800 mb-4">
                Hoạt Động Gần Đây
              </h3>
              <div className="space-y-3">
                {[
                  {
                    time: "10:30",
                    action: "Đơn hàng #ORD-001234 đã thanh toán",
                  },
                  { time: "10:15", action: "Đơn hàng #ORD-001233 đã tạo" },
                  { time: "09:45", action: "Đơn hàng #ORD-001232 hoàn tất" },
                  {
                    time: "09:20",
                    action: "Đơn hàng #ORD-001231 đã thanh toán",
                  },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-10 text-sm text-gray-500">
                      {activity.time}
                    </div>
                    <div className="flex-1 text-sm">{activity.action}</div>
                  </div>
                ))}
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
