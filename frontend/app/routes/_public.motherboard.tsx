import { useLoaderData } from "@remix-run/react";
import { getMotherboardPage } from "../core/modules/SingleTypes/motherboard/api";

type LoaderData = {
  motherboard: any;
};

export async function loader() {
  try {
    const motherboard = await getMotherboardPage();

    if (!motherboard || !motherboard.data) {
      throw new Error("Geen data beschikbaar");
    }

    return {
      motherboard: motherboard.data,
    };
  } catch (error) {
    console.error(
      "Fout bij het ophalen van moederbordherstelling gegevens:",
      error
    );
    return { motherboard: null };
  }
}

export default function Motherboard() {
  const { motherboard } = useLoaderData() as LoaderData;

  if (!motherboard || !motherboard.PageContent) {
    return (
      <div className="flex items-center justify-center h-40 bg-gray-100 text-gray-500">
        Geen data beschikbaar
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {motherboard.PageContent.map((block: any) => {
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
              <section
                key={block.id}
                className="p-4 border rounded-lg bg-gray-100"
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
