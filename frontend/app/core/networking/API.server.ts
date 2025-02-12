import axios from "axios";

const API = axios.create({
  baseURL: process.env.STRAPI_API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
  },
});

export default API;