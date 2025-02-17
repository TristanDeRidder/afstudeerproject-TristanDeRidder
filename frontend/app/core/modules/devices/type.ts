import { Repairorders } from "../repairorders/type";

export type Devices = {
  id: number;
  Type: string;
  Brand: string;
  Customers: string;
  Repairorders: Repairorders[];
  Name: string;
  ModelNumber: string;
  created_at: string;
  updated_at: string;
  published_at: string;
};
