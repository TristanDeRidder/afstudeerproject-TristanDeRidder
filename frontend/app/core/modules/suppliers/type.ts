import { Parts } from "../parts/type";

export type Suppliers = {
  id: number;
  name: string;
  parts: Parts[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};
