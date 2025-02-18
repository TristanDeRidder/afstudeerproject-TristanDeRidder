import { Repairorders } from "../repairorders/type";
import { Devices } from "../devices/type";
import { Suppliers } from "../suppliers/type";

export type Parts = {
  id: number;
  documentId: string;
  Name: string;
  PurchasePrice: number;
  SellingPrice: number;
  Suppliers: Suppliers[];
  Devices: Devices[];
  Repairorders: Repairorders[];
  created_at: string;
  updated_at: string;
  published_at: string;
};
