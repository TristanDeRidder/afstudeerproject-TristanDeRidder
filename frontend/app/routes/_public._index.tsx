import { json } from "@remix-run/node";
import { useLoaderData, Link, MetaFunction } from "@remix-run/react";

// Components
import SecondaryTitle from "../components/design/Title/SecondaryTitle";
import PrimaryTitle from "../components/design/Title/PrimaryTitle";
import BrandAnimation from "../components/design/Animation/BrandAnimation";

// API
import { getBrands } from "../core/modules/brands/api";
import { getTopDevices } from "../core/modules/devices/api";
import { getWhyCard } from "../core/modules/SingleTypes/why/api";

// Types
import { Devices } from "../core/modules/devices/type";
import ContactBanner from "../components/design/Info/ContactBanner";
import RepairCard from "../components/design/Card/RepairCard";
import { getImageById } from "../components/.server/images/getImage";
import { Brand } from "../core/modules/brands/type";

type LoaderData = {
  brands: Brand[];
  topDevices: any;
  whyCards: {
    PageContent: {
      id: number;
      Title: string;
      Text: string;
      Icon: {
        url: string;
      } | null; // in case Icon might be null
    }[];
  };
};

export const meta: MetaFunction = () => {
  return [
    { title: "Fixit Aalst | Smartphone, Tablet & Laptop Herstellingen" },
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
    const brands = await getBrands();
    const topDevices = await getTopDevices();
    const whyCards = await getWhyCard();
  
    // Collect all image IDs you need
    const repairImages = ["20", "21", "22"]; // Replace with real IDs
  
    // Fetch all images in parallel
    const imageResponses = await Promise.all(
      repairImages.map((id) => getImageById({ id }))
    );

  
    // Create an object mapping IDs to URLs
    const images = imageResponses.reduce((acc, image) => {
      acc[image.id] = image.url;
      return acc;
    }, {} as Record<string, string>);
  
    return {
      brands: brands.data,
      topDevices,
      whyCards: whyCards.data,
      images,
    };
  } catch (error) {
    console.error(error);
    return json({ error: "An error occurred while fetching data" }, 500);
  }
}

export default function Index() {
  const { brands, topDevices, whyCards, images } = useLoaderData() as LoaderData & { images: Record<string, string> };

  return (
    <div className="flex flex-col gap-10 2xl:gap-16">
      {/* Hero Section */}
      <div className="px-5 md:px-10 lg:px-32 xl:px-40 2xl:px-56 flex flex-col gap-8 2xl:gap-12">
        <PrimaryTitle
          title="Een snelle herstellingen voor uw Smartphone"
          subtitle=""
        />

        <div className="flex flex-col md:flex-row justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 bg-primary px-4 py-4 md:px-8 lg:px-12 xl:px-16 rounded-3xl md:rounded-lg mx-auto max-w-screen-xl overflow-hidden">
          <RepairCard
            title="Herstel een smartphone"
            images={images["20"]}
            url="herstelling"
          />
          <RepairCard
            title="Herstel een tablet"
            images={images["21"]}
            url="herstelling"
          />
          <RepairCard
            title="Herstel een laptop"
            images={images["22"]}
            url="herstelling"
          />
        </div>
      </div>

      <BrandAnimation brands={brands} />

      {/* Top Devices Section */}
      <div className="px-5 md:px-16 lg:px-32 xl:px-40 2xl:px-56">
        <SecondaryTitle
          title="Veelvoorkomende herstellingen"
          subtitle="Alle merken van smartphones tot tablets, smartwatches tot consoles."
        />

        <div className="flex flex-col gap-5 2xl:gap-10 items-center">
          <div className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 2xl:gap-12">
            {topDevices && topDevices.length === 0 ? (
              <p>Geen apparaten gevonden...</p>
            ) : (
              topDevices?.map((device: Devices) => (
                <div
                  key={device.documentId}
                  className="border border-primaryHelper flex flex-col gap-2 p-5 2xl:p-6 rounded-lg min-w-[70%] sm:min-w-[50%] md:w-full snap-center"
                >
                  <img
                    src={device.image?.url}
                    alt={device.model}
                    className="h-40 2xl:h-52 object-contain mt-3"
                  />
                  <h3 className="text-lg md:text-xl 2xl:text-2xl font-bold">
                    {device.model} {device.modelType}
                  </h3>
                  <p className="text-sm md:text-base">
                    modelnummer: {device.modelNumber}
                  </p>
                </div>
              ))
            )}
          </div>

          <Link
            to="herstelling"
            className="bg-secondary text-white p-3 2xl:p-5 rounded-lg text-center hover:bg-accent hover:text-text transition-all w-full md:w-auto"
          >
            Alle reparaties
          </Link>
        </div>
      </div>

      {/* Why Choose Fixit Section */}
      <div className="bg-accentLight p-10 xl:p-16 2xl:p-20 rounded-lg px-5 md:px-16 lg:px-32 xl:px-40 2xl:px-56">
        <SecondaryTitle title="Waarom kiezen voor Fixit?" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 2xl:gap-12 mt-10 pb-5">
          {whyCards && whyCards.PageContent.length > 0 ? (
            whyCards.PageContent.map(
              (card: {
                id: number;
                Title: string;
                Text: string;
                Icon: { url: string } | null;
              }) => (
                <div
                  key={card.id}
                  className="bg-bg p-6 2xl:p-10 rounded-lg flex items-start gap-4 2xl:gap-8"
                >
                  <div>
                    <h4 className="text-lg md:text-xl 2xl:text-2xl font-semibold mb-3">
                      {card.Title}
                    </h4>
                    <p className="text-sm md:text-base 2xl:text-lg">
                      {card.Text}
                    </p>
                  </div>
                  {card.Icon && (
                    <img
                      src={card.Icon.url}
                      alt={card.Title}
                      className="w-12 h-12 2xl:w-16 2xl:h-16"
                    />
                  )}
                </div>
              )
            )
          ) : (
            <p>Geen gegevens beschikbaar voor "Waarom kiezen voor Fixit?"</p>
          )}
        </div>
      </div>

      <ContactBanner />
    </div>
  );
}
