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
      
    </div>
  );
}