import { MetaFunction, useLoaderData } from "@remix-run/react";
import { getProtectionPage } from "../core/modules/SingleTypes/protection/api";

type LoaderData = {
  protection: any;
};

export const meta: MetaFunction = () => {
  return [
    { title: "Bescherming | Fixit Aalst" },
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
    const protection = await getProtectionPage();

    if (!protection || !protection.data) {
      throw new Error("Geen data beschikbaar");
    }

    return {
      protection: protection.data,
    };
  } catch (error) {
    console.error("Fout bij het ophalen van beschermingsgegevens:", error);
    return { protection: null };
  }
}

export default function Protection() {
  const { protection } = useLoaderData() as LoaderData;

  if (!protection || !protection.PageContent) {
    return (
      <div className="flex items-center justify-center h-40 bg-gray-100 text-gray-500">
        Geen data beschikbaar
      </div>
    );
  }

  return (
    <div className="space-y-6 px-5 md:px-10 lg:px-32">
      {protection.PageContent.map((block: any) => {
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

          case "blocks.rich-text":
            return (
              <section
                key={block.id}
                className="p-4"
              >
                {block.content?.map((paragraph: any, index: number) => (
                  <p key={index} className="text-gray-700">
                    {paragraph.children.map((child: any, i: number) => (
                      <span key={i}>{child.text}</span>
                    ))}
                  </p>
                ))}
              </section>
            );

          case "blocks.rich-text-image":
            return (
              <section
                key={block.id}
                className="p-4 border rounded-lg bg-gray-50"
              >
                {block.Title && (
                  <h2 className="text-xl font-semibold">{block.Title}</h2>
                )}
                {block.Text?.map((paragraph: any, index: number) => (
                  <p key={index} className="text-gray-700">
                    {paragraph.children.map((child: any, i: number) => (
                      <span key={i}>{child.text}</span>
                    ))}
                  </p>
                ))}
              </section>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
