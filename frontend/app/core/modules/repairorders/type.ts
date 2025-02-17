import { Customers } from "../customers/type";
import { Devices } from "../devices/type";
import { Invoices } from "../invoices/type";
import { Parts } from "../parts/type";

export type Repairorders = {
    id: number;
    StatusRepair: string;
    Issue: string;
    Repairable: boolean;
    Invoice: Invoices;
    Customer: Customers;
    Parts: Parts[];
    Devices: Devices[];
    created_at: string;
    updated_at: string;
    published_at: string;
}