import { Order } from "@/types/entities/order";
import { BaseEntity } from "@/types/entities/base/base";
import { Product } from "./product";

export interface OrderItem extends BaseEntity {
  orderId?: string;
  productId?: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  order?: Order;
  product?: Product;
}
