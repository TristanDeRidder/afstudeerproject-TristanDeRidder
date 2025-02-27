// app/core/networking/API.server.ts
import axios from "axios";

const API = axios.create({
  baseURL: process.env.STRAPI_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const loginAPI = async (identifier: string, password: string) => {
  try {
    const response = await axios.post(
      `${process.env.STRAPI_API_URL}/auth/local`,
      { identifier, password }
    );
    return response.data; // Contains user + jwt
  } catch (error: any) {
    throw new Error(error.response?.data?.error?.message || "Login failed");
  }
};

export default API;
