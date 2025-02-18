// API
import { useLoaderData } from "@remix-run/react";
import { getBrands } from "../core/modules/brands/api"
import { getDevices } from "../core/modules/devices/api"
import { getParts } from "../core/modules/parts/api"

type LoaderData = {
    brands: any;
    devices: any;
    parts: any;
}

export async function loader() {
  try {
    const brands = await getBrands();
    const devices = await getDevices();
    const parts = await getParts();

    // Ensure that all the necessary data exists
    if (!brands?.data || !devices?.data || !parts?.data) {
      throw new Error("No data available");
    }

    // Return the fetched data
    return { brands: brands.data, devices: devices.data, parts: parts.data };
  } catch (error) {
    console.error("Error while fetching data:", error);

    // Handle the error, return null data as fallback
    return { brands: null, devices: null, parts: null };
  }
}

export default function Repair() {
    const { brands, devices, parts } = useLoaderData() as LoaderData;

    return (
        <div>
            <div>
                {brands.map((brand: {BrandName: string}, index: number) => (
                    <div key={index}>
                        {brand.BrandName}
                    </div>
                ))}
                </div>
            <div>
                {devices.map((device: {Name: string, ModelNumber: string}, index: number) => (
                    <div key={index}>
                        {device.Name} - {device.ModelNumber}
                    </div>
                ))}
            </div>
            <div>
                {parts.map((part: {Name: string}, index: number) => (
                    <div key={index}>
                        {part.Name}
                    </div>
                ))}
            </div>
        </div>
    )
}