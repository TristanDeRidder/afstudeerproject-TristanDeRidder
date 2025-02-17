import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";

// Components
import SecondaryTitle from "../components/design/Title/SecondaryTitle";
import PrimaryTitle from "../components/design/Title/PrimaryTitle";
import BrandAnimation from "../components/design/Animation/BrandAnimation";

// API
import { getBrands } from "../core/modules/brands/api";

// Loader om data server-side op te halen
export async function loader() {
  const brands = await getBrands();
  return json({ brands: brands.data });
}

export default function Index() {
  const { brands } = useLoaderData<typeof loader>();

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

      {/* ✅ Data als props doorgeven aan BrandAnimation */}
      <BrandAnimation brands={brands} />

      <SecondaryTitle
        title="Veelvoorkomende herstellingen"
        subtitle="Alle merken van smartphones tot tablets, smartwatches tot consoles."
      />
      <SecondaryTitle title="Waarom kiezen voor Fixit?" />
    </>
  );
}
