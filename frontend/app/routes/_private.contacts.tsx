import { getContactForms } from "../core/modules/contactForm/api";
import { ContactForm } from "../core/modules/contactForm/type";
import { useLoaderData } from "@remix-run/react";
import DashboardTitle from "../components/design/Title/DashboardTitle";

type LoaderData = {
  contact: ContactForm[];
}

export async function loader() {
  try {
    const contact = await getContactForms();

    if (!contact.length) {
      throw new Error("No data available");
    }

    return { contact };
  } catch (error) {
    console.error("Error while fetching data:", error);
    return { contact: [] };
  }
}

export default function Contact() {
  const { contact } = useLoaderData() as LoaderData;

  return (
    <div>
      <div className="flex justify-between items-end mb-4 mt-9">
        <DashboardTitle title="Contacten" />
      </div>

      <div className="flex flex-col gap-4">
        {/* Table */}
        <div className="bg-primaryHelper rounded-md">
          <div className="flex justify-between font-bold px-4 py-2">
            <div className="px-4 py-2 w-1/5">Status</div>
            <div className="px-4 py-2 w-1/5">Naam</div>
            <div className="px-4 py-2 w-1/5">Onderwerp</div>
            <div className="px-4 py-2 w-1/5">E-mail</div>
            <div className="px-4 py-2 w-1/5">Telefoonnummer</div>
          </div>

          <div className="px-4 py-2 rounded-md">
            {contact.length > 0 ? (
              contact.map((contact) => (
                <div
                  key={contact.id}
                  className="flex justify-between bg-accentLight mt-2 rounded-md relative group"
                >
                  {/* Contact details */}
                  <div className="px-4 py-2 w-1/5">
                    <p
                      className={
                        contact.messageStatus === "Open"
                          ? "bg-green-500 text-white rounded-md w-fit px-2"
                          : contact.messageStatus === "Lopend"
                          ? "bg-blue-500 text-white rounded-md w-fit px-2"
                          : "bg-gray-500 text-white rounded-md w-fit px-2"
                      }
                    >
                      {contact.messageStatus}
                    </p>
                  </div>
                  <div className="px-4 py-2 w-1/5">
                    {contact.firstname} {contact.lastname}
                  </div>
                  <div className="px-4 py-2 w-1/5">{contact.subject}</div>
                  <div className="px-4 py-2 w-1/5">{contact.email}</div>
                  <div className="px-4 py-2 w-1/5">{contact.phonenumber}</div>

                  {/* Hover popup for the message */}
                  <div className="absolute top-0 left-0 w-full h-full bg-black text-white flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="px-4 py-2">{contact.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-center">
                Geen contactberichten gevonden
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
