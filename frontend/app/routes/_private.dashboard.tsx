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

    if (!repairs.length || !invoices.length) {
      throw new Error("No data available");
    }

    return { repairs, invoices };
  } catch (error) {
    console.error("Error while fetching data:", error);
    return { repairs: [], invoices: [] };
  }
}

/**
 * Returns an array of dates for a full week (Monday to Sunday) based on a given reference date.
 * @param {Date} referenceDate The date to calculate the week from.
 * @returns {string[]} Array of date strings in the format 'YYYY-MM-DD'.
 */
function getWeekDates(referenceDate: Date) {
  const dates = [];
  const startOfWeek = new Date(referenceDate);
  const dayOfWeek = startOfWeek.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  startOfWeek.setDate(startOfWeek.getDate() + diff);

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    dates.push(date.toISOString().split("T")[0]);
  }
  return dates;
}


export default function Dashboard() {
  const { repairs, invoices } = useLoaderData() as LoaderData;
  const today = new Date();

  const [selectedDate, setSelectedDate] = useState(
    today.toISOString().split("T")[0]
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const filteredRepairs = selectedDate
    ? repairs.filter((repair) => repair.createdAt.startsWith(selectedDate))
    : repairs;

  const totalRepairedDevices = filteredRepairs.reduce((total, repair) => {
    return total + (repair.parts?.length || 0);
  }, 0);

  const currentWeekDates = getWeekDates(today);
  const previousWeekDates = getWeekDates(
    new Date(today.setDate(today.getDate() - 7))
  );

  /* This code snippet is creating an array of objects called `currentWeekIncome` by mapping over the
  `currentWeekDates` array. For each date in `currentWeekDates`, it filters the `invoices` array to
  only include invoices that have a `createdAt` value starting with the current date. Then, it
  calculates the total income for that specific date by summing up the `totalAmount` of each invoice
  using the `reduce` method. Finally, it returns an object for each date with the date itself and
  the total income for that date. */
  const currentWeekIncome = currentWeekDates.map((date) => {
    const dailyTotal = invoices
      .filter((invoice) => invoice.createdAt.startsWith(date))
      .reduce((sum, invoice) => sum + (invoice.totalAmount || 0), 0);

    return { date, income: dailyTotal };
  });

  /* This code snippet is creating an array of total income values for each day in the previous week.
  Here's a breakdown of what it does: */
  const previousWeekIncome = previousWeekDates.map((date) => {
    const dailyTotal = invoices
      .filter((invoice) => invoice.createdAt.startsWith(date))
      .reduce((sum, invoice) => sum + (invoice.totalAmount || 0), 0);
    return dailyTotal;
  });

  const lastWeekTotal = currentWeekIncome.reduce(
    (sum, day) => sum + day.income,
    0
  );
  const previousWeekTotal = previousWeekIncome.reduce(
    (sum, income) => sum + income,
    0
  );

  const percentageChange = previousWeekTotal
    ? ((lastWeekTotal - previousWeekTotal) / previousWeekTotal) * 100
    : 0;

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
              <BarChart data={currentWeekIncome}>
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
                <Tooltip />
                <Bar dataKey="income" fill="#93C5FD" radius={4}>
                  {currentWeekIncome.map((entry) => (
                    <Cell
                      key={`cell-${entry.date}`}
                      fill={
                        entry.date === today.toISOString().split("T")[0]
                          ? "#3B82F6"
                          : "#93C5FD"
                      }
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
