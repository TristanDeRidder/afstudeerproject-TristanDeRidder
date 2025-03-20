import { useState } from "react";
import { useFetcher, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { LoaderFunctionArgs } from "@remix-run/node";
import { jwtCookie } from "../core/cookies/cookies.server";
import Edit from "../components/design/Icons/Edit";
import Check from "../components/design/Icons/Check";
import Cancel from "../components/design/Icons/Cancel";

// API
import { getDeviceById } from "../core/modules/devices/api";
import { getParts, updatePart } from "../core/modules/parts/api";

// Types
import type { Devices } from "../core/modules/devices/type";
import type { Parts } from "../core/modules/parts/type";

type LoaderData = {
  device: Devices;
  parts: Parts[];
  error?: string;
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.documentId, "Missing documentId param");

  const device = await getDeviceById(params.documentId);
  const parts = await getParts();

  if (!device) {
    throw new Response("Device not found", { status: 404 });
  }
  if (!parts.length) {
    throw new Response("Parts not found", { status: 404 });
  }

  return { device: device.data, parts };
};

export async function action({ request }: any) {
  const jwt = await jwtCookie.parse(request.headers.get("Cookie"));
  const formData = new URLSearchParams(await request.text());

  const deviceId = formData.get("deviceId");

  if (!deviceId) {
    return { success: false };
  }
  const partId = formData.get("id");
  const partName = formData.get("partName");
  const purchasePrice = formData.get("purchasePrice");
  const sellingPrice = formData.get("sellingPrice");
  const quality = formData.get("quality");

  try {
    const partData = {
      documentId: partId,
      partName: partName,
      purchasePrice: purchasePrice,
      sellingPrice: sellingPrice,
      quality: quality,
    };

    // Update part
    await updatePart(partData, jwt);

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}

export default function DeviceDetail() {
  const fetcher = useFetcher();
  const { device, parts, error } = useLoaderData() as LoaderData;
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [formData, setFormData] = useState(parts);

  if (error) return <div>Error: {error}</div>;
  if (!parts || !device) return <div>Loading...</div>;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    partId: number,
    field: string
  ) => {
    const updatedParts = formData.map((part) => {
      if (part.id === partId) {
        return { ...part, [field]: e.target.value };
      }
      return part;
    });
    setFormData(updatedParts);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit form");
    const formData = new FormData(e.target as HTMLFormElement);
    fetcher.submit(formData, { method: "put" });
    setIsEditing(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4 mt-9">
        <h1 className="text-2xl font-semibold text-dashboardText">
          Device Details
        </h1>
      </div>
      <>
        <div className="flex items-center">
          <div className="bg-dashboardSidebar py-8 px-4 rounded-md border">
            {device.documentId}
          </div>
          <div className="flex flex-col space-y-2 ml-4">
            <div>
              <strong>Merk: </strong>
              {device.brand.brandName}
            </div>
            <div>
              <strong>Model: </strong>
              {device.model} {device.modelType}
            </div>
            <div>
              <strong>Modelnummer: </strong>
              {device.modelNumber}
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-dashboardSidebar text-lg rounded-lg shadow-sm h-[35rem] overflow-y-scroll">
          {parts
            .filter((part) => part.device && part.device.id === device.id)
            .map((part) => {
              const currentPart = formData.find((p) => p.id === part.id);

              return (
                <div key={part.id} className="grid grid-cols-5 gap-4">
                  {isEditing === part.id ? (
                    <form
                      onSubmit={handleSubmit}
                      className="col-span-4 flex items-center"
                      method="put"
                    >
                      <input type="hidden" name="deviceId" value={device.id} />
                      <input type="hidden" name="id" value={part.documentId} />

                      <input
                        type="text"
                        name="partName"
                        value={currentPart?.name || ""}
                        onChange={
                            (e) => handleChange(e, part.id, "name")
                        }
                        className="w-full"
                      />

                      <input
                        type="text"
                        name="purchasePrice"
                        value={currentPart?.purchasePrice || ""}
                        onChange={(e) =>
                          handleChange(e, part.id, "purchasePrice")
                        }
                        className="w-full"
                      />

                      <input
                        type="text"
                        name="sellingPrice"
                        value={currentPart?.sellingPrice || ""}
                        onChange={(e) =>
                          handleChange(e, part.id, "sellingPrice")
                        }
                        className="w-full"
                      />

                      <select
                        name="quality"
                        value={currentPart?.quality || ""}
                        onChange={
                            (e) => handleChange(e, part.id, "quality")
                        }
                        className="w-full"
                      >
                        <option value="Origineel">Origineel</option>
                        <option value="Refurbished">Refurbished</option>
                        <option value="Pulled">Pulled</option>
                      </select>

                      <button
                        type="submit"
                        className="ml-2 px-2 py-1 rounded bg-green-500 text-white"
                      >
                        <Check />
                      </button>

                      <button
                        type="button"
                        className="ml-2 px-2 py-1 rounded bg-gray-500 text-white"
                        onClick={() => setIsEditing(null)}
                      >
                        <Cancel />
                      </button>
                    </form>
                  ) : (
                    <>
                      <strong>{part.name}</strong>
                      <p>{part.purchasePrice}</p>
                      <p>{part.sellingPrice}</p>
                      <p>{part.quality}</p>
                      <button onClick={() => setIsEditing(part.id)}>
                        <Edit />
                      </button>
                    </>
                  )}
                </div>
              );
            })}
        </div>
      </>
    </div>
  );
}
