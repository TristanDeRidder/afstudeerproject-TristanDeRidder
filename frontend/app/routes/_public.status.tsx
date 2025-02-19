import { useLoaderData } from "@remix-run/react";
import { getRepairorderByDocumentId } from "../core/modules/repairorders/api";

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
  console.log("Repair Order:", repairorder);

  if (error) return <div>Error: {error}</div>;
  if (!repairorder) return <div>Loading repair order...</div>;

  return (
    <div>
      <h2>Repair Order Details</h2>
      <div>
        <strong>Document ID:</strong> {repairorder.documentId}
      </div>
      <div>
        <strong>Status:</strong> {repairorder.StatusRepair}
      </div>
      <div>
        <strong>Issue:</strong> {repairorder.Issue}
      </div>
      {/* <div>
        <strong>Repairable:</strong> {repairorder.Repairable ? "Yes" : "No"}
      </div> */}

      {/* Device Information */}
      {repairorder.device ? (
        <div>
          <h3>Device Information</h3>
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
      ) : (
        <div>No device information available.</div>
      )}

      {/* Invoice Information */}
      {/* {repairorder.invoice ? (
        <div>
          <h3>Invoice Information</h3>
          <div>
            <strong>Total Amount:</strong> €{repairorder.invoice.TotalAmount}
          </div>
          <div>
            <strong>Paid:</strong> {repairorder.invoice.Paid ? "Yes" : "No"}
          </div>
          <div>
            <strong>Payment Method:</strong> {repairorder.invoice.Paymentmethod}
          </div>
        </div>
      ) : (
        <div>No invoice available.</div>
      )} */}
    </div>
  );
}
