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
import { getJwtFromCookie } from "../core/utils/auth.server";

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

export async function action({ request }: any) {
  const formData = await request.formData();
  const statusRepair = formData.get("statusRepair");
  const issue = formData.get("issue");
  const repairable = formData.get("repairable") === "true";

  // Retrieve the JWT token from the request
  const authToken = getJwtFromCookie(request); // <-- This should give you the unserialized JWT

  if (!authToken) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await addRepairorder(statusRepair, issue, repairable, authToken); // Pass token to your API function
    return { success: true };
  } catch (error) {
    console.log(
      `
    POST check
    `,
      { statusRepair, issue, repairable, authToken }
    );
    console.error(
      `
      1: Failed to add repair order:
      `,
      error
    );
    return { success: false };
  }
}

export default function Repairorders() {
  const { repairs } = useLoaderData<LoaderData>();
  const fetcher = useFetcher();

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  // Filter repairs by selected date
  const filteredRepairs = useMemo(() => {
    if (!selectedDate) return repairs;
    return repairs.filter((repair) => {
      const repairDate = new Date(repair.created_at).toLocaleDateString("en-GB");
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    fetcher.submit(formData, { method: "post" });
  };

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

      <form onSubmit={handleSubmit} className="bg-primaryHelper p-4 rounded-md">
        <h2 className="text-xl font-bold mb-4">Nieuwe reparatie toevoegen</h2>
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
            <input type="checkbox" name="repairable" value="true" /> Repairable
          </label>
        </div>
        <button type="submit" className="bg-accentLight px-4 py-2 rounded-md">
          Reparatie toevoegen
        </button>
      </form>

      {/* Table */}
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
