import { Devices } from "../devices/type";

export type Customers = {
    id: number;
    Firstname: string;
    Lastname: string;
    Mailaddress: string;
    Devices: Devices[];
    created_at: string;
    updated_at: string;
    published_at: string;
}