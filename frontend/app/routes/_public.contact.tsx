import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { getContactPage } from "../core/modules/SingleTypes/contact/api";
import { PostContactForm } from "../core/modules/contactForm/api";

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

export default function Contact() {
  const { contact } = useLoaderData() as LoaderData;
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phonenumber: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await PostContactForm(
        formData.firstname,
        formData.lastname,
        formData.email,
        formData.phonenumber || null,
        formData.message
      );
      setSubmissionStatus("Formulier succesvol verzonden!");
      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        phonenumber: "",
        message: "",
      });
    } catch (error) {
      setSubmissionStatus("Er is een fout opgetreden bij het verzenden.");
    } finally {
      setIsSubmitting(false);
    }
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
                <h1 className="text-3xl font-bold">{block.Title}</h1>
                {block.Subtext && (
                  <p className="text-gray-600">{block.Subtext}</p>
                )}
              </header>
            );

          case "blocks.opening-hour":
            return (
              <section
                key={block.id}
                className="p-4 border rounded-lg bg-gray-100"
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
              <section key={block.id} className="border rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-2">Locatie</h2>
                <div className="aspect-w-16 aspect-h-9 mb-6">
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
      <h3 className="text-xl font-semibold mb-2">Neem contact op</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Voornaam</label>
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Achternaam</label>
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">E-mail</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">
            Telefoonnummer (optioneel)
          </label>
          <input
            type="text"
            name="phonenumber"
            value={formData.phonenumber}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Bericht</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full p-2 border rounded"
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {isSubmitting ? "Versturen..." : "Verstuur"}
        </button>
        {submissionStatus && (
          <p className="text-sm text-gray-600">{submissionStatus}</p>
        )}
      </form>
    </div>
  );
}
