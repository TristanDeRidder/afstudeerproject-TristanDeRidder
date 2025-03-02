import { createCookie } from "@remix-run/node";
import { parse } from "cookie";

export const jwtCookie = createCookie("jwt", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // ensures cookie is only sent over HTTPS in production
  maxAge: 60 * 60 * 24, // 1 day
  path: "/", // available for all routes
});

export const getJwtFromCookie = (request: Request): string | null => {
  const cookie = request.headers.get("Cookie");
  if (!cookie) return null;

  const parsed = parse(cookie);
  return parsed.jwt || null; // fetches the JWT from the parsed cookies
};
