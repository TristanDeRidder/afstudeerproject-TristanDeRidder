import { useState, useEffect } from "react";
import { useLoaderData, useFetcher, Link, Outlet } from "@remix-run/react";
import DashboardTitle from "../components/design/Title/DashboardTitle";

import { getDevices, createDevice } from "../core/modules/devices/api";
import { createPart } from "../core/modules/parts/api";
import { getBrands } from "../core/modules/brands/api";
import { getSuppliers } from "../core/modules/suppliers/api";

import type { Devices } from "../core/modules/devices/type";
import { Brand } from "../core/modules/brands/type";
import { Suppliers } from "../core/modules/suppliers/type";

import { jwtCookie } from "../core/cookies/cookies.server";

import CloseIcon from "../assets/svg/X_Icon.svg";


type LoaderData = {
  devices: Devices[];
  brands: Brand[];
  suppliers: Suppliers[];
};
 
export async function loader() {
  try {
    const devices = await getDevices();
    const brands = await getBrands();
    const suppliers = await getSuppliers();

    if (!devices.length || !brands?.data || !suppliers?.data) {
      throw new Error("No data available");
    }

    return { devices, brands: brands.data, suppliers: suppliers.data };
  } catch (error) {
    console.error("Error while fetching data:", error);
    return { devices: [] };
  }
}

/**
 * Handles the action for adding a device or a part based on the actionType from the form data.
 *
 * @param {Object} params - The parameters object.
 * @param {Request} params.request - The request object containing headers and form data.
 * @returns {Promise<Object>} - A promise that resolves to an object indicating the success status of the action.
 *
 * The function performs the following actions based on the actionType:
 * - "addDevice": Handles the creation of a device.
 *   - Extracts device details from the form data.
 *   - If an image is provided, uploads the image and retrieves its ID.
 *   - Creates a device with the provided details and the uploaded image ID.
 * - "addPart": Handles the creation of a part.
 *   - Extracts part details from the form data.
 *   - Creates a part with the provided details.
 *
 * If the actionType is not recognized, the function returns a success status of false.
 *
 * @throws {Error} - If there is an error during the creation of a device or part, the error is logged and the function returns a success status of false.
 */
export async function action({ request }: any) {
  const jwt = await jwtCookie.parse(request.headers.get("Cookie"));
  const formData = await request.formData();
  const actionType = formData.get("actionType");

  if (actionType === "addDevice") {
    // Handle Device creation
    const type = formData.get("type");
    const brand = formData.get("brandId");
    const model = formData.get("model");
    const modelType = formData.get("modelType")?.trim() || null;
    const modelNumber = formData.get("modelNumber");
    const image = formData.get("image");

    try {
      let imageId = null;

      if (image && image instanceof File && image.size > 0) {
        const imageFormData = new FormData();
        imageFormData.append("files", image);
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
      console.error("Error creating device:", error);
      return { success: false };
    }
  } else if (actionType === "addPart") {
    const deviceId = formData.get("deviceId");
    const partName = formData.get("partName");
    const sellingPrice = formData.get("sellingPrice");
    const purchasePrice = formData.get("purchasePrice");
    const supplierId = formData.get("supplierId");
    const quality = formData.get("quality");

    try {
      const partData = {
        device: deviceId,
        partName,
        sellingPrice,
        purchasePrice,
        suppliers: supplierId,
        quality,
      };

      await createPart(partData, jwt);
      return { success: true };
    } catch (error) {
      console.error("Error creating part:", error);
      return { success: false };
    }
  } else {
    return { success: false };
  }
}

export default function Devices() {
  const { devices, brands, suppliers } = useLoaderData<LoaderData>();
  const fetcher = useFetcher();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDevices, setFilteredDevices] = useState(devices);
  const [showDeviceOverlay, setShowDeviceOverlay] = useState<boolean>(false);
  const [showPartOverlay, setShowPartOverlay] = useState<boolean>(false);
  const [selectedBrand, setSelectedBrand] = useState<string>("");

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
              device.modelType.toLowerCase().includes(lowerCaseQuery)) ||
            (device.modelNumber &&
              device.modelNumber.toLowerCase().includes(lowerCaseQuery))
        )
      );
    } else {
      setFilteredDevices(devices);
    }
  }, [searchQuery, devices]);

  const handleDeviceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formElement = e.target as HTMLFormElement;
    const formData = new FormData(formElement);

    fetcher.submit(formData, {
      method: "post",
      encType: "multipart/form-data",
    });
  };

  const handlePartSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formElement = e.target as HTMLFormElement;
    const formData = new FormData(formElement);

    fetcher.submit(formData, {
      method: "post",
      encType: "multipart/form-data",
    });
  };

  return (
    <div className="bg-dashboardSidebar p-4">
      <DashboardTitle title="Toestellen" />

      {/* Search Bar */}
      <div className="flex mb-4 mt-6">
        <input
          type="text"
          placeholder="Zoek naar een toestel, modelnummer, merk, ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-3 rounded-lg border border-gray-300 w-[30rem]"
        />
      </div>

      <div className="absolute bottom-9 left-1/2 transform -translate-x-1/2">
        <button
          onClick={() => setShowDeviceOverlay(true)}
          className="bg-dashboardPrimary px-4 py-2 rounded-l-full hover:bg-dashboardPrimaryHelper transition-all duration-300"
        >
          Nieuw Toestel
        </button>
        <button
          onClick={() => setShowPartOverlay(true)}
          className="bg-dashboardPrimary px-4 py-2 rounded-r-full hover:bg-dashboardPrimaryHelper transition-all duration-300"
        >
          Nieuw Onderdeel
        </button>
      </div>

      {/* Add Device Form */}
      {showDeviceOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-primaryHelper p-4 rounded-md w-1/2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Nieuwe toestel toevoegen</h2>
              <button onClick={() => setShowDeviceOverlay(false)}>
                <img src={CloseIcon} alt="Close" />
              </button>
            </div>

            {/* Add Device Form */}
            <form
              onSubmit={handleDeviceSubmit}
              encType="multipart/form-data"
              className="mb-4 space-y-4"
            >
              <input type="hidden" name="actionType" value="addDevice" />
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

      {/* Add Part Form */}
      {showPartOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-primaryHelper p-4 rounded-md w-1/2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Nieuwe onderdeel toevoegen</h2>
              <button onClick={() => setShowPartOverlay(false)}>
                <img src={CloseIcon} alt="Close" />
              </button>
            </div>

            {/* Add Part Form */}
            <form onSubmit={handlePartSubmit} className="mb-4 space-y-4">
              <input type="hidden" name="actionType" value="addPart" />
              <select
                name="brand"
                className="p-2 rounded-md border w-full"
                onChange={(e) => setSelectedBrand(e.target.value)}
                required
              >
                <option value="">Selecteer een merk</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.brandName}>
                    {brand.brandName}
                  </option>
                ))}
              </select>

              <select
                name="deviceId"
                className="p-2 rounded-md border w-full"
                required
              >
                <option value="">Selecteer een toestel</option>
                {filteredDevices
                  .filter((device) => device.brand?.brandName === selectedBrand)
                  .map((device) => (
                    <option key={device.id} value={device.id}>
                      {device.model} {device.modelType}
                    </option>
                  ))}
              </select>

              <input
                type="text"
                name="partName"
                placeholder="Part Name"
                className="p-2 rounded-md border w-full"
                required
              />
              <input
                type="number"
                name="sellingPrice"
                placeholder="Verkoop prijs"
                className="p-2 rounded-md border w-full"
              />
              <input
                type="number"
                name="purchasePrice"
                placeholder="Aankoop prijs"
                className="p-2 rounded-md border w-full"
              />
              <select
                name="supplierId"
                className="p-2 rounded-md border w-full"
                required
              >
                <option value="">Selecteer een leverancier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
              <select
                name="quality"
                className="p-2 rounded-md border w-full"
                required
              >
                <option value="">Selecteer een kwaliteit</option>
                <option value="Origineel">Origineel</option>
                <option value="Pulled">Pulled</option>
                <option value="Refurbished">Refurbished</option>
              </select>
              <button
                type="submit"
                className="bg-accentLight p-2 rounded-md text-white w-full"
              >
                Add Part
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Device List */}
      <div className="flex justify-between">
        <div className="font-bold px-4 py-2 w-1/3">Type</div>
        <div className="font-bold px-4 py-2 w-1/3">Merk</div>
        <div className="font-bold px-4 py-2 w-1/3">Model</div>
      </div>
      <div className="overflow-y-auto h-[40rem]">
        {filteredDevices
          .sort((a, b) => {
            if (a.brand?.brandName && b.brand?.brandName) {
              return a.brand.brandName.localeCompare(b.brand.brandName);
            }
            return 0; // In case brandName is undefined, no sorting applied
          })
          .map((device) => (
            <Link
              to={`/devices/${device.documentId}`}
              key={device.documentId}
              className="flex justify-between bg-primaryHelper mt-2"
            >
              <div className="px-4 py-2 w-1/3">{device.type}</div>
              <div className="px-4 py-2 w-1/3">{device.brand?.brandName}</div>
              <div className="px-4 py-2 w-1/3">
                {device.model} {device.modelType}
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}

