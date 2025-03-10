import { useLoaderData } from "@remix-run/react";
import { getFAQs } from "../core/modules/faq/api";
import PrimaryTitle from "../components/design/Title/PrimaryTitle";
import Accordion from "../components/design/Accordion/Accordion";

type LoaderData = {
  faqs: any;
};

export async function loader() {
  try {
    const faqs = await getFAQs();

    if (!faqs || !faqs.data) {
      throw new Error("Geen data beschikbaar");
    }

    return {
      faqs: faqs.data,
    };
  } catch (error) {
    console.error("Error while fetching faqs:", error);
    return { faqs: null };
  }
}

export default function Faq() {
  const { faqs } = useLoaderData() as LoaderData;

  return (
    <div className="flex flex-col gap-14 bg-white">
      <PrimaryTitle title="FAQ" />
      <Accordion items={faqs} />
    </div>
  );
}
