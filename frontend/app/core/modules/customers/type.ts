import { Devices } from "../devices/type";

export type Customers = {
    id: number;
    firstname: string;
    lastname: string;
    mailadress: string;
    phonenumber: string;
    devices: Devices[];
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}