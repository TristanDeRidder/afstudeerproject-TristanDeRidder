// app/core/networking/API.server.ts
import axios from "axios";

/**
 * An instance of Axios created with a base URL and default headers.
 * 
 * The base URL is set from the environment variable `STRAPI_API_URL`.
 * The headers include:
 * - `Content-Type`: set to `application/json`
 * - `Authorization`: set to a Bearer token from the environment variable `STRAPI_API_TOKEN`
 * 
 * @constant
 * @type {AxiosInstance}
 */
const API = axios.create({
  baseURL: process.env.STRAPI_API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
  },
});

/**
 * Logs in a user using the provided identifier and password.
 *
 * @param {string} identifier - The identifier (username or email) of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<any>} A promise that resolves to the response data containing user information and JWT token.
 * @throws {Error} Throws an error if the login fails, with the error message from the response or a default message.
 */
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
