import { Brand } from "../brands/type";
import { Customers } from "../customers/type";
import { Repairorders } from "../repairorders/type";

export type Devices = {
  id: number;
  documentId: string;
  Type: string;
  Brand: Brand;
  Customers: Customers[];
  Repairorders: Repairorders[];
  Name: string;
  ModelNumber: string;
  created_at: string;
  updated_at: string;
  published_at: string;
};
