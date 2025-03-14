import { Link, useLoaderData } from "@remix-run/react";
import { getRepairorders } from "../core/modules/repairorders/api";
import { getInvoices } from "../core/modules/invoices/api";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import DashboardTitle from "../components/design/Title/DashboardTitle";
import DatePicker from "../components/design/DatePicker/DataPicker";
import DashboardLink from "../components/design/Link/DashboardLink";
import DashboardSecondaryTitle from "../components/design/Title/DashboardSecondaryTitle";
import { Repairorders } from "../core/modules/repairorders/type";
import { Invoices } from "../core/modules/invoices/type";
import DashboardCard from "../components/design/Card/DashboardCard";

type LoaderData = {
  repairs: Repairorders[];
  invoices: Invoices[];
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
    <div className="bg-dashboardSidebar p-2 rounded-md shadow-md">
      <p>
        <strong>Datum:</strong>{" "}
        {new Date(payload[0].payload.date).toLocaleDateString("nl-BE", {
          day: "2-digit",
          month: "2-digit",
        })}
      </p>
      <p>
        <strong>Inkomsten:</strong> €{payload[0].value}
      </p>
    </div>
  );
};

export default function Dashboard() {
  const { repairs, invoices } = useLoaderData() as LoaderData;
  const today = new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(today);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const filteredRepairs = selectedDate
    ? repairs.filter((repair) => repair.createdAt.startsWith(selectedDate))
    : repairs;

  const totalRepairedDevices = filteredRepairs.reduce((total, repair) => {
    return total + (repair.parts?.length || 0);
  }, 0);

  const lastWeekDates = getLastWeekDates();
  const dailyIncome = lastWeekDates.map((date) => {
    const dailyTotal = invoices
      .filter((invoice) => invoice.createdAt.startsWith(date))
      .reduce((sum, invoice) => sum + (invoice.totalAmount || 0), 0);

    return { date, income: dailyTotal };
  });

  const totalAmountLastWeek = dailyIncome.reduce(
    (sum, day) => sum + day.income,
    0
  );

  // Helper function to get dates for the previous week
  function getPreviousWeekDates() {
    const dates = [];
    const today = new Date();
    for (let i = 13; i >= 7; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      dates.push(date.toISOString().split("T")[0]);
    }
    return dates;
  }

  // Calculate income for last week and the week before
  const lastWeekTotal = dailyIncome.reduce((sum, day) => sum + day.income, 0);

  const previousWeekDates = getPreviousWeekDates();
  const previousWeekIncome = previousWeekDates.map((date) => {
    const dailyTotal = invoices
      .filter((invoice) => invoice.createdAt.startsWith(date))
      .reduce((sum, invoice) => sum + (invoice.totalAmount || 0), 0);

    return dailyTotal;
  });

  const previousWeekTotal = previousWeekIncome.reduce(
    (sum, income) => sum + income,
    0
  );

  // Calculate the percentage difference
  const percentageChange = previousWeekTotal
    ? ((lastWeekTotal - previousWeekTotal) / previousWeekTotal) * 100
    : 0;

  // Format with + or - sign
  const formattedPercentage = `${
    percentageChange >= 0 ? "+" : ""
  }${percentageChange.toFixed(2)}%`;

  return (
    <>
      {/* Datepicker and filter buttons */}
      <div className="flex justify-between items-end mb-4 mt-6">
        <DashboardTitle title="Dashboard" />
        <DatePicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          showDatePicker={showDatePicker}
          setShowDatePicker={setShowDatePicker}
        />
      </div>

      <div className="flex flex-col gap-4">
        {/* Cards */}
        <div className="flex gap-4">
          <DashboardCard
            title="Inkomsten Laatste Week"
            data={`€ ${lastWeekTotal.toFixed(2)}`}
            subtitle={`${formattedPercentage}`}
          />
          <DashboardCard
            title="Totaal Reparaties"
            data={filteredRepairs.length}
          />
          <DashboardCard
            title="Aantal Gerepareerde Apparaten"
            data={totalRepairedDevices}
          />
        </div>

        <div className="flex justify-between space-x-4">
          {/* Chart */}
          <div className="bg-dashboardSidebar rounded-lg p-4 w-1/2">
            <DashboardSecondaryTitle title="Inkomsten" />
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyIncome}>
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(date) =>
                    new Date(date).toLocaleDateString("nl-BE", {
                      day: "2-digit",
                      month: "2-digit",
                    })
                  }
                />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="income" fill="#93C5FD" radius={4}>
                  {dailyIncome.map((entry) => (
                    <Cell
                      key={`cell-${entry.date}`}
                      fill={entry.date === today ? "#3B82F6" : "#93C5FD"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Repairs */}
          <div className="bg-dashboardSidebar rounded-lg p-4 w-1/2">
            <div className="flex justify-between items-center mb-4">
              <DashboardSecondaryTitle title="Reparaties" />
              <DashboardLink url="/repairorders" />
            </div>

            <div className="w-full grid gap-2">
              {filteredRepairs.map((repair) => (
                <Link
                  key={repair.documentId}
                  to={`/detail?documentId=${repair.documentId}`}
                  className={`rounded-md p-4 grid grid-cols-4 gap-4 list-decimal hover:bg-dashboardPrimary hover:text-dashboardBg transition-all duration-300 ${
                    repair.statusRepair === "Opgehaald"
                      ? "bg-dashboardPrimaryHelper"
                      : "bg-dashboardBg"
                  }`}
                >
                  <div>
                    {repair.device?.model} {repair.device?.modelType}
                  </div>
                  <div>
                    {repair.parts.map((part: any) => (
                      <div key={part.id}>{part.name}</div>
                    ))}
                  </div>
                  <div>€ {repair.invoice?.totalAmount}</div>
                  <div
                    className={`${
                      repair.statusRepair === "Opgehaald"
                        ? "text-dashboardSucces"
                        : "text-dashboardWarning"
                    }`}
                  >
                    {repair.statusRepair}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
