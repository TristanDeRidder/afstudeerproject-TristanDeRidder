import { useLoaderData } from "@remix-run/react";
import { getRepairorderByDocumentId } from "../core/modules/repairorders/api";
import PrimaryTitle from "../components/design/Title/PrimaryTitle";

// Type Definition
type LoaderData = {
  repairorder: any | null;
  error?: string;
};

// Loader Function
export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const documentId = url.searchParams.get("documentId");

  if (!documentId) {
    return { repairorder: null, error: "No documentId provided" };
  }

  const repairorders = await getRepairorderByDocumentId(documentId);

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
    <div className="">
      <h2 className="text-2xl font-semibold text-secondary mb-4">
        Repair Order Details
      </h2>

      <div className="flex justify-between">
        <div className="flex items-center">
          <div className="bg-primary py-8 px-4 rounded-md border">
            {repairorder.documentId}
          </div>
          <div className="flex flex-col space-y-2 ml-4">
            <div>
              {/* TODO: fix brand */}
              <strong>Merk:</strong>
              {repairorder.device.brand?.BrandName}
            </div>
            <div>
              <strong>Model:</strong>
              {repairorder.device.Model} {repairorder.device.ModelType}
            </div>
          </div>
        </div>
        <div className="space-y-2 text-gray-700">
          <div>
            <strong>Status:</strong>{" "}
            <span className="px-2 py-1 rounded bg-accentLight text-secondary font-medium">
              {repairorder.StatusRepair}
            </span>
          </div>
          <div>
            <strong>Dag van bestelling:</strong>{" "}
            {new Date(repairorder.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Device Information */}
      <div className="mt-6 p-4 bg-primaryHelper rounded-lg shadow-sm flex justify-between">
        <div className="space-y-1 text-gray-700">
          <div>
            <strong>Reparatie:</strong> {repairorder.Issue}
          </div>
          <div>
            <strong>Model:</strong> {repairorder.device.ModelNumber}
          </div>
        </div>
        <div>
          <div>
            <strong>Klant:</strong> {repairorder.customer.Firstname}{" "}
            {repairorder.customer.Lastname}
          </div>
          <div>
            <strong>Telefoonnummer:</strong> {repairorder.customer.Phonenumber}
          </div>
          <div>
            <strong>Mail:</strong> {repairorder.customer.Mailaddress}
          </div>
        </div>
        <div>
          <strong>bedrag:</strong> € {repairorder.invoice.TotalAmount}
        </div>
      </div>

      {/* Part information */}
      <div className="mt-6 p-4 bg-primaryHelper rounded-lg shadow-sm flex justify-between">
        {repairorder.parts.map((part: any) => (
          <div key={part.id} className="space-y-2">
            <div>
              <strong>Onderdeel:</strong> {part.Name}
            </div>
            <div>
              <strong>Aankoopprijs:</strong> € {part.PurchasePrice}
            </div>
            <div>
              <strong>Prijs:</strong> € {part.SellingPrice}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
