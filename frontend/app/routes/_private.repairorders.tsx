import { useMemo, useState } from "react";
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

export default function Repairorders() {
  const { repairs } = useLoaderData<LoaderData>();

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  // Filter repairs by selected date
  const filteredRepairs = useMemo(() => {
    if (!selectedDate) return repairs;
    return repairs.filter((repair) => {
      const repairDate = new Date(repair.createdAt).toLocaleDateString("en-GB");
      return repairDate === new Date(selectedDate).toLocaleDateString("en-GB");
    });
  }, [selectedDate, repairs]);

  // Filtering based on StatusRepair
  const openRepairs = useMemo(() => {
    return filteredRepairs.filter(
      (repair) => repair.StatusRepair !== "Opgehaald"
    );
  }, [filteredRepairs]);

  const completedRepairs = useMemo(() => {
    return filteredRepairs.filter(
      (repair) => repair.StatusRepair === "Opgehaald"
    );
  }, [filteredRepairs]);

  // Cards values
  const openRepairsCount = openRepairs.length;
  const completedRepairsCount = completedRepairs.length;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <DashboardTitle title="Reparaties" />
        <Datepicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          showDatePicker={showDatePicker}
          setShowDatePicker={setShowDatePicker}
        />
      </div>

      <div className="flex gap-4 mb-4">
        <DashboardCard title="Openstaande Reparaties" data={openRepairsCount} />
        <DashboardCard title="Totaal Reparaties" data={filteredRepairs.length} />
        <DashboardCard title="Complete" data={completedRepairsCount} />
      </div>

      {/* Table */}
      <div className="bg-primaryHelper rounded-md">
        <div className="flex justify-between font-bold px-4 py-2">
          <div className="px-4 py-2 w-1/5">Model</div>
          <div className="px-4 py-2 w-1/5">Onderdeel</div>
          <div className="px-4 py-2 w-1/5">Telefoonnummer</div>
          <div className="px-4 py-2 w-1/5">Bedrag</div>
          <div className="px-4 py-2 w-1/5">Status</div>
        </div>

        <div className="px-4 py-2 rounded-md">
          {filteredRepairs.length > 0 ? (
            filteredRepairs.map((repair) => (
              <div
                key={repair.id}
                className="flex justify-between bg-accentLight mt-2"
              >
                <div className="px-4 py-2 w-1/5">
                  {repair.device?.Model} {repair.device?.ModelType}
                </div>

                <div className="px-4 py-2 w-1/5">
                  {repair.parts?.map((part) => (
                    <div key={part.id}>
                      {part.Name} {part.Price}
                    </div>
                  ))}
                </div>

                <div className="px-4 py-2 w-1/5">
                  {repair.customer?.Phonenumber}
                </div>

                <div className="px-4 py-2 w-1/5">
                  €{repair.invoice?.TotalAmount}
                </div>
                <div className="px-4 py-2 w-1/5">{repair.StatusRepair}</div>
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
  );
}
