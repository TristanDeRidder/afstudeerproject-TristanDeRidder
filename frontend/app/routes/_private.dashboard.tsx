import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getRepairorders } from "../core/modules/repairorders/api";
import { Repairorders } from "../core/modules/repairorders/type";
import { Invoices } from "../core/modules/invoices/type";
import { getInvoices } from "../core/modules/invoices/api";

type LoaderData = {
  repairs: Repairorders[];
  invoices: Invoices[];
};

export async function loader() {
  try {
    const repairs = await getRepairorders();
    const invoices = await getInvoices();

    if (!repairs?.data) {
      throw new Error("No data available");
    }

    if (!invoices?.data) {
      throw new Error("No data available");
    }

    return { repairs: repairs.data, invoices: invoices.data };
  } catch (error) {
    console.error("Error while fetching data:", error);
    return { repairs: [], invoices: [] };
  }
}

export default function Dashboard() {
  const { repairs, invoices } = useLoaderData<LoaderData>();
  const [selectedDate, setSelectedDate] = useState("");

  const filteredRepairs = selectedDate
    ? repairs.filter((repair) => repair.createdAt.startsWith(selectedDate))
    : repairs;

  const dailyIncome = invoices.reduce((acc, invoice) => {
    const date = invoice.createdAt.split("T")[0];
    acc[date] = (acc[date] || 0) + (invoice.TotalAmount || 0);
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(dailyIncome).map(([date, amount]) => ({
    date,
    amount,
  }));

  return (
    <>
      {/* Date filter */}
      <div className="mb-4">
        <label htmlFor="date" className="block text-sm font-medium mb-2">
          Filter repairs by date:
        </label>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border rounded p-2"
        />
      </div>

      {/* Bar chart for daily income */}
      <div className="bg-primary rounded-md border p-4 mb-8">
        <h2 className="text-2xl mb-4">Daily Income</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Repairs table */}
      <div className="bg-primary rounded-md border">
        <h2 className="text-2xl">Reparaties</h2>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Model</th>
              <th className="px-4 py-2">Parts</th>
              <th className="px-4 py-2">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredRepairs.map((repair) => (
              <tr
                key={repair.id}
                className={
                  repair.StatusRepair === "Opgehaald" ? "bg-accent" : ""
                }
              >
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
                  €{repair.invoice?.TotalAmount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
