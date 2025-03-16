import { Form, useActionData, useNavigation } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useState } from "react";

import type { ActionFunction } from "@remix-run/node";

/**
 * Handles the form submission action for the contact form.
 * 
 * @param {Object} params - The parameters object.
 * @param {Request} params.request - The request object containing form data.
 * 
 * @returns {Promise<Response>} The response object indicating the result of the action.
 * 
 * The function performs the following steps:
 * 1. Extracts form data (name, email, message, and reCAPTCHA token) from the request.
 * 2. Verifies the reCAPTCHA token with Google's reCAPTCHA API.
 * 3. If reCAPTCHA verification fails, returns a JSON response with an error message and status 400.
 * 4. If reCAPTCHA verification succeeds, attempts to send an email using Nodemailer.
 * 5. If email sending is successful, returns a JSON response indicating success.
 * 6. If email sending fails, returns a JSON response with an error message and status 500.
 * 
 * @throws {Error} If there is an issue with sending the email.
 */
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");
  const recaptchaToken = formData.get("g-recaptcha-response");

  // Verifieer reCAPTCHA
  const recaptchaSecret = process.env.RECAPTCHA_SECRET;
  const recaptchaResponse = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${recaptchaSecret}&response=${recaptchaToken}`,
    }
  );

  const recaptchaResult = await recaptchaResponse.json();
  if (!recaptchaResult.success) {
    return json({ error: "Captcha-verificatie mislukt." }, { status: 400 });
  }

  try {
    const transporter = require("nodemailer").createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.sendMail({
      from: `"Fixit Aalst" <${process.env.SMTP_USER}>`,
      to: "kevin@fixitaalst.be",
      subject: `Nieuw contactbericht van ${name}`,
      text: `Naam: ${name}\nEmail: ${email}\nBericht:\n${message}`,
    });

    return json({ success: "Je bericht is verzonden!" });
  } catch (error) {
    return json(
      { error: "Er is iets misgegaan bij het verzenden van de e-mail." },
      { status: 500 }
    );
  }
}

type ActionData = {
  error?: string;
  success?: string;
};

export default function ContactForm() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();

  return (
    <Form method="post">
      <label>
        Naam
        <input type="text" name="name" required />
      </label>
      <label>
        E-mail
        <input type="email" name="email" required />
      </label>
      <label>
        Bericht
        <textarea name="message" required />
      </label>

      {actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>}
      {actionData?.success && (
        <p style={{ color: "green" }}>{actionData.success}</p>
      )}

      <button type="submit" disabled={navigation.state === "submitting"}>
        {navigation.state === "submitting" ? "Verzenden..." : "Verstuur"}
      </button>
    </Form>
  );
}
