import { useMemo, useState } from "react";
import { useLoaderData, useFetcher, json } from "@remix-run/react";
import {
  getRepairorders,
  addRepairorder,
} from "../core/modules/repairorders/api";
import type { Repairorders } from "../core/modules/repairorders/type";
import Datepicker from "../components/design/DatePicker/DataPicker";
import DashboardTitle from "../components/design/Title/DashboardTitle";
import DashboardCard from "../components/design/Card/DashboardCard";

type LoaderData = { repairs: Repairorders[] };

export async function loader() {
  try {
    const repairs = await getRepairorders();
    if (!repairs?.data) throw new Error("No data available");
    return { repairs: repairs.data };
  } catch (error) {
    console.error("Error while fetching data:", error);
    return { repairs: [] };
  }
}

export async function action({ request }: any) {
  const formData = await request.formData();
  const statusRepair = formData.get("statusRepair");
  const issue = formData.get("issue");
  const repairable = formData.get("repairable") === "true";

  try {
    await addRepairorder(statusRepair, issue, repairable);
    return { success: true };
  } catch (error) {
    console.error("Failed to add repair order:", error);
    return { success: false };
  }
}

export default function Repairorders() {
  const fetcher = useFetcher();
  const { repairs } = useLoaderData<LoaderData>();

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);

  const filteredRepairs = useMemo(() => {
    if (!selectedDate) return repairs;
    return repairs.filter((repair) => {
      const repairDate = new Date(repair.createdAt).toLocaleDateString("en-GB");
      return repairDate === new Date(selectedDate).toLocaleDateString("en-GB");
    });
  }, [selectedDate, repairs]);

  const openRepairs = useMemo(
    () =>
      filteredRepairs.filter((repair) => repair.StatusRepair !== "Opgehaald"),
    [filteredRepairs]
  );
  const completedRepairs = useMemo(
    () =>
      filteredRepairs.filter((repair) => repair.StatusRepair === "Opgehaald"),
    [filteredRepairs]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    fetcher.submit(formData, { method: "post" });
    setShowOverlay(false);
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <DashboardTitle title="Reparaties" />
        <div className="flex gap-4">
          <Datepicker
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            showDatePicker={showDatePicker}
            setShowDatePicker={setShowDatePicker}
          />
          <button
            onClick={() => setShowOverlay(true)}
            className="bg-accentLight px-4 py-2 rounded-md"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <DashboardCard
          title="Openstaande Reparaties"
          data={openRepairs.length}
        />
        <DashboardCard
          title="Totaal Reparaties"
          data={filteredRepairs.length}
        />
        <DashboardCard title="Complete" data={completedRepairs.length} />
      </div>

      {showOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-primaryHelper p-4 rounded-md w-1/2">
            <h2 className="text-xl font-bold mb-4">
              Nieuwe reparatie toevoegen
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label>Status Repair</label>
                <select
                  name="statusRepair"
                  required
                  className="border rounded-md p-2 w-full"
                >
                  <option value="">Select Status</option>
                  <option value="Bestellen">Bestellen</option>
                  <option value="Besteld">Besteld</option>
                  <option value="Geleverd">Geleverd</option>
                  <option value="Op de hoogte">Op de hoogte</option>
                  <option value="Binnen">Binnen</option>
                  <option value="Reparatie">Reparatie</option>
                  <option value="Klaar">Klaar</option>
                  <option value="Opgehaald">Opgehaald</option>
                </select>
              </div>
              <div className="mb-2">
                <label>Issue</label>
                <input
                  type="text"
                  name="issue"
                  required
                  className="border rounded-md p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label>
                  <input type="checkbox" name="repairable" value="true" />{" "}
                  Repairable
                </label>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-accentLight px-4 py-2 rounded-md"
                >
                  Reparatie toevoegen
                </button>
                <button
                  type="button"
                  onClick={() => setShowOverlay(false)}
                  className="bg-gray-400 px-4 py-2 rounded-md"
                >
                  Annuleren
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-primaryHelper rounded-md mt-4">
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
