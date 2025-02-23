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
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [confirmSelection, setConfirmSelection] = useState(false);

  // Function to get the correct image
  const getImageSrc = () => {
    if (selectedDevice) {
      return selectedDevice.imageUrl; // Ensure the API provides `imageUrl` for the device
    }
    return selectedBrand?.Logo?.url; // Fallback if no logo available
  };

  // Get unique device types
  const deviceTypes = Array.from(new Set(devices.map((device) => device.Type)));

  return (
    <div className="p-4 flex flex-col md:flex-row justify-center items-center">
      {/* Display Image (Brand or Device) */}
      <div className="none md:flex justify-center items-center mb-6 w-1/2">
        <img
          src={getImageSrc()}
          alt={
            selectedDevice
              ? selectedDevice.Name
              : selectedBrand?.BrandName || "Brand Logo"
          }
          className="w-48 h-48 object-contain"
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

      {/* Step 3: Select a Device */}
      {step === 3 && selectedBrand && (
        <div className="md:w-1/2 bg-primary p-4">
          <h2 className="text-xl font-bold">Select a Model</h2>
          {devices
            .filter(
              (device) =>
                device.brand?.BrandName === selectedBrand.BrandName &&
                device.Type === selectedType
            )
            .map((device) => (
              <button
                key={device.documentId}
                className="block p-2 my-2 border rounded w-full text-left bg-primaryHelper"
                onClick={() => {
                  setSelectedDevice(device);
                  setConfirmSelection(true);
                }}
              >
                {device.Name} - {device.ModelNumber}
              </button>
            ))}
          <div className="flex flex-row-reverse justify-end gap-2">
            {confirmSelection && (
              <button
                className="mt-4 p-2 border rounded-lg bg-accent text-text"
                onClick={() => {
                  setStep(4);
                  setConfirmSelection(false);
                }}
              >
                Confirm Selection
              </button>
            )}
            <button
              className="mt-4 py-2 px-4 rounded bg-accentLight"
              onClick={() => setStep(2)}
            >
              Back
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Select Parts */}
      {step === 4 && selectedDevice && (
        <div className="md:w-1/2 bg-primary p-4">
          <h2 className="text-xl font-bold">Available Parts</h2>
          {parts
            .filter(
              (part) => part.device?.documentId === selectedDevice.documentId
            )
            .map((part) => (
              <div
                key={part.documentId}
                className="p-2 border rounded my-2 border rounded w-full text-left bg-primaryHelper"
              >
                {part.Name} - ${part.SellingPrice}
              </div>
            ))}
          {parts.filter(
            (part) => part.device?.documentId === selectedDevice.documentId
          ).length === 0 && <p>No parts found for this device.</p>}
          <button
            className="mt-4 p-2 border rounded"
            onClick={() => setStep(3)}
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}
