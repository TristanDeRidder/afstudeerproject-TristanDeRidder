import { MetaFunction, useLoaderData } from "@remix-run/react";
import { getRepairorderByDocumentId } from "../core/modules/repairorders/api";
import PrimaryTitle from "../components/design/Title/PrimaryTitle";

// Type Definition
type LoaderData = {
  repairorder: any | null;
  error?: string;
};

export const meta: MetaFunction = () => {
  return [
    { title: "Status | Fixit Aalst" },
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

// Loader Function
export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const documentId = url.searchParams.get("documentId");

  if (!documentId) {
    return { repairorder: null, error: "Geen documentId meegegeven" };
  }

  const repairorders = await getRepairorderByDocumentId(documentId);

  console.log(repairorders.data);

  return {
    repairorder: repairorders.data,
  }; 
}

// Component
export default function Repair() {
  const { repairorder, error } = useLoaderData() as LoaderData;

  if (error) return <div>Error: {error}</div>;
  if (!repairorder) return <div>Loading repair order...</div>;

  return (
    <div className="px-5 md:px-10 lg:px-32">
      <PrimaryTitle title="Repair Status" />
      <div className="bg-primary p-6 rounded-lg border border-gray-200 mt-4 w-full max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-secondary mb-4">
          Reparatie Details
        </h2>

        {/* Repair Order Info */}
        <div className="space-y-2 text-gray-700 text-sm sm:text-base">
          <div className="flex flex-wrap items-center gap-2">
            <strong>Status:</strong>
            <span className="px-3 py-1 rounded bg-accentLight text-secondary font-medium">
              {repairorder.statusRepair}
            </span>
          </div>
          <div>
            <strong>Probleem:</strong> {repairorder.issue}
          </div>
        </div>

        {/* Device Information */}
        {repairorder.device ? (
          <div className="mt-6 p-4 bg-primaryHelper rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-secondary mb-3">
              Device Information
            </h3>
            <div className="space-y-2 text-gray-700 text-sm sm:text-base">
              <div>
                <strong>Toestem:</strong> {repairorder.device.model} {repairorder.device.modelType}
              </div>
              <div>
                <strong>Model:</strong> {repairorder.device.modelNumber}
              </div>
              <div>
                <strong>Type:</strong> {repairorder.device.type}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 text-gray-500 text-sm sm:text-base">
            Geen informatie beschikbaar
          </div>
        )}
      </div>
    </div>
  );
}
