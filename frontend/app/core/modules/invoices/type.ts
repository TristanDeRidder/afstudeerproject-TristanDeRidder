import { Repairorders } from "../repairorders/type";

export type Invoices = {
    id: number;
    repairorder: Repairorders;
    totalAmount: number;
    paid: boolean;
    paymentmethod: string;
    invoice: boolean;
    created_at: string;
    updated_at: string;
    published_at: string;
}