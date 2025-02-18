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
    <>
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

      <BrandAnimation brands={brands} />

      <SecondaryTitle
        title="Veelvoorkomende herstellingen"
        subtitle="Alle merken van smartphones tot tablets, smartwatches tot consoles."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topDevices && topDevices.length === 0 ? (
          <p>Geen apparaten gevonden...</p>
        ) : (
          topDevices?.map((device: Devices) => (
            <div
              key={device.documentId}
              className="bg-primaryHelper p-5 rounded-lg"
            >
              <h3 className="text-lg font-bold">{device.Name}</h3>
              <p className="text-sm">Status: {device.ModelNumber}</p>
            </div>
          ))
        )}
      </div>

      <SecondaryTitle title="Waarom kiezen voor Fixit?" />

      {/* Why Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {Array.isArray(whyCards) && whyCards.length > 0 ? (
          whyCards.map((card: { id: number; Title: string; Text: string }) => (
            <div
              key={card.id}
              className="bg-primaryHelper p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all"
            >
              <h4 className="text-xl font-semibold mb-3">{card.Title}</h4>
              <p className="text-sm">{card.Text}</p>
            </div>
          ))
        ) : (
          <p>Geen gegevens beschikbaar voor "Waarom kiezen voor Fixit?"</p>
        )}
      </div>
    </>
  );
}
