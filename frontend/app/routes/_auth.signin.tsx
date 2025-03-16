// app/routes/_auth.signin.tsx
import { ActionFunction, json, redirect } from "@remix-run/node";
import { useActionData, Form } from "@remix-run/react";
import { loginAPI } from "../core/networking/API.server";
import { jwtCookie } from "../core/cookies/cookies.server";

/**
 * Handles the sign-in action for the authentication route.
 *
 * @param {Object} context - The context object containing the request.
 * @param {Request} context.request - The request object containing form data.
 * @returns {Promise<Response>} - A promise that resolves to a response object.
 *
 * @throws {Error} - Throws an error if the form data is invalid or if the login API fails.
 *
 * The function performs the following steps:
 * 1. Extracts form data from the request.
 * 2. Validates the form data to ensure both identifier and password are strings.
 * 3. Calls the login API with the provided identifier and password.
 * 4. Redirects to the dashboard on successful login, setting a JWT cookie.
 * 5. Returns an error response if any step fails.
 */
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
