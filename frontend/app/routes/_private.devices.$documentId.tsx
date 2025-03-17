import { useLoaderData } from "@remix-run/react";
import invariant  from "tiny-invariant";

// API
import { getDeviceById } from "../core/modules/devices/api";

// Type
import type { Devices } from "../core/modules/devices/type";
import { Parts } from "../core/modules/parts/type";
import { LoaderFunctionArgs } from "@remix-run/node";

type LoaderData = {
  device: Devices;
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.documentId, "Missing documentId param");
  const device = await getDeviceById(params.documentId);
  if (!device) {
    throw new Error("Device not found");
  }
  return { device: device.data };
};

export default function DeviceDetail() {
  const { device } = useLoaderData() as LoaderData;
  return (
    <div>
      <h1>
        {device.model} {device.modelType}
      </h1>
    </div>
  );
}