import { useState, useEffect } from "react";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { getDevices, createDevice } from "../core/modules/devices/api";
import type { Devices } from "../core/modules/devices/type";

import { X } from "lucide-react";
import { getBrands } from "../core/modules/brands/api";
import { Brand } from "../core/modules/brands/type";
import { jwtCookie } from "../core/cookies/cookies.server";

type LoaderData = {
  devices: Devices[];
  brands: Brand[];
};

export async function loader() {
  try {
    const devices = await getDevices();
    const brands = await getBrands();

    if (!devices?.data || !brands?.data) {
      throw new Error("No data available");
    }

    return { devices: devices.data, brands: brands.data };
  } catch (error) {
    console.error("Error while fetching data:", error);
    return { devices: [] };
  }
}

export async function action({ request }: any) {
  const jwt = await jwtCookie.parse(request.headers.get("Cookie"));
  const strapiUrl = process.env.STRAPI_API_URL;

  if (!strapiUrl) {
    console.error("STRAPI_URL is not defined");
  }

  const formData = await request.formData();

  const type = formData.get("type");
  const brand = formData.get("brandId");
  const model = formData.get("model");
  const modelType = formData.get("modelType")?.trim() || null;
  const modelNumber = formData.get("modelNumber");
  const image = formData.get("image");

  console.log("Image received:", image);
  console.log("Image type:", image?.constructor?.name);

  try {
    let imageId = null;

    if (image && image instanceof File && image.size > 0) {
      const imageFormData = new FormData();
      imageFormData.append("files", image);

      console.log("FormData content:");
      for (const pair of imageFormData.entries()) {
        console.log(pair[0], pair[1]);
      }


      const uploadResponse = await fetch(
        `${process.env.STRAPI_API_URL}/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          body: imageFormData,
        }
      );

      const uploadData = await uploadResponse.json();

      if (uploadResponse.ok && Array.isArray(uploadData)) {
        imageId = uploadData[0]?.id || null;
      }
    }

    const deviceData = {
      type,
      brand,
      model,
      modelType,
      modelNumber,
      image: imageId ? { id: imageId } : null,
    };

    await createDevice(deviceData, jwt);
    return { success: true };
  } catch (error) {
    console.error("Failed to create device:", error);
    return { success: false };
  }
}

export default function Devices() {
  const { devices, brands } = useLoaderData<LoaderData>();
  const fetcher = useFetcher();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDevices, setFilteredDevices] = useState(devices);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);

  useEffect(() => {
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      setFilteredDevices(
        devices.filter(
          (device) =>
            device.type.toLowerCase().includes(lowerCaseQuery) ||
            device.brand?.brandName.toLowerCase().includes(lowerCaseQuery) ||
            device.model.toLowerCase().includes(lowerCaseQuery) ||
            (device.modelType &&
              device.modelType.toLowerCase().includes(lowerCaseQuery))
        )
      );
    } else {
      setFilteredDevices(devices);
    }
  }, [searchQuery, devices]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formElement = e.target as HTMLFormElement;
    const formData = new FormData(formElement);

    // Log to verify file is attached
    for (const [key, value] of formData.entries()) {
      console.log(
        `${key}:`,
        value,
        `(Type: ${value instanceof File ? "File" : typeof value})`
      );
    }

    fetcher.submit(formData, {
      method: "post",
      encType: "multipart/form-data",
    });
  };

  return (
    <div className="bg-primary p-4">
      {/* Search Bar */}
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search for devices..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-3 rounded-lg border border-gray-300 w-80"
        />
        <button
          onClick={() => setShowOverlay(true)}
          className="bg-accentLight px-4 py-2 rounded-md"
        >
          +
        </button>
      </div>

      {showOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-primaryHelper p-4 rounded-md w-1/2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Nieuwe toestel toevoegen</h2>
              <button onClick={() => setShowOverlay(false)}>
                <X size={24} />
              </button>
            </div>

            {/* Add Device Form */}
            <form
              onSubmit={handleSubmit}
              encType="multipart/form-data"
              className="mb-4 space-y-4"
            >
              <select
                name="type"
                className="p-2 rounded-md border w-full"
                required
              >
                <option value="">Selecteer een type</option>
                <option value="Smartphone">Smartphone</option>
                <option value="Tablet">Tablet</option>
                <option value="Laptop">Laptop</option>
                <option value="Desktop">Desktop</option>
                <option value="Smartwatch">Smartwatch</option>
              </select>

              <select
                name="brandId"
                className="p-2 rounded-md border w-full"
                required
              >
                <option value="">Selecteer een merk</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.brandName}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="model"
                placeholder="Model"
                className="p-2 rounded-md border w-full"
                required
              />
              <input
                type="text"
                name="modelType"
                placeholder="Model Type"
                className="p-2 rounded-md border w-full"
              />
              <input
                type="text"
                name="modelNumber"
                placeholder="Model Number"
                className="p-2 rounded-md border w-full"
              />
              <input
                type="file"
                name="image"
                className="p-2 rounded-md border w-full"
              />
              <button
                type="submit"
                className="bg-accentLight p-2 rounded-md text-white w-full"
              >
                Add Device
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Device List */}
      <div className="flex justify-between">
        <div className="font-bold px-4 py-2 w-1/3">Type</div>
        <div className="font-bold px-4 py-2 w-1/3">Brand</div>
        <div className="font-bold px-4 py-2 w-1/3">Model</div>
      </div>
      <div>
        {filteredDevices.map((device) => (
          <div
            key={device.id}
            className="flex justify-between bg-primaryHelper mt-2"
          >
            <div className="px-4 py-2 w-1/3">{device.type}</div>
            <div className="px-4 py-2 w-1/3">{device.brand?.brandName}</div>
            <div className="px-4 py-2 w-1/3">
              {device.model} {device.modelType}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
