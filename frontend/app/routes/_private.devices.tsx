import { useState, useEffect } from "react";
import { useLoaderData } from "@remix-run/react";
import { getDevices } from "../core/modules/devices/api";
import type { Devices } from "../core/modules/devices/type";

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

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDevices, setFilteredDevices] = useState(devices);

  useEffect(() => {
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      setFilteredDevices(
        devices.filter(
          (device) =>
            device.type.toLowerCase().includes(lowerCaseQuery) ||
            device.brand?.brandName.toLowerCase().includes(lowerCaseQuery) ||
            device.model.toLowerCase().includes(lowerCaseQuery) ||
            (device.modelType &&
              device.modelType.toLowerCase().includes(lowerCaseQuery))
        )
      );
    } else {
      setFilteredDevices(devices);
    }
  }, [searchQuery, devices]);

  return (
    <div className="bg-primary p-4">
      {/* Search Bar */}
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search for devices..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-3 rounded-lg border border-gray-300 w-80"
        />
      </div>

      {/* Device List */}
      <div className="flex justify-between">
        <div className="font-bold px-4 py-2 w-1/3">Type</div>
        <div className="font-bold px-4 py-2 w-1/3">Brand</div>
        <div className="font-bold px-4 py-2 w-1/3">Model</div>
      </div>
      <div>
        {filteredDevices.map((device) => (
          <div
            key={device.id}
            className="flex justify-between bg-primaryHelper mt-2"
          >
            <div className="px-4 py-2 w-1/3">{device.type}</div>
            <div className="px-4 py-2 w-1/3">{device.brand?.brandName}</div>
            <div className="px-4 py-2 w-1/3">
              {device.model} {device.modelType}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
