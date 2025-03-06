import { useLoaderData } from "@remix-run/react";
import { useState } from "react";

// API
import {
  createRepairorder,
  getRepairorderByDocumentId,
} from "../core/modules/repairorders/api";
import { getBrands } from "../core/modules/brands/api";
import { getDevices } from "../core/modules/devices/api";
import { getParts } from "../core/modules/parts/api";
import { createCustomer } from "../core/modules/customers/api";

// Types
import { Brand } from "../core/modules/brands/type";
import { Devices } from "../core/modules/devices/type";
import { Parts } from "../core/modules/parts/type";

// Cookies
import { jwtCookie } from "../core/cookies/cookies.server";

type LoaderData = {
  repairorder: any | null;
  error?: string;
  brand: Brand[];
  device: Devices[];
  parts: Parts[];
};

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const documentId = url.searchParams.get("documentId");

  if (!documentId) {
    return { repairorder: null, error: "No documentId provided" };
  }

  const repairorders = await getRepairorderByDocumentId(documentId);
  const brand = await getBrands();
  const device = await getDevices();
  const parts = await getParts();

  return {
    repairorder: repairorders.data,
    brand: brand.data,
    device: device.data,
    parts: parts.data,
  };
}

export async function action({ request }: any) {
  const jwt = await jwtCookie.parse(request.headers.get("Cookie"));
  const formData = await request.formData();

  const statusRepair = formData.get("statusRepair");
  const issue = formData.get("issue");
  const noFix = formData.get("noFix") === "on" ? true : false;

  const firstname = formData.get("firstname");
  const lastname = formData.get("lastname");
  const phonenumber = formData.get("phonenumber");
  const mailadress = formData.get("mailadress");

  const part = formData.get("part");

  try {
    const customerData = {
      Firstname: firstname,
      Lastname: lastname,
      Phonenumber: phonenumber,
      Mailaddress: mailadress,
    };

    const customer = await createCustomer(customerData, jwt);

    const repairData = {
      statusRepair: statusRepair,
      issue: issue,
      repairable: noFix,
      parts: [{ name: part }],
      customer: customer.data,
      invoice: { totalAmount: 0 },
    };

    const repairorder = await createRepairorder(repairData, jwt);
    console.log(repairorder);

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}

export default function Repair() {
  const { repairorder, error, brand, device, parts } =
    useLoaderData() as LoaderData;
  const [isEditing, setIsEditing] = useState(true);
  const [formData, setFormData] = useState(repairorder);
  const [selectedBrand, setSelectedBrand] = useState(
    formData.device.brand?.brandName || ""
  );

  console.log("Repair Order:", repairorder);
  console.log("Form Data Device:", formData.device);

  if (error) return <div>Error: {error}</div>;
  if (!repairorder) return <div>Loading repair order...</div>;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    path: string
  ) => {
    const keys = path.split(".");
    setFormData((prev: any) => {
      let updated = { ...prev };
      let current = updated;

      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          current[key] = e.target.value;
        } else {
          current = current[key];
        }
      });

      return updated;
    });
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const brandName = e.target.value;
    setSelectedBrand(brandName);
    setFormData((prev: any) => ({
      ...prev,
      device: {
        ...prev.device,
        brand: { brandName: brandName },
        modelType: "",
        modelNumber: "",
      },
    }));
  };

  const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("Device change triggered");
    const selectedDevice = device.find(
      (d) =>
        d.modelType === e.target.value && d.brand?.brandName === selectedBrand
    );

    console.log("Selected Device:", selectedDevice);

    if (selectedDevice) {
      // Update the form with the correct model number
      setFormData((prev: any) => ({
        ...prev,
        device: {
          ...prev.device,
          modelType: e.target.value,
          modelNumber: selectedDevice.modelNumber || "", // Safely access modelNumber
        },
      }));
    } else {
      // Handle case when no matching device is found
      console.error("Device not found for the selected model type.");
      setFormData((prev: any) => ({
        ...prev,
        device: {
          ...prev.device,
          modelType: e.target.value,
          modelNumber: "", // Reset modelNumber if no device is found
        },
      }));
    }
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-secondary">
          Repair Order Details
        </h2>
        <button
          className="bg-accentLight text-secondary px-4 py-2 rounded-md"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      {isEditing ? (
        <form className="space-y-6">
          <div className="flex justify-between">
            <div className="flex items-center">
              <div className="bg-primary py-8 px-4 rounded-md border">
                {repairorder.documentId}
              </div>
              <div className="flex flex-col space-y-2 ml-4">
                {/* Brand selection */}
                <label className="flex items-center gap-2">
                  Merk:
                  <select
                    name="brand"
                    required
                    className="border rounded-md p-2 w-full"
                    value={selectedBrand}
                    onChange={handleBrandChange}
                  >
                    {brand.map((brand: any) => (
                      <option key={brand.id} value={brand.brandName}>
                        {brand.brandName}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Model selection, filtered by brand */}
                <label>
                  Model:
                  <select
                    name="deviceId"
                    required
                    className="border rounded-md p-2"
                    value={formData.device.modelType || ""}
                    onChange={handleDeviceChange} // Ensure this is properly connected
                  >
                    {device
                      .filter((d: any) => d.brand?.brandName === selectedBrand)
                      .map((d: any) => (
                        <option key={d.id} value={d.modelType}>
                          {d.model} {d.modelType}
                        </option>
                      ))}
                  </select>
                </label>

                {/* Model number display */}
                <div>
                  <strong>Modelnummer: </strong>
                  {formData.device.modelNumber || "Selecteer een model"}
                </div>
              </div>
            </div>

            <div className="space-y-2 text-gray-700">
              <label className="flex items-center gap-2">
                Status:
                <select
                  name="statusRepair"
                  required
                  className="border rounded-md p-2 w-full"
                  value={formData.statusRepair}
                  onChange={(e) => handleChange(e, "statusRepair")}
                >
                  <option value="Bestellen">Bestellen</option>
                  <option value="Besteld">Besteld</option>
                  <option value="Geleverd">Geleverd</option>
                  <option value="Op de hoogte">Op de hoogte</option>
                  <option value="Binnen">Binnen</option>
                  <option value="Reparatie">Reparatie</option>
                  <option value="Klaar">Klaar</option>
                  <option value="Opgehaald">Opgehaald</option>
                </select>
              </label>
              <div>
                <strong>Dag van bestelling: </strong>
                {new Date(repairorder.createdAt).toLocaleDateString()}
              </div>
              <div>
                <strong>Laatste update: </strong>
                {new Date(repairorder.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Device data */}
          <div className="mt-6 p-4 bg-primaryHelper text-lg rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mt-6">Device Information</h3>
            <div className="flex justify-between">
              <div className="flex flex-col">
                <label>
                  Reparatie:
                  <input
                    type="text"
                    value={formData.issue}
                    onChange={(e) => handleChange(e, "issue")}
                    className="ml-2 border rounded p-2"
                  />
                </label>
                <div>
                  <strong>Modelnummer: </strong>
                  {formData.device.modelNumber || "Selecteer een model"}
                </div>
                <label className="flex items-center gap-2">
                  No fix
                  <input
                    type="checkbox"
                    name="noFix"
                    checked={formData.noFix}
                    onChange={(e) => handleChange(e, "noFix")}
                  />
                </label>
              </div>
              <div className="flex flex-col">
                <label>
                  Voornaam klant:
                  <input
                    type="text"
                    value={formData.customer.firstname}
                    onChange={(e) => handleChange(e, "customer.firstname")}
                    className="ml-2 border rounded p-2"
                  />
                </label>
                <label>
                  Achternaam klant:
                  <input
                    type="text"
                    value={formData.customer.lastname}
                    onChange={(e) => handleChange(e, "customer.firstname")}
                    className="ml-2 border rounded p-2"
                  />
                </label>
                <label>
                  Telefoonnummer:
                  <input
                    type="text"
                    name="phonenumber"
                    value={formData.customer.phonenumber}
                    onChange={(e) => handleChange(e, "customer.phonenumber")}
                    className="ml-2 border rounded p-2"
                  />
                </label>
                <label>
                  Mail:
                  <input
                    type="text"
                    name="mailadress"
                    value={formData.customer.mailadress}
                    onChange={(e) => handleChange(e, "customer.mailadress")}
                    className="ml-2 border rounded p-2"
                  />
                </label>
              </div>
              <div className="flex flex-col">
                <div>
                  <strong>Bedrag: </strong>€ {repairorder.invoice.totalAmount}
                  <input
                    type="hidden"
                    name="totalAmount"
                    value={formData.invoice.totalAmount}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Part data */}
          <div className="mt-6 p-4 bg-primaryHelper text-lg rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mt-6">Part Information</h3>
            {formData.parts.map((part: any, index: number) => (
              <div key={part.id} className="flex  items-center justify-between">
                <label>
                  Onderdeel:
                  <select
                    name="part"
                    required
                    className="border rounded-md p-2"
                    value={part.name}
                    onChange={(e) => handleChange(e, `parts.${index}.name`)}
                  >
                    {parts
                      .filter(
                        (part: any) =>
                          part.device.modelNumber ===
                          formData.device.modelNumber
                      )
                      .map((part: any) => (
                        <option key={part.id} value={part.name}>
                          {part.name}
                        </option>
                      ))}
                  </select>
                </label>
                <div>
                  <strong>Aankoopprijs:</strong> € {part.purchasePrice}
                </div>
                <div>
                  <strong>Prijs:</strong> € {part.sellingPrice}
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="bg-secondary text-white px-4 py-2 rounded-md"
          >
            Save Changes
          </button>
        </form>
      ) : (
        <>
          <div className="flex justify-between">
            <div className="flex items-center">
              <div className="bg-primary py-8 px-4 rounded-md border">
                {repairorder.documentId}
              </div>
              <div className="flex flex-col space-y-2 ml-4">
                <div>
                  <strong>Merk: </strong>
                  {repairorder.device.brand?.brandName}
                </div>
                <div>
                  <strong>Model: </strong>
                  {repairorder.device.model} {repairorder.device.modelType}
                </div>
                <div>
                  <strong>Modelnummer: </strong>
                  {repairorder.device.modelNumber}
                </div>
              </div>
            </div>

            <div className="space-y-2 text-gray-700 mt-6">
              <div>
                <strong>Status: </strong>
                {repairorder.statusRepair}
              </div>
              <div>
                <strong>Dag van bestelling: </strong>
                {new Date(repairorder.createdAt).toLocaleDateString()}
              </div>
              <div>
                <strong>Laatste update: </strong>
                {new Date(repairorder.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Device data */}
          <div className="mt-6 p-4 bg-primaryHelper text-lg rounded-lg shadow-sm">
            <h3 className="font-semibold mb-3">Device Information</h3>
            <div className="flex justify-between">
              <div className="space-y-1 text-gray-700">
                <div>
                  <strong>Reparatie:</strong> {repairorder.issue}
                </div>
                <div>
                  <strong>Model:</strong> {repairorder.device.modelNumber}
                </div>
                <div>
                  <strong>No fix:</strong> {repairorder.noFix ? "Ja" : "Nee"}
                </div>
              </div>
              <div>
                <div>
                  <strong>Klant:</strong> {repairorder.customer.firstname}{" "}
                  {repairorder.customer.lastname}
                </div>
                <div>
                  <strong>Telefoonnummer:</strong>{" "}
                  {repairorder.customer.phonenumber}
                </div>
                <div>
                  <strong>Mail:</strong> {repairorder.customer.mailadress}
                </div>
              </div>
              <div>
                <strong>bedrag:</strong> € {repairorder.invoice.totalAmount}
              </div>
            </div>
          </div>

          {/* Part data */}
          <div className="mt-6 p-4 bg-primaryHelper text-lg rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-3">Part Information</h3>
            {repairorder.parts.map((part: any) => (
              <div key={part.id} className="flex items-center justify-between">
                <div>
                  <strong>Onderdeel:</strong> {part.name}
                </div>
                <div>
                  <strong>Aankoopprijs:</strong> € {part.purchasePrice}
                </div>
                <div>
                  <strong>Prijs:</strong> € {part.sellingPrice}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
