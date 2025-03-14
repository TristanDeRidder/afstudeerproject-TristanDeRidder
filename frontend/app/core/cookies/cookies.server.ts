import { createCookie } from "@remix-run/node";

export const jwtCookie = createCookie("jwt", {
  maxAge: 60 * 60 * 24, // 1 day
});