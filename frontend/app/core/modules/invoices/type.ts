import { Repairorders } from "../repairorders/type";

export type Invoices = {
    id: number;
    Repairorder: Repairorders;
    TotalAmount: number;
    Paid: boolean;
    Paymentmethod: string;
    Invoice: boolean;
    created_at: string;
    updated_at: string;
    published_at: string;
}