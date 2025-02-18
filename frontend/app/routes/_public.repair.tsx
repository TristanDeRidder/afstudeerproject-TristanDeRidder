import { useState } from "react";
import { useLoaderData } from "@remix-run/react";
import { getBrands } from "../core/modules/brands/api";
import { getDevices } from "../core/modules/devices/api";
import { getParts } from "../core/modules/parts/api";

type Brand = { id: number; BrandName: string };
type Device = {
  id: number;
  Name: string;
  ModelNumber: string;
  BrandId: number;
};
type Part = { id: number; Name: string; DeviceId: number };

type LoaderData = {
  brands: Brand[];
  devices: Device[];
  parts: Part[];
};

export async function loader() {
  try {
    const brands = await getBrands();
    const devices = await getDevices();
    const parts = await getParts();

    if (!brands?.data || !devices?.data || !parts?.data) {
      throw new Error("No data available");
    }

    return { brands: brands.data, devices: devices.data, parts: parts.data };
  } catch (error) {
    console.error("Error while fetching data:", error);
    return { brands: [], devices: [], parts: [] }; // Return empty arrays as fallback
  }
}

export default function Repair() {
  const { brands, devices, parts } = useLoaderData<LoaderData>();

  const [step, setStep] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);
  const [selectedModel, setSelectedModel] = useState<number | null>(null);

  return (
    <div className="p-4">
      {/* Step 1: Select a Brand */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-bold">Select a Brand</h2>
          {brands.map((brand) => (
            <button
              key={brand.id}
              className="block p-2 my-2 border rounded w-full text-left"
              onClick={() => {
                console.log(`Brand selected: ${brand.documentId}`);
                setSelectedBrand(brand.id);
                setStep(2);
              }}
            >
              {brand.BrandName}
            </button>
          ))}
        </div>
      )}

      {/* Step 2: Select a Model */}
      {step === 2 && selectedBrand !== null && (
        <div>
          <h2 className="text-xl font-bold">Select a Model</h2>
          {devices
            .filter((device) => device.BrandId === selectedBrand)
            .map((device) => (
                console.log(device),
              <button
                key={device.Name}
                className="block p-2 my-2 border rounded w-full text-left"
                onClick={() => {
                  setSelectedModel(device.id);
                  setStep(3);
                }}
              >
                {device.Name} - {device.ModelNumber}
              </button>
            ))}
          <button
            className="mt-4 p-2 border rounded"
            onClick={() => setStep(1)}
          >
            Back
          </button>
        </div>
      )}

      {/* Step 3: Select Parts */}
      {step === 3 && selectedModel !== null && (
        <div>
          <h2 className="text-xl font-bold">Available Parts</h2>
          {parts
            .filter((part) => part.DeviceId === selectedModel)
            .map((part) => (
              <div key={part.id} className="p-2 border rounded my-2">
                {part.Name}
              </div>
            ))}
          <button
            className="mt-4 p-2 border rounded"
            onClick={() => setStep(2)}
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}
