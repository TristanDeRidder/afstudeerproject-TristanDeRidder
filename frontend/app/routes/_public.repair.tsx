import { useState } from "react";
import { useLoaderData } from "@remix-run/react";

// API
import { getBrands } from "../core/modules/brands/api";
import { getDevices } from "../core/modules/devices/api";
import { getParts } from "../core/modules/parts/api";

// Types
import { Brand } from "../core/modules/brands/type";
import { Devices } from "../core/modules/devices/type";
import { Parts } from "../core/modules/parts/type";

type LoaderData = {
  brands: Brand[];
  devices: Devices[];
  parts: Parts[];
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
    return { brands: [], devices: [], parts: [] };
  }
}

export default function Repair() {
  const { brands, devices, parts } = useLoaderData<LoaderData>();

  const [step, setStep] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<Devices | null>(null);

  return (
    <div className="p-4">
      {/* Step 1: Select a Brand */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-bold">Select a Brand</h2>
          {brands.map((brand) => (
            <button
              key={brand.documentId}
              className="block p-2 my-2 border rounded w-full text-left"
              onClick={() => {
                console.log(
                  `Brand selected: ${brand.BrandName} (${brand.documentId})`
                );
                setSelectedBrand(brand);
                setStep(2);
              }}
            >
              {brand.BrandName}
            </button>
          ))}
        </div>
      )}

      {/* Step 2: Select a Device */}
      {step === 2 && selectedBrand && (
        <div>
          <h2 className="text-xl font-bold">Select a Model</h2>
          {devices
            .filter(
              (device) => device.Brand?.documentId === selectedBrand.documentId
            )
            .map((device) => (
              <button
                key={device.documentId}
                className="block p-2 my-2 border rounded w-full text-left"
                onClick={() => {
                  console.log(`Device selected: ${device.documentId}`);
                  setSelectedDevice(device);
                  setStep(3);
                }}
              >
                {device.Name} - {device.ModelNumber}
              </button>
            ))}
          {devices.filter(
            (device) => device.Brand?.documentId === selectedBrand.documentId
          ).length === 0 && <p>No devices found for this brand.</p>}
          {console.log(
            devices)}
          <button
            className="mt-4 p-2 border rounded"
            onClick={() => setStep(1)}
          >
            Back
          </button>
        </div>
      )}

      {/* Step 3: Select Parts */}
      {step === 3 && selectedDevice && (
        <div>
          <h2 className="text-xl font-bold">Available Parts</h2>
          {parts
            .filter(
              (part) => part.device?.documentId === selectedDevice.documentId
            )
            .map((part) => (
              <div key={part.documentId} className="p-2 border rounded my-2">
                {part.Name} - ${part.SellingPrice}
              </div>
            ))}
          {parts.filter(
            (part) => part.device?.documentId === selectedDevice.documentId
          ).length === 0 && <p>No parts found for this device.</p>}
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
