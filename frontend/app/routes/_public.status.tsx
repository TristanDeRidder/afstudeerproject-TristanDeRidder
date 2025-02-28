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
    <>
      <PrimaryTitle title="Repair Status" />
      <div className="bg-primary p-6 rounded-lg  border border-gray-200 mt-4">
        <h2 className="text-2xl font-semibold text-secondary mb-4">
          Repair Order Details
        </h2>

        {/* Repair Order Info */}
        <div className="space-y-2 text-gray-700">
          <div>
            <strong>Status:</strong>{" "}
            <span className="px-2 py-1 rounded bg-accentLight text-secondary font-medium">
              {repairorder.StatusRepair}
            </span>
          </div>
          <div>
            <strong>Probleem:</strong> {repairorder.Issue}
          </div>
        </div>

        {/* Device Information */}
        {repairorder.device ? (
          <div className="mt-6 p-4 bg-primaryHelper rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-secondary mb-3">
              Device Information
            </h3>
            <div className="space-y-1 text-gray-700">
              <div>
                <strong>Name:</strong> {repairorder.device.Name}
              </div>
              <div>
                <strong>Model:</strong> {repairorder.device.ModelNumber}
              </div>
              <div>
                <strong>Type:</strong> {repairorder.device.Type}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 text-gray-500">
            No device information available.
          </div>
        )}

        {/* Invoice Information */}
        {/* {repairorder.invoice ? (
    <div className="mt-6 p-4 bg-primaryHelper rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold text-secondary mb-3">Invoice Information</h3>
      <div className="space-y-1 text-gray-700">
        <div>
          <strong>Total Amount:</strong> €{repairorder.invoice.TotalAmount}
        </div>
        <div>
          <strong>Paid:</strong>{" "}
          <span className={`px-2 py-1 rounded ${repairorder.invoice.Paid ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
            {repairorder.invoice.Paid ? "Yes" : "No"}
          </span>
        </div>
        <div>
          <strong>Payment Method:</strong> {repairorder.invoice.Paymentmethod}
        </div>
      </div>
    </div>
  ) : (
    <div className="mt-6 text-gray-500">No invoice available.</div>
  )} */}
      </div>
    </>
  );
}
