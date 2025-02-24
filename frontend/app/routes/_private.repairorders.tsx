import { useLoaderData } from "@remix-run/react";
import { getRepairorders } from "../core/modules/repairorders/api";
import { Repairorders } from "../core/modules/repairorders/type";

type LoaderData = {
  repairs: Repairorders[];
};

export async function loader() {
  try {
    const repairs = await getRepairorders();

    if (!repairs?.data) {
      throw new Error("No data available");
    }

    return { repairs: repairs.data };
  } catch (error) {
    console.error("Error while fetching data:", error);
    return { repairs: [] };
  }
}

export default function Repairorders() {
  const { repairs } = useLoaderData<LoaderData>();

  return (
    <div>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Model</th>
            <th className="px-4 py-2">Onderdeel</th>
            <th className="px-4 py-2">Betalingsmethode</th>
            <th className="px-4 py-2">Bedrag</th>
          </tr>
        </thead>
        <tbody>
          {repairs.map((repair) => (
            <tr key={repair.id}>
              <td className="border px-4 py-2">
                {repair.device?.Model} {repair.device?.ModelType}
              </td>

              <td className="border px-4 py-2">
                {repair.parts?.map((part) => (
                  <div key={part.id}>
                    {part.Name} {part.Price}
                  </div>
                ))}
              </td>

              <td className="border px-4 py-2">
                {repair.invoice?.Paymentmethod}
              </td>

              <td className="border px-4 py-2">
                €{repair.invoice?.TotalAmount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
