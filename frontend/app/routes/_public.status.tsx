import { useLoaderData } from "@remix-run/react";

// API
import { getRepairorders } from "../core/modules/repairorders/api"
import { Repairorders } from "~/core/modules/repairorders/type";

type LoaderData = {
    repairorders: any;
}

export async function loader() {
  try {
    const repairorders = await getRepairorders();

    if (!repairorders?.data) {
      throw new Error("No data available");
    }

    return { repairorders: repairorders.data };
  } catch (error) {
    console.error("Error while fetching data:", error);

    return { brands: null, devices: null, parts: null };
  }
}

export default function Repair() {
    const { repairorders } = useLoaderData() as LoaderData;

    return (
      <div>
        <div>
          {repairorders.map((repairorder: any, index: number) => (
            <div key={index}>
              <div>Document ID: {repairorder.documentId}</div>
              <div>Issue: {repairorder.Issue}</div>
              {repairorder.device ? (
                <div>
                  <div>Device Name: {repairorder.device.Name}</div>
                  <div>Device Model: {repairorder.device.ModelNumber}</div>
                  <div>Device Type: {repairorder.device.Type}</div>
                </div>
              ) : (
                <div>No device available</div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
}