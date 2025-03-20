import { useState, useMemo } from "react";
import { useLoaderData } from "@remix-run/react";
import { getRepairorders } from "../core/modules/repairorders/api";
import { Repairorders } from "../core/modules/repairorders/type";
import Datepicker from "../components/design/DatePicker/DataPicker";
import DashboardTitle from "../components/design/Title/DashboardTitle";
import DashboardCard from "../components/design/Card/DashboardCard";

type LoaderData = {
  repairs: Repairorders[];
};

export async function loader() {
  try {
    const repairs = await getRepairorders();
    if (!repairs.length) throw new Error("No data available");
    return { repairs };
  } catch (error) {
    console.error("Error while fetching data:", error);
    return { repairs: [] };
  }
}

export default function Invoices() {
  const { repairs } = useLoaderData<LoaderData>();
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<"daily" | "monthly">("daily");

  const filteredRepairs = useMemo(() => {
    return repairs.filter((repair) => {
      const repairDate = new Date(repair.createdAt);
      const selectedDateObj = new Date(selectedDate);

      if (filterType === "daily") {
        return repairDate.toISOString().split("T")[0] === selectedDate;
      } else {
        return (
          repairDate.getFullYear() === selectedDateObj.getFullYear() &&
          repairDate.getMonth() === selectedDateObj.getMonth()
        );
      }
    });
  }, [repairs, selectedDate, filterType]);

  const totalIncome = useMemo(() => {
    return filteredRepairs.reduce(
      (total, repair) => total + (repair.invoice?.totalAmount || 0),
      0
    );
  }, [filteredRepairs]);

  const totalTransactions = filteredRepairs.length;
  const totalRepairedDevices = filteredRepairs.reduce(
    (total, repair) => total + (repair.parts?.length || 0),
    0
  );

  return (
    <div>
      <div className="flex justify-between items-end mb-4 mt-6">
        <DashboardTitle title="Inkomsten" />
        <div className="flex items-center gap-4">
          <button
            className={`p-2 border rounded-lg ${
              filterType === "daily" ? "bg-accent text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilterType("daily")}
          >
            Dagelijks
          </button>
          <button
            className={`p-2 border rounded-lg ${
              filterType === "monthly" ? "bg-accent text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilterType("monthly")}
          >
            Maandelijks
          </button>
          <Datepicker
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            showDatePicker={showDatePicker}
            setShowDatePicker={setShowDatePicker}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <DashboardCard title="Totaal" data={`€ ${totalIncome}`} />
          <DashboardCard title="Aantal Transacties" data={totalTransactions} />
          <DashboardCard
            title="Aantal Gerepareerde Apparaten"
            data={totalRepairedDevices}
          />
        </div>

        <div className="bg-dashboardSidebar rounded-md ">
          <div className="flex justify-between font-bold px-4 py-2">
            <div className="px-4 py-2 w-1/5">Model</div>
            <div className="px-4 py-2 w-1/5">Onderdeel</div>
            <div className="px-4 py-2 w-1/5">Betalingsmethode</div>
            <div className="px-4 py-2 w-1/5">Bedrag</div>
            <div className="px-4 py-2 w-1/5">Factuur</div>
          </div>
          <div className="px-4 py-2 rounded-md h-[35rem] 2xl:h-[50rem] overflow-y-scroll">
            {filteredRepairs.length > 0 ? (
              filteredRepairs.map((repair) => (
                <div
                  key={repair.id}
                  className={`flex justify-between mt-2 ${
                    repair.invoice?.invoice === true
                      ? "bg-accent"
                      : "bg-accentLight"
                  }`}
                >
                  <div className="px-4 py-2 w-1/5">
                    {repair.device?.model} {repair.device?.modelType}
                  </div>
                  <div className="px-4 py-2 w-1/5">
                    {repair.parts?.map((part) => (
                      <div key={part.id}>{part.name}</div>
                    ))}
                  </div>
                  <div className="px-4 py-2 w-1/5">
                    {repair.invoice?.paymentmethod}
                  </div>
                  <div className="px-4 py-2 w-1/5">
                    € {repair.invoice?.totalAmount}
                  </div>
                  <div className="px-4 py-2 w-1/5">
                    {repair.invoice?.invoice === true ? "Ja" : "Nee"}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-center">
                Geen reparaties voor deze periode
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
