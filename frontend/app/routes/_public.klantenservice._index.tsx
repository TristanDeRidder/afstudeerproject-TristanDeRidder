import { MetaFunction } from "@remix-run/react";


import PrimaryTitle from "../components/design/Title/PrimaryTitle";
import ServiceLink from "../components/design/Link/ServiceLink";

type LoaderData = {
  contact: any;
};

export const meta: MetaFunction = () => {
  return [
    { title: "Klantenservice | Fixit Aalst" },
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

export default function Contact() {
  return (
    <div>
      <PrimaryTitle title="Klantenservice" />
      <div className="flex flex-wrap gap-4 justify-center mx-5 lg:mx-32 mt-6">
        <ServiceLink url="/klantenservice/betaling" text="Betaling" />
        <ServiceLink url="/klantenservice/garantie" text="Garantie" />
        <ServiceLink url="/klantenservice/verzending" text="Verzending" />
        <ServiceLink url="/klantenservice/welk-toestel" text="Welk toestel?" />
        <ServiceLink url="/klantenservice/parking" text="Parking" />
        <ServiceLink url="/klantenservice/winkel" text="Winkel" />
      </div>
    </div>
  );
}
