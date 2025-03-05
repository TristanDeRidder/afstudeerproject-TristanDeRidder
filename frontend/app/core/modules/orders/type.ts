import { Customers } from "../customers/type";
import { Devices } from "../devices/type";
import { Invoices } from "../invoices/type";
import { Parts } from "../parts/type";

export type Orders = {
    id: number;
    orderStatus: string;
    customer: Customers[];
    part: Parts[];
    device: Devices[];
    invoice: Invoices[];
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}