import { Parts } from '../parts/type';

export type Suppliers = {
    id: number;
    name: string;
    parts: Parts[];
    created_at: string;
    updated_at: string;
    published_at: string;
}