import { BaseEntity } from "./base/base";
import { OrderItem } from "./order-item";

export enum OrderStatus {
  Pending,
  Confirmed,
  Processing,
  ReadyForShipment,
  Shipped,
  Delivered,
  Completed,
  Cancelled,
  Refunded,
  OnHold,
}

export interface Order extends BaseEntity {
  orderNumber?: string;
  status: OrderStatus;
  totalAmount: number;
  orderDate: string;
  orderItems: OrderItem[];
}
