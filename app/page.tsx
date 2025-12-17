"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const links = {
    pos: "/products",
    realtime: "/orders",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Hệ Thống POS Bán Hàng
            </h1>
            <p className="text-gray-600">
              Quản lý bán hàng và theo dõi đơn hàng hiệu quả
            </p>
          </div>

          {/* Main Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* POS Card */}
            <Card className="border-2 hover:border-blue-500 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                    <ShoppingCart className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Màn Hình Bán Hàng
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Hiển thị sản phẩm, thêm vào giỏ hàng, tính tiền và thanh
                    toán
                  </p>
                  <Link href={links.pos}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Truy cập ngay
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Realtime Card */}
            <Card className="border-2 hover:border-green-500 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                    <Clock className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Màn Hình Realtime
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Theo dõi đơn hàng thời gian thực, tự động cập nhật
                  </p>
                  <Link href={links.realtime}>
                    <Button
                      variant="outline"
                      className="w-full border-green-500 text-green-600 hover:bg-green-50"
                    >
                      Truy cập ngay
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features List */}
          <div className="mt-12 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              Tính năng chính
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* POS Features */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900 flex items-center">
                  <ShoppingCart className="h-5 w-5 text-blue-500 mr-2" />
                  Màn hình bán hàng
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2"></div>
                    Hiển thị danh sách sản phẩm (Tên, Giá)
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2"></div>
                    Thêm sản phẩm vào giỏ hàng
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2"></div>
                    Hiển thị tổng tiền
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2"></div>
                    Nút Thanh toán
                  </li>
                </ul>
              </div>

              {/* Realtime Features */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900 flex items-center">
                  <Clock className="h-5 w-5 text-green-500 mr-2" />
                  Màn hình realtime
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2"></div>
                    Hiển thị danh sách đơn hàng realtime
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2"></div>
                    Tự động cập nhật (không cần reload)
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2"></div>
                    Mã đơn hàng, Tổng tiền, Thời gian
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="bg-gray-50 rounded-lg p-6 border">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">POS</div>
                  <div className="text-sm text-gray-600">Màn hình bán hàng</div>
                  <div className="mt-2 text-xs text-gray-500">
                    <code className="bg-gray-100 px-2 py-1 rounded">
                      {links.pos}
                    </code>
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    Realtime
                  </div>
                  <div className="text-sm text-gray-600">Theo dõi đơn hàng</div>
                  <div className="mt-2 text-xs text-gray-500">
                    <code className="bg-gray-100 px-2 py-1 rounded">
                      {links.realtime}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t text-center">
            <p className="text-sm text-gray-500">
              Hệ thống quản lý bán hàng đơn giản & hiệu quả
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
