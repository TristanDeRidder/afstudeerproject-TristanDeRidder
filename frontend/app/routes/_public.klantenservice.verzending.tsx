import { MetaFunction, useLoaderData } from "@remix-run/react";

import { getShipmentPage } from "../core/modules/SingleTypes/shipment/api";

type LoaderData = {
  shipment: any;
};

export const meta: MetaFunction = () => {
  return [
    { title: "Klantendienst - Verzending | Fixit Aalst" },
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
    const shipment = await getShipmentPage();

    if (!shipment || !shipment.data) {
      throw new Error("Geen data beschikbaar");
    }

    return {
      shipment: shipment.data,
    };
  } catch (error) {
    console.error(
      "Fout bij het ophalen van moederbordherstelling gegevens:",
      error
    );
    return { shipment: null };
  }
}

export default function Shipment() {
  const { shipment } = useLoaderData() as LoaderData;

  if (!shipment || !shipment.PageContent) {
    return (
      <div className="flex items-center justify-center h-40 bg-gray-100 text-gray-500">
        Geen data beschikbaar
      </div>
    );
  }

  return (
    <div className="space-y-6 px-5 md:px-10 lg:px-32 w-2/3 mx-auto">
      {shipment.PageContent.map((block: any) => {
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
              <section key={block.id} className="p-4">
                {block.content?.map((paragraph: any, index: number) => (
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
