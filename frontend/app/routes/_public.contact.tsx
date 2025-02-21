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

    console.log("1", messageResponse.data);

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
    <div className="space-y-6">
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
                className="p-4 border rounded-lg bg-primaryHelper"
              >
                <h2 className="text-xl font-semibold mb-2">Openingstijden</h2>
                <ul className="space-y-1">
                  {Object.entries(block.Open).map(
                    ([day, hours]: [string, any]) => (
                      <li key={day} className="flex justify-between">
                        <span className="capitalize">{day}</span>
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
              <section key={block.id}>
                <h2 className="text-xl font-semibold mb-2 p-4">Locatie</h2>
                <div className="w-full h-80 mb-6">
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
      <SecondaryTitle title="Neem contact op" />
      {error && (
        <p className="p-4 border border-red rounded-[5px] mb-4 text-red">
          {error}
        </p>
      )}
      {success && (
        <p className="p-4 border rounded-[5px] mb-4 font-medium">{success}</p>
      )}
      <form
        method="post"
        ref={formRef}
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div className="flex gap-4 ">
          <div>
            <label className="block text-sm font-medium">Voornaam*</label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Achternaam*</label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium">E-mail*</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Telefoonnummer</label>
            <input
              type="text"
              name="phonenumber"
              value={formData.phonenumber}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Bericht*</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={4}
            className="w-full p-2 border rounded"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-secondary text-white rounded-full"
        >
          Verstuur
        </button>
      </form>
    </div>
  );
}
