import { Customers } from "../customers/type";
import { Devices } from "../devices/type";
import { Invoices } from "../invoices/type";
import { Parts } from "../parts/type";

export type Orders = {
    id: number;
    OrderStatus: string;
    Customer: Customers[];
    Part: Parts[];
    Device: Devices[];
    Invoice: Invoices[];
    created_at: string;
    updated_at: string;
    published_at: string;
}