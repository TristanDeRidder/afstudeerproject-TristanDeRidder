import { getContactForms } from "../core/modules/contactForm/api";
import { ContactForm } from "../core/modules/contactForm/type";
import { useLoaderData } from "@remix-run/react";
import DashboardTitle from "../components/design/Title/DashboardTitle";
import { useState } from "react";

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
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-4 mt-9">
        <DashboardTitle title="Contacten" />
      </div>

      <div className="flex flex-col gap-4">
        {/* Table */}
        <div className="bg-dashboardSidebar rounded-md">
          <div className="flex justify-between font-bold px-4 py-2">
            <div className="px-4 py-2 w-1/5">Status</div>
            <div className="px-4 py-2 w-1/5">Naam</div>
            <div className="px-4 py-2 w-1/5">Onderwerp</div>
            <div className="px-4 py-2 w-1/5">E-mail</div>
            <div className="px-4 py-2 w-1/5">Telefoonnummer</div>
          </div>

          <div className="px-4 py-2 rounded-md overflow-y-auto h-[35rem] 2xl:h-[45rem]">
            {contact.length > 0 ? (
              contact.map((contact, index) => (
                <div key={index} className="mt-2">
                  {/* Clickable row */}
                  <div
                    className="flex justify-between bg-accentLight rounded-md p-2 cursor-pointer"
                    onClick={() => toggleAccordion(index)}
                  >
                    {/* Contact details */}
                    <div className="px-4 py-2 w-1/5">
                      <p
                        className={`text-white rounded-md w-fit px-2 ${
                          contact.messageStatus === "Open"
                            ? "bg-green-500"
                            : contact.messageStatus === "Lopend"
                            ? "bg-blue-500"
                            : "bg-gray-500"
                        }`}
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
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      openIndex === index
                        ? "max-h-60 opacity-100 p-4 border-t"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <p>{contact.message}</p>
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
