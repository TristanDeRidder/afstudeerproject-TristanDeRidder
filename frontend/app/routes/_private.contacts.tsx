import { getContactForms } from "../core/modules/contactForm/api";
import { ContactForm } from "../core/modules/contactForm/type";
import { useLoaderData } from "@remix-run/react";

type LoaderData = {
  contact: ContactForm[];
}

export async function loader() {
  try {
    const contacts = await getContactForms();

    if (!contacts?.data) {
      throw new Error("No data available");
    }

    return { contact: contacts.data };
  } catch (error) {
    console.error("Error while fetching data:", error);
    return { contact: [] };
  }
}

export default function Contact() {
  const { contact } = useLoaderData<LoaderData>();

  return (
    <div>
      {contact.map((contact) => (
        <div className="flex gap-4" key={contact.id}>
            <p
            className={
              contact.messageStatus === "Open"
              ? "text-green-500"
              : contact.messageStatus === "Lopend"
              ? "text-blue-500"
              : "text-gray-500"
            }
            >
            {contact.messageStatus}
            </p>
          <p>{contact.firstname} {contact.lastname}</p>
          <p>{contact.subject}</p>
          <p>{contact.email}</p>
          <p>{contact.phonenumber}</p>
          <p>{contact.message}</p>
        </div>
      ))}
    </div>
  );
}
