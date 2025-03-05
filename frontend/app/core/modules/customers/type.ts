import { Devices } from "../devices/type";

export type Customers = {
    id: number;
    firstname: string;
    lastname: string;
    mailadress: string;
    phonenumber: string;
    devices: Devices[];
    created_at: string;
    updated_at: string;
    published_at: string;
}