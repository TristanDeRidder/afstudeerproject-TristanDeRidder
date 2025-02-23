import { useLoaderData } from "@remix-run/react";
import { getDevices } from "../core/modules/devices/api";
import { Devices } from "../core/modules/devices/type";

type LoaderData = {
  devices: Devices[];
};

export async function loader() {
  try {
    const devices = await getDevices();

    if (!devices?.data) {
      throw new Error("No data available");
    }

    return { devices: devices.data };
  } catch (error) {
    console.error("Error while fetching data:", error);
    return { devices: [] };
  }
}

export default function Devices() {
  const { devices } = useLoaderData<LoaderData>();

  return (
    <div>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Brand</th>
            <th className="px-4 py-2">Model</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device) => (
            <tr key={device.id}>
              <td className="border px-4 py-2">{device.Type}</td>
              <td className="border px-4 py-2">{device.brand?.BrandName}</td>
              <td className="border px-4 py-2">
                {device.Model} {device.ModelType}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
