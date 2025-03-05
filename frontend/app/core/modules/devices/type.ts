import { Brand } from "../brands/type";
import { Customers } from "../customers/type";
import { Orders } from "../orders/type";
import { Repairorders } from "../repairorders/type";

export type Devices = {
  id: number;
  documentId: string;
  type: string;
  brand: Brand;
  customers: Customers[];
  repairorders: Repairorders[];
  orders: Orders[];
  model: string;
  modelType: string;
  modelNumber: string;
  image: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};
