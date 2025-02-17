import { useLoaderData } from "@remix-run/react";
import { getAboutPage } from "../core/modules/SingleTypes/about/api";

type LoaderData = {
  about: any;
};

export async function loader() {
  const about = await getAboutPage();
  console.log(about.data);

  return {
    about: about.data,
  };
}

export default function About() {
  const { about } = useLoaderData() as LoaderData;

  return (
    <div>
      {about.PageContent.map((block: any) => {
        switch (block.__component) {
          case "blocks.header":
            return (
              <header key={block.id}>
                <h1>{block.Title}</h1>
                {block.Subtext && <p>{block.Subtext}</p>}
              </header>
            );

          case "blocks.rich-text-image":
            return (
              <section key={block.id}>
                <h2>{block.Title}</h2>
              </section>
            );

          case "blocks.why":
            return (
              <section key={block.id}>
                <p>Waarom kiezen voor ons?</p>
              </section>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}