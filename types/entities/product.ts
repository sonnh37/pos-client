import { BaseEntity } from "./base/base";
import { OrderItem } from "./order-item";

export enum ProductStatus {
  Available,
  OutOfStock,
  Discontinued,
  ComingSoon,
}

export interface Product extends BaseEntity {
  name: string;
  price: number;
  status: ProductStatus;

  orderItems: OrderItem[];
}
