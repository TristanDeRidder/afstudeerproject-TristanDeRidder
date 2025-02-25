import { Link, useLoaderData } from "@remix-run/react";
import { getRepairorders } from "../core/modules/repairorders/api";
import { getInvoices } from "../core/modules/invoices/api";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { MoveRight } from "lucide-react";
import { ChartTooltip, ChartTooltipContent } from "../components/ui/chart";
import DashboardTitle from "../components/design/Title/DashboardTitle";

type LoaderData = {
  repairs: any[];
  invoices: any[];
};

export async function loader() {
  try {
    const repairs = await getRepairorders();
    const invoices = await getInvoices();

    if (!repairs?.data || !invoices?.data) {
      throw new Error("No data available");
    }

    return { repairs: repairs.data, invoices: invoices.data };
  } catch (error) {
    console.error("Error while fetching data:", error);
    return { repairs: [], invoices: [] };
  }
}

function getLastWeekDates() {
  const dates = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split("T")[0]);
  }
  return dates;
}

const ChartTooltipContent = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: any[];
}) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white p-2 rounded-md shadow-md">
      <p>
        <strong>Date:</strong>{" "}
        {new Date(payload[0].payload.date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
        })}
      </p>
      <p>
        <strong>Income:</strong> €{payload[0].value}
      </p>
    </div>
  );
};

export default function Dashboard() {
  const { repairs, invoices } = useLoaderData<LoaderData>();
  const [selectedDate, setSelectedDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const filteredRepairs = selectedDate
    ? repairs.filter((repair) => repair.createdAt.startsWith(selectedDate))
    : repairs;

  const lastWeekDates = getLastWeekDates();
  const dailyIncome = lastWeekDates.map((date) => {
    const dailyTotal = invoices
      .filter((invoice) => invoice.createdAt.startsWith(date))
      .reduce((sum, invoice) => sum + (invoice.TotalAmount || 0), 0);

    return { date, income: dailyTotal };
  });

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      {/* Datepicker */}
      <div className="flex justify-between items-center mb-4">
        <DashboardTitle title="Dashboard" />
        <div className="relative">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="border rounded-full p-2  text-left bg-secondary text-bg"
          >
            {selectedDate
              ? new Date(selectedDate).toLocaleDateString("en-GB")
              : "Select a date"}
          </button>

          {showDatePicker && (
            <div className="absolute top-full mt-2 bg-secondary border rounded-md shadow-md p-4 z-10">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setShowDatePicker(false);
                }}
                className="border rounded p-2 w-full"
              />
              <div className="flex justify-between mt-2 gap-4">
                <button
                  onClick={() => {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    setSelectedDate(yesterday.toISOString().split("T")[0]);
                    setShowDatePicker(false);
                  }}
                  className="bg-accent text-text p-2 rounded-md hover:bg-accentLight transition-colors duration-300"
                >
                  Gisteren
                </button>
                <button
                  onClick={() => {
                    const twoDaysAgo = new Date();
                    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
                    setSelectedDate(twoDaysAgo.toISOString().split("T")[0]);
                    setShowDatePicker(false);
                  }}
                  className="bg-accent text-text p-2 rounded-md hover:bg-accentLight transition-colors duration-300"
                >
                  Eergisteren
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="flex justify-between space-x-4">
        <div className="bg-primary rounded-md border p-4 w-1/2">
          <h2 className="text-2xl mb-4">Inkomsten</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyIncome}>
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(date) =>
                  new Date(date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                  })
                }
              />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar dataKey="income" fill="#FAFAFA" radius={4}>
                {dailyIncome.map((entry) => (
                  <Cell
                    key={`cell-${entry.date}`}
                    fill={entry.date === today ? "#B8CAF6" : "#FAFAFA"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Repairs */}
        <div className="bg-primary rounded-md border p-4 w-1/2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl">Reparaties</h2>
            <Link
              to="/repairorders"
              className="block bg-primaryHelper rounded-full p-3 text-accent hover:bg-accent hover:text-primary transition-all duration-300"
            >
              <MoveRight className="w-5" />
            </Link>
          </div>
          <div className="w-full grid gap-2">
            {filteredRepairs.map((repair) => (
              <Link
                key={repair.documentIdd}
                to={`/detail?documentId=${repair.documentId}`}
                className={`rounded-md p-4 grid grid-cols-3 gap-4 list-decimal ${
                  repair.StatusRepair === "Opgehaald"
                    ? "bg-accent"
                    : "bg-primaryHelper"
                }`}
              >
                <div>
                  {repair.device?.Model} {repair.device?.ModelType}
                </div>
                <div>
                  {repair.parts.map((part) => (
                    <div key={part.id}>{part.Name}</div>
                  ))}
                </div>
                <div>€{repair.invoice?.TotalAmount}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
