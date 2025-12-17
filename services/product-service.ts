import { Constants } from "@/lib/constants/constants";
import { Product } from "@/types/entities/product";
import { BaseService } from "./base/base-service";

class ProductService extends BaseService<Product> {
  constructor() {
    super(`${Constants.PRODUCTS}`);
  }
}

export const productService = new ProductService();
