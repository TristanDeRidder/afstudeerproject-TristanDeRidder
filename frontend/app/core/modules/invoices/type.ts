import { Repairorders } from "../repairorders/type";

export type Invoices = {
  id: number;
  repairorder: Repairorders;
  totalAmount: number;
  paid: boolean;
  paymentmethod: string;
  invoice: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};
