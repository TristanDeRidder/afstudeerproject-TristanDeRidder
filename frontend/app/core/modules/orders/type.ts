import { Customers } from "../customers/type";
import { Devices } from "../devices/type";
import { Invoices } from "../invoices/type";
import { Parts } from "../parts/type";

export type Orders = {
    id: number;
    documentId: string;
    orderStatus: string;
    customer: Customers;
    parts: Parts[];
    device: Devices[];
    invoice: Invoices[];
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}