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

type LoaderData = {
  brands: any;
  topDevices: any;
  whyCards: any;
};

export async function loader() {
  const brands = await getBrands();
  const topDevices = await getTopDevices();
  const whyCards = await getWhyCard();

  return { brands: brands.data, topDevices, whyCards: whyCards.data }; // ✅ Gebruik `data`
}

export default function Index() {
  const { brands, topDevices, whyCards } = useLoaderData() as LoaderData;

  return (
    <div className="flex flex-col gap-10">
      <div className="px-5 lg:px-32 flex flex-col gap-8">
        <PrimaryTitle
          title="Fixit"
          subtitle="Snelle herstellingen voor uw Smartphone"
        />

        <div className="flex flex-col lg:flex-row justify-center gap-10 bg-primary p-3 lg:p-10 rounded-lg">
          <div className="bg-primaryHelper p-10 rounded-lg flex flex-col gap-5">
            <Link to="repair">Herstel een smartphone</Link>
            <div className="group border-accent text-accent hover:text-secondary hover:border-secondary p-4">
              <img src="" alt="Device Image" />
              <span className="border rounded-full p-2 border-accent group-hover:border-secondary">
                {"->"}
              </span>
            </div>
          </div>
          <div className="bg-primaryHelper p-10 rounded-lg flex flex-col gap-5">
            <Link to="repair">Herstel een tablet</Link>
            <div className="group border-accent text-accent hover:text-secondary hover:border-secondary p-4">
              <img src="" alt="Device Image" />
              <span className="border rounded-full p-2 border-accent group-hover:border-secondary">
                {"->"}
              </span>
            </div>
          </div>
          <div className="bg-primaryHelper p-10 rounded-lg flex flex-col gap-5">
            <Link to="repair">Herstel een laptop</Link>
            <div className="group border-accent text-accent hover:text-secondary hover:border-secondary p-4">
              <img src="" alt="Device Image" />
              <span className="border rounded-full p-2 border-accent group-hover:border-secondary">
                {"->"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <BrandAnimation brands={brands} />

      <div className="px-5 lg:px-32">
        <SecondaryTitle
          title="Veelvoorkomende herstellingen"
          subtitle="Alle merken van smartphones tot tablets, smartwatches tot consoles."
        />

        <div className="flex flex-col gap-5 items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topDevices && topDevices.length === 0 ? (
              <p>Geen apparaten gevonden...</p>
            ) : (
              topDevices?.map((device: Devices) => (
                <div
                  key={device.documentId}
                  className="bg-primaryHelper p-5 rounded-lg w-full"
                >
                  <h3 className="text-lg font-bold">
                    {device.Model} {device.ModelType}
                  </h3>
                  <p className="text-sm">Status: {device.ModelNumber}</p>
                </div>
              ))
            )}
          </div>

          <Link
            to="repair"
            className="bg-secondary text-white p-3 rounded-lg text-center hover:bg-accent hover:text-text transition-all"
          >
            Alle reparaties
          </Link>
        </div>
      </div>

      <div className="bg-accentLight p-10 rounded-lg">
        <SecondaryTitle title="Waarom kiezen voor Fixit?" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-10 pb-5">
          {whyCards && whyCards.PageContent.length > 0 ? (
            whyCards.PageContent.map(
              (card: { id: number; Title: string; Text: string; Icon: string }) => (
                <div
                  key={card.id}
                  className="bg-primaryHelper p-6 rounded-lg flex items-center"
                >
                  <div>
                    <h4 className="text-xl font-semibold mb-3">{card.Title}</h4>
                    <p className="text-sm">{card.Text}</p>
                  </div>
                  <img src={card.Icon} alt={card.Title} />
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
