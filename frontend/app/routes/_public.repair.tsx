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

  // New state for search functionality
  const [searchQuery, setSearchQuery] = useState<string>("");

  const getImageSrc = () => {
    if (selectedDevice) {
      return selectedDevice.image?.url;
    }
    return selectedBrand?.logo?.url;
  };

  const deviceTypes = Array.from(new Set(devices.map((device) => device.type)));

  // Handle search input and filter devices and parts
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    const foundDevice = devices.find(
      (device) =>
      device.model.toLowerCase().includes(event.target.value.toLowerCase()) ||
      (device.modelType && device.modelType.toLowerCase().includes(event.target.value.toLowerCase()))
    );

    console.log(foundDevice);

    if (foundDevice) {
      setSelectedDevice(foundDevice); // Automatically select device based on search
      setStep(4); // Skip the steps and go straight to parts
    } else {
      setSelectedDevice(null); // Reset if no device is found
      setStep(1); // Show the first step
    }
  };

  return (
    <div>
      <div className="p-4 flex flex-col justify-center items-center h-screen">
        {/* Search Bar */}
        <div className="md:w-1/2 p-4">
          <input
            type="text"
            placeholder="Search for a device..."
            value={searchQuery}
            onChange={handleSearch}
            className="block w-full p-2 mb-4 border rounded"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full">
          {/* Device Image Display */}
          <div className="none md:flex justify-center items-center mb-6 w-1/2">
            <img
              src={getImageSrc()}
              alt={
                selectedDevice
                  ? selectedDevice.model
                  : selectedBrand?.brandName || "Brand Logo"
              }
              className="w-72 h-72 object-contain"
            />
          </div>

          {/* Step 1: Select a Type */}
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

          {/* Step 2: Select a Brand */}
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
                  {brand.brandName}
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

          {/* Step 3: Select a Model */}
          {step === 3 && selectedBrand && (
            <div className="md:w-1/2 bg-primary p-4">
              <h2 className="text-xl font-bold mb-4">Select a Model</h2>
              {Array.from(
                new Set(
                  devices
                    .filter(
                      (device) =>
                        device.brand?.brandName === selectedBrand.brandName &&
                        device.type === selectedType
                    )
                    .map((device) => device.model)
                )
              ).map((model) => {
                const modelVariants = devices.filter(
                  (device) =>
                    device.model === model &&
                    device.brand?.brandName === selectedBrand.brandName &&
                    device.type === selectedType
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
                          {variant.modelType || "Standard"}
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

          {/* Step 4: Select a Part */}
          {step === 4 && selectedDevice && (
            <div className="md:w-1/2 bg-primary p-4">
              <h2 className="text-xl font-bold">Select a Part</h2>
              {parts.map((part) => (
                <button
                  key={part.documentId}
                  className={`block p-2 my-2 border rounded w-full text-left ${
                    selectedDevice?.parts?.find(
                      (devicePart: any) => devicePart.documentId === part.documentId
                    )
                      ? "bg-accent text-white"
                      : "bg-primaryHelper hover:bg-accent"
                  }`}
                >
                  {part.name} - {part.sellingPrice}
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
      </div>
      <ContactBanner />
    </div>
  );
}
