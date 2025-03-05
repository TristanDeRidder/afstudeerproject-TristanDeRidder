import { Devices } from "../devices/type";

export type Brand = {
    id: number;
    documentId: string;
    brandName: string;
    logo: string;
    devices: Devices[];
    created_at: string;
    updated_at: string;
    published_at: string;
}