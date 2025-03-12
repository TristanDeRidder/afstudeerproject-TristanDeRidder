import { useActionData, useLoaderData } from "@remix-run/react";
import { getContactPage } from "../core/modules/SingleTypes/contact/api";
import { addContactForm } from "../core/modules/contactForm/api";
import { ActionFunctionArgs } from "@remix-run/node";
import { useRef, useState } from "react";
import PrimaryTitle from "../components/design/Title/PrimaryTitle";
import SecondaryTitle from "../components/design/Title/SecondaryTitle";

type LoaderData = {
  contact: any;
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
    };
    const { firstname, lastname, email, phonenumber, message } = data;

    if (!firstname || !lastname || !email || !message) {
      return { error: "Alle verplichte velden moeten ingevuld worden." };
    }

    const messageResponse = await addContactForm(
      firstname,
      lastname,
      email,
      phonenumber,
      message
    );


    if (!messageResponse.data) {
      return {
        error: "Er is een fout opgetreden bij het verzenden van het bericht.",
      };
    }

    return { success: "Het bericht is succesvol verzonden." };
  } catch (error) {
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
