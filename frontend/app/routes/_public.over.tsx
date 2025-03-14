import { MetaFunction, useLoaderData } from "@remix-run/react";
import { getAboutPage } from "../core/modules/SingleTypes/about/api";

type LoaderData = {
  about: any;
};

export const meta: MetaFunction = () => {
  return [
    { title: "Over | Fixit Aalst" },
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
    const about = await getAboutPage();

    if (!about || !about.data) {
      throw new Error("Geen data beschikbaar");
    }

    return {
      about: about.data,
    };
  } catch (error) {
    console.error("Fout bij het ophalen van contactgegevens:", error);
    return { about: null };
  }
}

export default function About() {
  const { about } = useLoaderData() as LoaderData;

  return (
    <div className="space-y-6 px-5 md:px-10 lg:px-32">
      {about.PageContent.map((block: any) => {
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

          case "blocks.rich-text-image":
            return (
              <section key={block.id} className="space-y-2">
                <div className="flex flex-col md:flex-row gap-4">
                  <h2 className="text-2xl font-semibold">{block.Title}</h2>
                  <div className="text-gray-700">
                    {block.Text.map((paragraph: any, index: number) => (
                      <p key={index}>
                        {paragraph.children.map((child: any, i: number) => (
                          <span key={i}>{child.text}</span>
                        ))}
                      </p>
                    ))}
                  </div>
                  {block.Image && (
                    <img
                      src={block.Image.url}
                      alt={block.Image.alternativeText}
                      className="w-full md:w-1/2"
                    />
                  )}
                </div>
              </section>
            );

          case "blocks.why":
            return (
              <section key={block.id} className="space-y-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-center">
                  Waarom kiezen voor ons?
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {/* First Card */}
                  <div className="p-6 border rounded-lg bg-gray-100 shadow-sm">
                    <h3 className="text-lg font-semibold mb-2">
                      {block.FirstCard.Title}
                    </h3>
                    <p className="text-sm text-gray-700">
                      {block.FirstCard.Text}
                    </p>
                  </div>

                  {/* Second Card */}
                  <div className="p-6 border rounded-lg bg-gray-100 shadow-sm">
                    <h3 className="text-lg font-semibold mb-2">
                      {block.SecondCard.Title}
                    </h3>
                    <p className="text-sm text-gray-700">
                      {block.SecondCard.Text}
                    </p>
                  </div>

                  {/* Third Card */}
                  <div className="p-6 border rounded-lg bg-gray-100 shadow-sm">
                    <h3 className="text-lg font-semibold mb-2">
                      {block.ThirdCard.Title}
                    </h3>
                    <p className="text-sm text-gray-700">
                      {block.ThirdCard.Text}
                    </p>
                  </div>
                </div>
              </section>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}