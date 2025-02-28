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
import ContactBanner from "../components/design/Info/ContactBanner";

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
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [confirmSelection, setConfirmSelection] = useState(false);

  const getImageSrc = () => {
    if (selectedDevice) {
      return selectedDevice.Image?.url;
    }
    return selectedBrand?.Logo?.url;
  };

  const deviceTypes = Array.from(new Set(devices.map((device) => device.Type)));

  return (
    <div>
      <div className="p-4 flex flex-col md:flex-row justify-center items-center h-screen">
        <div className="none md:flex justify-center items-center mb-6 w-1/2">
          <img
            src={getImageSrc()}
            alt={
              selectedDevice
                ? selectedDevice.Name
                : selectedBrand?.BrandName || "Brand Logo"
            }
            className="w-72 h-72 object-contain"
          />
        </div>

        {step === 1 && (
          <div className="md:w-1/2 bg-primary p-4 rounded-md">
            <h2 className="text-xl font-bold">Select a Type</h2>
            {deviceTypes.map((type) => (
              <button
                key={type}
                className="block p-2 my-2 border rounded w-full text-left bg-primaryHelper"
                onClick={() => {
                  setSelectedType(type);
                  setConfirmSelection(true);
                }}
              >
                {type}
              </button>
            ))}
            {confirmSelection && (
              <button
                className="mt-4 p-2 border rounded-lg bg-accent text-text"
                onClick={() => {
                  setStep(2);
                  setConfirmSelection(false);
                }}
              >
                Confirm Selection
              </button>
            )}
          </div>
        )}

        {step === 2 && selectedType && (
          <div className="md:w-1/2 bg-primary p-4">
            <h2 className="text-xl font-bold">Select a Brand</h2>
            {brands.map((brand) => (
              <button
                key={brand.documentId}
                className="block p-2 my-2 border rounded w-full text-left bg-primaryHelper"
                onClick={() => {
                  setSelectedBrand(brand);
                  setConfirmSelection(true);
                }}
              >
                {brand.BrandName}
              </button>
            ))}
            <div className="flex flex-row-reverse justify-end gap-2">
              {confirmSelection && (
                <button
                  className="mt-4 p-2 border rounded-lg bg-accent text-text"
                  onClick={() => {
                    setStep(3);
                    setConfirmSelection(false);
                  }}
                >
                  Confirm Selection
                </button>
              )}
              <button
                className="mt-4 py-2 px-4 rounded bg-accentLight"
                onClick={() => setStep(1)}
              >
                Back
              </button>
            </div>
          </div>
        )}

        {step === 3 && selectedBrand && (
          <div className="md:w-1/2 bg-primary p-4">
            <h2 className="text-xl font-bold mb-4">Select a Model</h2>
            {Array.from(
              new Set(
                devices
                  .filter(
                    (device) =>
                      device.brand?.BrandName === selectedBrand.BrandName &&
                      device.Type === selectedType
                  )
                  .map((device) => device.Model)
              )
            ).map((model) => {
              const modelVariants = devices.filter(
                (device) =>
                  device.Model === model &&
                  device.brand?.BrandName === selectedBrand.BrandName &&
                  device.Type === selectedType
              );

              return (
                <details key={model} className="border rounded mb-2">
                  <summary className="p-2 bg-primaryHelper cursor-pointer">
                    {model}
                  </summary>
                  <div className="p-2">
                    {modelVariants.map((variant) => (
                      <button
                        key={variant.documentId}
                        className={`block w-full p-2 my-1 border rounded text-left ${
                          selectedDevice?.documentId === variant.documentId
                            ? "bg-accent text-white"
                            : "bg-accentLight hover:bg-accent"
                        }`}
                        onClick={() => setSelectedDevice(variant)}
                      >
                        {variant.ModelType || "Standard"}
                      </button>
                    ))}
                  </div>
                </details>
              );
            })}

            {/* Confirm Selection */}
            <div className="flex flex-row gap-2">
              <button
                className="py-2 px-4 rounded bg-accentLight"
                onClick={() => setStep(2)}
              >
                Back
              </button>
              {selectedDevice && (
                <button
                  className="p-2 border rounded-lg bg-accent text-text"
                  onClick={() => setStep(4)}
                >
                  Confirm Selection
                </button>
              )}
            </div>
          </div>
        )}

        {step === 4 && selectedDevice && (
          <div className="md:w-1/2 bg-primary p-4">
            <h2 className="text-xl font-bold">Select a Part</h2>
            {parts.map((part) => (
              <button
                key={part.documentId}
                className={`block p-2 my-2 border rounded w-full text-left ${
                  selectedDevice?.Parts?.find(
                    (devicePart) => devicePart.documentId === part.documentId
                  )
                    ? "bg-accent text-white"
                    : "bg-primaryHelper hover:bg-accent"
                }`}
              >
                {part.Name} - {part.SellingPrice}
              </button>
            ))}
            <div className="flex justify-between items-center mt-4">
              <button
                className="py-2 px-4 rounded bg-accentLight"
                onClick={() => setStep(3)}
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
      <ContactBanner />
    </div>
  );
}
