import { Devices } from "../devices/type";

export type Brand = {
    id: number;
    documentId: string;
    brandName: string;
    logo?: any;
    devices: Devices[];
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}