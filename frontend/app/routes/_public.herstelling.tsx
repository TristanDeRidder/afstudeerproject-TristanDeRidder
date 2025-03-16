import { useState } from "react";
import { MetaFunction, useLoaderData } from "@remix-run/react";

// API
import { getBrands } from "../core/modules/brands/api";
import { getDevices } from "../core/modules/devices/api";
import { getParts } from "../core/modules/parts/api";

// Types
import { Brand } from "../core/modules/brands/type";
import { Devices } from "../core/modules/devices/type";
import { Parts } from "../core/modules/parts/type";
import ContactBanner from "../components/design/Info/ContactBanner";
import { getImageById } from "../components/.server/images/getImage";

type LoaderData = {
  images: any;
  brands: Brand[];
  devices: Devices[];
  parts: Parts[];
};

export const meta: MetaFunction = () => {
  return [
    { title: "Herstellingen | Fixit Aalst" },
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
    const images = await getImageById({ id: "3" });
    const brands = await getBrands();
    const devices = await getDevices(); // Now returns an array instead of { data: [...] }
    const parts = await getParts();

    if (!brands?.data || !devices.length || !parts?.data) {
      throw new Error("No data available");
    }

    return {
      images,
      brands: brands.data,
      devices, // Already an array, no need for `devices.data`
      parts: parts.data,
    };
  } catch (error) {
    console.error("Error while fetching data:", error);
    return { brands: [], devices: [], parts: [] };
  }
}

export default function Repair() {
  const { images, brands, devices, parts } = useLoaderData<LoaderData>();

  const [step, setStep] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<Devices | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [confirmSelection, setConfirmSelection] = useState(false);

  // New state for search functionality
  const [searchQuery, setSearchQuery] = useState<string>("");

  const getImageSrc = () => {
    if (selectedDevice?.image?.url) {
      return selectedDevice.image.url;
    }
    if (selectedBrand?.logo?.url) {
      return selectedBrand.logo.url;
    }
    return images?.url 
  };

  const deviceTypes = Array.from(new Set(devices.map((device) => device.type)));

  // Handle search input and filter devices and parts
  const [notFound, setNotFound] = useState(false);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    const foundDevice = devices.find(
      (device) =>
        device.model.toLowerCase().includes(event.target.value.toLowerCase()) ||
        (device.modelType &&
          device.modelType
            .toLowerCase()
            .includes(event.target.value.toLowerCase()))
    );

    if (foundDevice) {
      setSelectedDevice(foundDevice);
      setSelectedBrand(foundDevice.brand);
      setSelectedType(foundDevice.type);
      setStep(3);
      setNotFound(false); // Reset "not found" state
    } else {
      setSelectedDevice(null);
      setStep(1); // Optionally stay at step 1 or adjust as needed
      setNotFound(true); // Trigger "not found" message
    }
  };

  return (
    <div className="px-4 sm:px-8 lg:px-32 py-4 flex flex-col justify-center items-center">
      {/* Search Bar */}
      <div className="w-full max-w-md p-4">
        <input
          type="text"
          placeholder="Zoek naar een toestel"
          value={searchQuery}
          onChange={handleSearch}
          className="block w-full p-2 mb-4 border rounded"
        />
        {notFound && (
          <p className="text-red-500 animate-fade-in">
            Geen toestel gevonden met deze naam.
          </p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-4xl mb-10">
        {/* Device Image Display */}
        <div className="flex justify-center items-center w-full lg:w-1/2">
          <img
            src={getImageSrc()}
            alt={
              selectedDevice
                ? selectedDevice.model
                : selectedBrand?.brandName || images
            }
            className="w-60 h-60 sm:w-72 sm:h-72 object-contain"
          />
        </div>

        {/* Step Content */}
        <div className="w-full lg:w-1/2 space-y-6">
          {step === 1 && (
            <div className="bg-primary p-4 rounded-md">
              <h2 className="text-xl font-bold">Selecteer een type van toestel</h2>
              {deviceTypes.map((type) => (
                <button
                  key={type}
                  className="block p-2 my-2 border rounded w-full text-left bg-primaryHelper hover:bg-accent"
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
                  className="mt-4 p-2 w-full border rounded-lg bg-accent text-white"
                  onClick={() => {
                    setStep(2);
                    setConfirmSelection(false);
                  }}
                >
                  Bevestig
                </button>
              )}
            </div>
          )}

          {step === 2 && selectedType && (
            <div className="bg-primary p-4 rounded-md">
              <h2 className="text-xl font-bold">Selecteer een merk</h2>
              {brands.map((brand) => (
                <button
                  key={brand.documentId}
                  className="block p-2 my-2 border rounded w-full text-left bg-primaryHelper hover:bg-accent"
                  onClick={() => {
                    setSelectedBrand(brand);
                    setConfirmSelection(true);
                  }}
                >
                  {brand.brandName}
                </button>
              ))}
              <div className="flex justify-between mt-4">
                <button
                  className="p-2 border rounded-lg bg-accentLight"
                  onClick={() => setStep(1)}
                >
                  Terug
                </button>
                {confirmSelection && (
                  <button
                    className="p-2 border rounded-lg bg-accent text-white"
                    onClick={() => {
                      setStep(3);
                      setConfirmSelection(false);
                    }}
                  >
                    Bevestig
                  </button>
                )}
              </div>
            </div>
          )}

          {step === 3 && selectedBrand && (
            <div className="bg-primary p-4 rounded-md">
              <h2 className="text-xl font-bold mb-4">Selecteer een model</h2>
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
              ).map((model) => (
                <details key={model} className="border rounded mb-2">
                  <summary className="p-2 bg-primaryHelper cursor-pointer">
                    {model}
                  </summary>
                  <div className="p-2">
                    {devices
                      .filter(
                        (device) =>
                          device.model === model &&
                          device.brand?.brandName === selectedBrand.brandName &&
                          device.type === selectedType
                      )
                      .map((variant) => (
                        <button
                          key={variant.documentId}
                          className={`block w-full p-2 my-1 border rounded text-left ${
                            selectedDevice?.documentId === variant.documentId
                              ? "bg-accent text-white"
                              : "bg-accentLight hover:bg-accent"
                          }`}
                          onClick={() => setSelectedDevice(variant)}
                        >
                          {variant.model} {variant.modelType}
                        </button>
                      ))}
                  </div>
                </details>
              ))}
              <div className="flex justify-between mt-4">
                <button
                  className="p-2 border rounded-lg bg-accentLight"
                  onClick={() => setStep(2)}
                >
                  Terug
                </button>
                {selectedDevice && (
                  <button
                    className="p-2 border rounded-lg bg-accent text-white"
                    onClick={() => setStep(4)}
                  >
                    Bevestig
                  </button>
                )}
              </div>
            </div>
          )}

          {step === 4 && selectedDevice && (
            <div className="bg-primary p-4 rounded-md">
              <h2 className="text-xl font-bold mb-4">Selecteer een onderdeel</h2>
              {parts.filter(
                (part) =>
                  part.device?.modelNumber === selectedDevice.modelNumber
              ).length > 0 ? (
                parts
                  .filter(
                    (part) =>
                      part.device?.modelNumber === selectedDevice.modelNumber
                  )
                  .map((part) => (
                    <button
                      key={part.documentId}
                      className="block p-2 my-2 border rounded w-full text-left bg-primaryHelper hover:bg-accent"
                    >
                      {part.name} - € {part.sellingPrice}
                    </button>
                  ))
              ) : (
                <p>Geen onderdelen voor dit model</p>
              )}
              <div className="flex justify-between mt-4">
                <button
                  className="p-2 border rounded-lg bg-accentLight"
                  onClick={() => setStep(3)}
                >
                  Terug
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
