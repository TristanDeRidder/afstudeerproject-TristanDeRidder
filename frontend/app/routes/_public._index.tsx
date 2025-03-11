import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";

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
    <div className="flex flex-col gap-10">
      {/* Hero Section */}
      <div className="px-5 md:px-10 lg:px-32 flex flex-col gap-8">
        <PrimaryTitle
          title="Een snelle herstellingen voor uw Smartphone"
          subtitle=""
        />

        <div className="flex flex-col md:flex-row justify-center gap-4 bg-primary p-2 rounded-xl md:p-6 lg:p-10 md:rounded-lg md:gap-8 lg:gap-10">
          <RepairCard
            title="Herstel een smartphone"
            images={images["20"]}
            url="repair"
          />
          <RepairCard
            title="Herstel een tablet"
            images={images["21"]}
            url="repair"
          />
          <RepairCard
            title="Herstel een laptop"
            images={images["22"]}
            url="repair"
          />
        </div>
      </div>

      <BrandAnimation brands={brands} />

      {/* Top Devices Section */}
      <div className="px-5 md:px-16 lg:px-32">
        <SecondaryTitle
          title="Veelvoorkomende herstellingen"
          subtitle="Alle merken van smartphones tot tablets, smartwatches tot consoles."
        />

        <div className="flex flex-col gap-5 items-center">
          <div className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topDevices && topDevices.length === 0 ? (
              <p>Geen apparaten gevonden...</p>
            ) : (
              topDevices?.map((device: Devices) => (
                <div
                  key={device.documentId}
                  className="bg-primaryHelper p-5 rounded-lg min-w-[45%] sm:min-w-[50%] md:w-full snap-center"
                >
                  <img
                    src={device.image?.url}
                    alt={device.model}
                    className="h-40 object-cover mt-3"
                  />
                  <h3 className="text-lg font-bold">
                    {device.model} {device.modelType}
                  </h3>
                  <p className="text-sm">Status: {device.modelNumber}</p>
                </div>
              ))
            )}
          </div>

          <Link
            to="repair"
            className="bg-secondary text-white p-3 rounded-lg text-center hover:bg-accent hover:text-text transition-all w-full md:w-auto"
          >
            Alle reparaties
          </Link>
        </div>
      </div>

      {/* Why Choose Fixit Section */}
      <div className="bg-accentLight p-10 rounded-lg px-5 md:px-16 lg:px-32">
        <SecondaryTitle title="Waarom kiezen voor Fixit?" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-10 pb-5">
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
                  className="bg-bg p-6 rounded-lg flex items-start gap-4"
                >
                  <div>
                    <h4 className="text-lg md:text-xl font-semibold mb-3">
                      {card.Title}
                    </h4>
                    <p className="text-sm md:text-base">{card.Text}</p>
                  </div>
                  {card.Icon && (
                    <img
                      src={card.Icon.url}
                      alt={card.Title}
                      className="w-12 h-12"
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
