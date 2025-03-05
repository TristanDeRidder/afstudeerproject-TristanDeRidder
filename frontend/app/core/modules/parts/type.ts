import { Repairorders } from "../repairorders/type";
import { Devices } from "../devices/type";
import { Suppliers } from "../suppliers/type";
import { Orders } from "../orders/type";

export type Parts = {
  id: number;
  documentId: string;
  name: string;
  purchasePrice: number;
  sellingPrice: number;
  suppliers: Suppliers[];
  device: Devices[];
  repairorders: Repairorders[];
  orders: Orders[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};
