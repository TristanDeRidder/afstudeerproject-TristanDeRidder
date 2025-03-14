import { MetaFunction, useLoaderData } from "@remix-run/react";
import { getFAQs } from "../core/modules/faq/api";
import PrimaryTitle from "../components/design/Title/PrimaryTitle";
import Accordion from "../components/design/Accordion/Accordion";

type LoaderData = {
  faqs: any;
};

export const meta: MetaFunction = () => {
  return [
    { title: "FAQ | Fixit Aalst" },
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
    <div className="px-5 md:px-10 lg:px-32 flex flex-col gap-14 bg-white">
      <PrimaryTitle title="FAQ" />
      <Accordion items={faqs} />
    </div>
  );
}
