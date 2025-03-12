import { useLoaderData } from "@remix-run/react";
import { getB2BPage } from "../core/modules/SingleTypes/b2b/api";

type LoaderData = {
  business: any;
};

export async function loader() {
  try {
    const business = await getB2BPage();

    if (!business || !business.data) {
      throw new Error("Geen data beschikbaar");
    }

    return {
      business: business.data,
    };
  } catch (error) {
    console.error("Fout bij het ophalen van B2B-gegevens:", error);
    return { business: null };
  }
}

export default function B2B() {
  const { business } = useLoaderData() as LoaderData;

  if (!business || !business.PageContent) {
    return (
      <div className="flex items-center justify-center h-40 bg-gray-100 text-gray-500">
        Geen data beschikbaar
      </div>
    );
  }

  return (
    <div className="space-y-6 px-5 md:px-10 lg:px-32">
      {business.PageContent.map((block: any) => {
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
                className="p-4 border rounded-lg bg-gray-100"
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

          default:
            return null;
        }
      })}
    </div>
  );
}
