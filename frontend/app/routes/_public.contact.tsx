import { useLoaderData } from "@remix-run/react";
import { getContactPage } from "../core/modules/SingleTypes/contact/api";

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

          default:
            return null;
        }
      })}
    </div>
  );
}
