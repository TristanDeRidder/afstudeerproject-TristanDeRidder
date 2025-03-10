import { useState, useEffect } from "react";
import { useLoaderData, useFetcher } from "@remix-run/react";

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

    if (!devices?.data || !brands?.data || !suppliers?.data) {
      throw new Error("No data available");
    }

    return { devices: devices.data, brands: brands.data, suppliers: suppliers.data };
  } catch (error) {
    console.error("Error while fetching data:", error);
    return { devices: [] };
  }
}

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
    // Handle Part creation
    const deviceId = formData.get("deviceId");
    const partName = formData.get("partName");
    const sellingPrice = formData.get("sellingPrice");
    const purchasePrice = formData.get("purchasePrice");
    const supplierId = formData.get("supplierId");

    try {
      const partData = {
        device: deviceId,
        partName,
        sellingPrice,
        purchasePrice,
        suppliers: supplierId,
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
              device.modelType.toLowerCase().includes(lowerCaseQuery))
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
          onClick={() => setShowDeviceOverlay(true)}
          className="bg-accentLight px-4 py-2 rounded-md"
        >
          Add Device
        </button>
        <button
          onClick={() => setShowPartOverlay(true)}
          className="bg-accentLight px-4 py-2 rounded-md ml-2"
        >
          Add Part
        </button>
      </div>

      {/* Device Form Overlay */}
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

      {/* Part Form Overlay */}
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
