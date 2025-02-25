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
    <div className="bg-primary p-4">
      <div className="flex justify-between">
        <div className="font-bold px-4 py-2 w-1/3">Type</div>
        <div className="font-bold px-4 py-2 w-1/3">Brand</div>
        <div className="font-bold px-4 py-2 w-1/3">Model</div>
      </div>
      <div>
        {devices.map((device) => (
          <div key={device.id} className="flex justify-between bg-primaryHelper mt-2">
            <div className="px-4 py-2 w-1/3">{device.Type}</div>
            <div className="px-4 py-2 w-1/3">
              {device.brand?.BrandName}
            </div>
            <div className="px-4 py-2 w-1/3">
              {device.Model} {device.ModelType}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
