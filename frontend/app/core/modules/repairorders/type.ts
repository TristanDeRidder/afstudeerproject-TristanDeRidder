import { Customers } from "../customers/type";
import { Devices } from "../devices/type";
import { Invoices } from "../invoices/type";
import { Parts } from "../parts/type";
import { Technicians } from "../technicians/type";

export type Repairorders = {
    id: number;
    documentId: string;
    statusRepair: string;
    issue: string;
    repairable: boolean;
    invoice: Invoices;
    customer: Customers;
    parts: Parts[];
    devices: Devices;
    technician: Technicians[];
    createdAt: string;
    updated_at: string;
    published_at: string;
}