// app/routes/_auth.signin.tsx
import { ActionFunction, json, redirect } from "@remix-run/node";
import { useActionData, Form } from "@remix-run/react";
import { loginAPI } from "../core/networking/API.server";
import { jwtCookie } from "../core/cookies/cookies.server";

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData();
    const identifier = formData.get("identifier");
    const password = formData.get("password");

    if (typeof identifier !== "string" || typeof password !== "string") {
      return json({ error: "Invalid form data" }, { status: 400 });
    }

    const data = await loginAPI(identifier, password);

    return redirect("/dashboard", {
      headers: {
        "Set-Cookie": await jwtCookie.serialize(data.jwt),
      },
    });
  } catch (err: any) {
    return json({ error: err.message }, { status: 401 });
  }
};

export default function LoginPage() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex justify-center items-center h-screen">
      <Form method="post" className="p-8 border rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        {actionData?.error && (
          <p className="text-red-500 mb-4">{actionData.error}</p>
        )}
        <input
          type="text"
          name="identifier"
          placeholder="Email"
          className="block border p-2 mb-4 w-full"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="block border p-2 mb-4 w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full"
        >
          Login
        </button>
      </Form>
    </div>
  );
}
