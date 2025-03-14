// app/routes/_auth.logout.tsx
import { ActionFunction, redirect } from "@remix-run/node";
import { jwtCookie } from "../core/cookies/cookies.server";

export const action: ActionFunction = async () => {
  return redirect("/signin", {
    headers: {
      "Set-Cookie": await jwtCookie.serialize("", { maxAge: 0 }),
    },
  });
};

export default function LogoutPage() {
  return null; // This page doesn't need to render anything
}
