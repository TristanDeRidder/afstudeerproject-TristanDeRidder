import { useLoaderData } from "@remix-run/react";
import { getAboutPage } from "../core/modules/SingleTypes/about/api";

type LoaderData = {
  about: any;
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
    <div className="space-y-6">
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
              </section>
            );

          case "blocks.why":
            return (
              <div key={block.id} className="p-4 border rounded-lg bg-gray-100">
                <p className="text-lg font-semibold">Waarom kiezen voor ons?</p>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}