import { MetaFunction, useActionData, useLoaderData } from "@remix-run/react";
import { ActionFunctionArgs } from "@remix-run/node";
import { useRef, useState } from "react";
import sgMail from "@sendgrid/mail";

import { getContactPage } from "../core/modules/SingleTypes/contact/api";
import { addContactForm } from "../core/modules/contactForm/api";

import PrimaryTitle from "../components/design/Title/PrimaryTitle";
import SecondaryTitle from "../components/design/Title/SecondaryTitle";

type LoaderData = {
  contact: any;
};

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  throw new Error("SENDGRID_API_KEY is not defined");
}

export const meta: MetaFunction = () => {
  return [
    { title: "Contact | Fixit Aalst" },
    {
      name: "description",
      content:
        "Fixit Aalst is gespecialiseerd in het herstellen van smartphones, tablets en laptops van merken zoals Apple, Samsung, Huawei, en OnePlus.",
    },
    {
      name: "keywords",
      content:
        "Fixit Aalst, smartphone herstelling, tablet reparatie, laptop herstel, Apple, Samsung, Huawei, OnePlus",
    },
    { name: "robots", content: "index, follow" },
    { name: "viewport", content: "width=device-width, initial-scale=1.0" },
    {
      property: "og:title",
      content: "Fixit Aalst | Smartphone, Tablet & Laptop Herstellingen",
    },
    {
      property: "og:description",
      content:
        "Fixit Aalst biedt snelle en betrouwbare herstellingen voor smartphones, tablets en laptops.",
    },
  ];
};


export async function loader() {
  try {
    const contact = await getContactPage();

    if (!contact || !contact.data) {
      throw new Error("Geen data beschikbaar");
    }

    return {
      contact: contact.data,
    };
  } catch (error) {
    console.error("Fout bij het ophalen van contactgegevens:", error);
    return { contact: null };
  }
}

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const formData = new URLSearchParams(await request.text());
    const data = {
      firstname: formData.get("firstname") || "",
      lastname: formData.get("lastname") || "",
      email: formData.get("email") || "",
      phonenumber: formData.get("phonenumber") || "",
      message: formData.get("message") || "",
      subject: formData.get("subject") || "",
    };
    const { firstname, lastname, email, phonenumber, message, subject } = data;

    // Validate the form fields
    if (!firstname || !lastname || !email || !message || !subject) {
      return { error: "Alle verplichte velden moeten ingevuld worden." };
    }

    // Save the contact form data (optional)
    const messageResponse = await addContactForm(
      firstname,
      lastname,
      email,
      phonenumber,
      message,
      subject
    );

    if (!messageResponse.data) {
      return {
        error: "Er is een fout opgetreden bij het verzenden van het bericht.",
      };
    }

    // Send the email via SendGrid
    const msg = {
      // FIXME: Change the email addresses
      to: `mixmaster578@gmail.com`, // Change to your recipient email
      from: "tristanderidder1@gmail.com", // Change to your verified sender email
      subject: `Nieuw bericht: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <p><strong>Van:</strong> ${firstname} ${lastname}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Telefoonnummer:</strong> ${phonenumber}</p>
          <p><strong>Bericht:</strong></p>
          <p style="background-color: #f9f9f9; padding: 10px; border: 1px solid #93C5FD;">${message}</p>
        </div>
      `,
    };

    // Send the email and check the response
    await sgMail.send(msg);

    return { success: "Het bericht is succesvol verzonden." };
  } catch (error) {
    console.error("Fout bij het verzenden van het bericht:", error);
    return {
      error: "Er is een fout opgetreden bij het verzenden van het bericht.",
    };
  }
};

export default function Contact() {
  const { contact } = useLoaderData() as LoaderData;

  const actionData: any = useActionData();

  const [error, setError] = useState<string | null>(actionData?.error || null);
  const [success, setSuccess] = useState<string | null>(
    actionData?.success || null
  );
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phonenumber: "",
    message: "",
    subject: "",
  });
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault(); // Prevent page refresh
    setSuccess(null);

    // Validation
    if (
      !formData.firstname ||
      !formData.lastname ||
      !formData.email ||
      !formData.message
    ) {
      setError("Alle verplichte velden moeten ingevuld worden.");
      return;
    }

    // Reset error message before submitting
    setError(null);

    // Submit form
    e.target.submit();
  };

  if (!contact || !contact.PageContent) {
    return (
      <div className="flex items-center justify-center h-40 bg-gray-100 text-gray-500">
        Geen data beschikbaar
      </div>
    );
  }

  return (
    <div className="space-y-6 px-5 md:px-10 lg:px-32">
      {contact.PageContent.map((block: any) => {
        switch (block.__component) {
          case "blocks.header":
            return (
              <header key={block.id} className="text-center">
                <PrimaryTitle title={block.Title} subtitle={block.Subtext} />
              </header>
            );

          case "blocks.opening-hour":
            return (
              <section
                key={block.id}
                className="p-6 border rounded-lg bg-primaryHelper shadow-sm"
              >
                <h2 className="text-2xl font-semibold mb-4 text-center">
                  Openingstijden
                </h2>
                <ul className="space-y-2">
                  {Object.entries(block.Open).map(
                    ([day, hours]: [string, any]) => (
                      <li key={day} className="flex justify-between text-lg">
                        <span className="capitalize font-medium">{day}</span>
                        {hours.open && hours.close ? (
                          <span>
                            {hours.open} - {hours.close}
                          </span>
                        ) : (
                          <span className="text-gray-500">Gesloten</span>
                        )}
                      </li>
                    )
                  )}
                </ul>
              </section>
            );

          case "blocks.i-frame":
            return (
              <section key={block.id} className="space-y-4">
                <h2 className="text-2xl font-semibold text-center">Locatie</h2>
                <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-md">
                  <iframe
                    src={block.iFrame}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allowFullScreen
                    title="Google Map"
                  ></iframe>
                </div>
              </section>
            );

          default:
            return null;
        }
      })}

      {/* Contact Form */}
      <section className="space-y-6">
        <SecondaryTitle title="Neem contact op" />
        {error && (
          <p className="p-4 border border-red-500 text-red-600 rounded-lg">
            {error}
          </p>
        )}
        {success && (
          <p className="p-4 border border-green-500 text-green-600 rounded-lg">
            {success}
          </p>
        )}
        <form
          method="post"
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-4 bg-white p-6 rounded-lg shadow-md"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">
                Voornaam*
              </label>
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Achternaam*
              </label>
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">E-mail*</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Telefoonnummer
              </label>
              <input
                type="text"
                name="phonenumber"
                value={formData.phonenumber}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Onderwerp*</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bericht*</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={4}
              className="w-full p-3 border rounded-lg"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-secondary text-white rounded-full hover:bg-secondaryDark transition"
          >
            Verstuur
          </button>
        </form>
      </section>
    </div>
  );
}
