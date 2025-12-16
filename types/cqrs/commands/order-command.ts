import { CreateCommand, UpdateCommand } from "./base/base-command";

export interface OrderCreateCommand extends CreateCommand {
  items: Item[];
}

export interface Item {
  productId: string;
  quantity: number;
}

export interface OrderUpdateCommand extends UpdateCommand {}
