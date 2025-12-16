// app/realtime/page.tsx
"use client";

import { OrderScreen } from "@/components/pos/realtime/orders-screen";

export default function RealtimePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Màn Hình Realtime
          </h1>
        </div>

        <OrderScreen />
      </div>
    </div>
  );
}
