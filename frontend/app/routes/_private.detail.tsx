import { useFetcher, useLoaderData } from "@remix-run/react";
import { useState } from "react";

// API
import {
  getRepairorderByDocumentId,
  updateRepairorder,
} from "../core/modules/repairorders/api";
import { getBrands } from "../core/modules/brands/api";
import { getDevices } from "../core/modules/devices/api";
import { getParts } from "../core/modules/parts/api";
import { updateCustomer } from "../core/modules/customers/api";

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

  const repairorder = await getRepairorderByDocumentId(formData.get("documentId"));
  const RepairDocumentId = repairorder.data.documentId;
  const statusRepair = formData.get("statusRepair");
  const issue = formData.get("issue");
  const noFix = formData.get("noFix") === "on" ? true : false;

  const firstname = formData.get("firstname");
  const lastname = formData.get("lastname");
  const phonenumber = formData.get("phonenumber");
  const mailadress = formData.get("mailadress");
  const customerDocumentId = repairorder.data.customer.documentId;

  const partId = formData.get("partId");

  if (!RepairDocumentId || !customerDocumentId) {
    return { success: false, error: "No documentId provided in the form" };
  }

  try {
    const customerData = {
      documentId: customerDocumentId,
      Firstname: firstname,
      Lastname: lastname,
      Phonenumber: phonenumber,
      Mailaddress: mailadress,
    };

    const customer = await updateCustomer(customerData, jwt);

    const customerId = customer?.data?.id;


    const repairData = {
      documentId: RepairDocumentId,
      statusRepair: statusRepair,
      issue: issue,
      repairable: noFix,
      parts: [{ id: partId }],
      customer:  customerId,
      invoice: { totalAmount: 0 },
    };


    await updateRepairorder(repairData, jwt);

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}

export default function Repair() {
  const fetcher = useFetcher();
  const { repairorder, error, parts } = useLoaderData() as LoaderData;
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(repairorder);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    fetcher.submit(formData, { method: "put" });
    setIsEditing(false);
  }

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
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="hidden"
            name="documentId"
            value={repairorder.documentId}
          />
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
                    name="issue"
                    value={formData.issue}
                    onChange={(e) => handleChange(e, "issue")}
                    className="ml-2 border rounded p-2"
                  />
                </label>
                <div>
                  <strong>Modelnummer: </strong>
                  {repairorder.device.modelNumber}
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
                    name="firstname"
                    value={formData.customer.firstname}
                    onChange={(e) => handleChange(e, "customer.firstname")}
                    className="ml-2 border rounded p-2"
                  />
                </label>
                <label>
                  Achternaam klant:
                  <input
                    type="text"
                    name="lastname"
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
              <div key={index} className="flex items-center justify-between">
                <label>
                  Onderdeel:
                  <select
                    name="partId"
                    required
                    className="border rounded-md p-2"
                    value={part?.id || ""}
                    onChange={(e) => {
                      const selectedPartId = e.target.value;
                      handleChange(
                        {
                          target: {
                            name: `parts.${index}.id`,
                            value: selectedPartId,
                          },
                        } as React.ChangeEvent<HTMLInputElement>,
                        `parts.${index}.id`
                      );
                    }}
                  >
                    <option value="" disabled>
                      Selecteer een onderdeel
                    </option>
                    {parts
                      .filter(
                        (part: any) =>
                          part.device.modelNumber ===
                          formData.device.modelNumber
                      )
                      .map((part: any) => (
                        <option key={part.id} value={part.id}>
                          {part.name}
                        </option>
                      ))}
                  </select>
                </label>
                <div>
                  <strong>Aankoopprijs:</strong> € {part.purchasePrice || 0}
                </div>
                <div>
                  <strong>Prijs:</strong> € {part.sellingPrice || 0}
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
