import { GetQueryableQuery } from "./base/base-query";
import { ProductStatus } from "@/types/entities/product";

export interface ProductGetAllQuery extends GetQueryableQuery {
  name?: string | null;
  status?: ProductStatus | null;
}
