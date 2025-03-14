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

    if (!repairs?.data) {
      throw new Error("No data available");
    }

    return { repairs: repairs.data };
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

  const filteredRepairs = useMemo(() => {
    return repairs.filter((repair) => {
      const repairDate = new Date(repair.createdAt).toISOString().split("T")[0];
      return repairDate === selectedDate;
    });
  }, [repairs, selectedDate]);

  // Calculating total income, number of transactions, and number of repaired devices
  const totalIncome = useMemo(() => {
    return filteredRepairs.reduce(
      (total, repair) => total + (repair.invoice?.totalAmount || 0),
      0
    );
  }, [filteredRepairs]);

  const totalTransactions = filteredRepairs.length;

  const totalRepairedDevices = filteredRepairs.reduce((total, repair) => {
    return total + (repair.parts?.length || 0);
  }, 0);

  return (
    <div>
      <div className="flex justify-between items-end mb-4 mt-6">
        <DashboardTitle title="Inkomsten" />
        <Datepicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          showDatePicker={showDatePicker}
          setShowDatePicker={setShowDatePicker}
        />
      </div>

      <div className="flex flex-col gap-4">
        {/* Cards */}
        <div className="flex gap-4">
          <DashboardCard title="Totaal" data={`€ ${totalIncome}`} />
          <DashboardCard title="Aantal Transacties" data={totalTransactions} />
          <DashboardCard
            title="Aantal Gerepareerde Apparaten"
            data={totalRepairedDevices}
          />
        </div>

        {/* Table */}
        <div className="bg-primaryHelper rounded-md">
          <div className="flex justify-between font-bold px-4 py-2">
            <div className="px-4 py-2 w-1/4">Model</div>
            <div className="px-4 py-2 w-1/4">Onderdeel</div>
            <div className="px-4 py-2 w-1/4">Betalingsmethode</div>
            <div className="px-4 py-2 w-1/4">Bedrag</div>
          </div>

          <div className="px-4 py-2 rounded-md">
            {filteredRepairs.length > 0 ? (
              filteredRepairs.map((repair) => (
                <div
                  key={repair.id}
                  className="flex justify-between bg-accentLight mt-2"
                >
                  <div className="px-4 py-2 w-1/4">
                    {repair.device?.model} {repair.device?.modelType}
                  </div>

                  <div className="px-4 py-2 w-1/4">
                    {repair.parts?.map((part) => (
                      <div key={part.id}>
                        {part.name} {part.purchasePrice}
                      </div>
                    ))}
                  </div>

                  <div className="px-4 py-2 w-1/4">
                    {repair.invoice?.paymentmethod}
                  </div>

                  <div className="px-4 py-2 w-1/4">
                    € {repair.invoice?.totalAmount}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-center">
                Geen reparaties voor vandaag
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
