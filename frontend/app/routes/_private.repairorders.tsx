import { useMemo, useState } from "react";
import { useLoaderData, useFetcher, Link } from "@remix-run/react";
import { jwtCookie } from "../core/cookies/cookies.server";

import { getRepairorders, createRepairorder} from "../core/modules/repairorders/api";
import { getDevices } from "../core/modules/devices/api";
import { getParts } from "../core/modules/parts/api";
import { createCustomer } from "../core/modules/customers/api";
import { createInvoice } from "../core/modules/invoices/api";
import { createOrder } from "../core/modules/orders/api";

import type { Repairorders } from "../core/modules/repairorders/type";
import type { Devices } from "../core/modules/devices/type";
import type { Parts } from "../core/modules/parts/type";

import Datepicker from "../components/design/DatePicker/DataPicker";
import DashboardTitle from "../components/design/Title/DashboardTitle";
import DashboardCard from "../components/design/Card/DashboardCard";

type LoaderData = { 
  repairs: Repairorders[],
  devices: Devices[],
  parts: Parts[]
};

export async function loader() {
  try {
    const repairs = await getRepairorders();
    const devices = await getDevices();
    const parts = await getParts();

    if (!repairs?.data) throw new Error("No data available");
    if (!devices?.data) throw new Error("No devices available");
    if (!parts?.data) throw new Error("No parts available");

    return { repairs: repairs.data, devices: devices.data, parts: parts.data };
  } catch (error) {
    console.error("Error while fetching data:", error);
    return { repairs: [], devices: [], parts: [] };
  }
}

export async function action({ request }: any) {
  const jwt = await jwtCookie.parse(request.headers.get("Cookie"));
  const formData = await request.formData();

  // repairData
  const statusRepair = formData.get("statusRepair");
  const issue = formData.get("issue");
  const repairable = formData.get("repairable") === "true";
  // customerData
  const firstname = formData.get("firstname");
  const lastname = formData.get("lastname");
  const mail = formData.get("mail");
  const phonenumber = formData.get("phonenumber");
  // device
  const deviceId = formData.get("deviceId");
  // parts
  const parts = formData.getAll("parts");
  // invoice
  const invoiceTotal = formData.get("invoiceTotal");
  const invoiceBool = false;
  const paid = false;
  const paymentMethod = "Bancontact";

  try {
    // 1. Create customer
    const customer = await createCustomer({ Firstname: firstname, Lastname: lastname, Mailaddress: mail, Phonenumber: phonenumber }, jwt);
    const customerId = customer?.data?.id;

    if (!customerId) throw new Error("Failed to get customer ID");

    // 2. Create invoice
    const invoice = await createInvoice({ TotalAmount: invoiceTotal, Invoice: invoiceBool, Paid: paid, invoiceMethod: paymentMethod}, jwt);
    const invoiceId = invoice?.data?.id;

    if (!invoiceId) throw new Error("Failed to get invoice ID");


    // 3. create order
    if(statusRepair === "Bestellen"){
      const orderData = {
        statusOrder: statusRepair,
        device: deviceId,
        parts: parts.length > 0 ? parts.map((partId: any) => ({ id: partId })) : [],
        customer: customerId,
        invoice: invoiceId,
      };
      await createOrder(orderData, jwt);
    }

    // 4. Add repair order using the retrieved IDs
    const repairData = {
      statusRepair,
      issue,
      repairable,
      customer: customerId,
      device: deviceId,
      parts: parts.length > 0 ? parts.map((partId: any) => ({ id: partId })) : [],
      invoice: invoiceId,
    };

    await createRepairorder(repairData, jwt);
    return { success: true };
  } catch (error) {
    console.error("Failed to add repair order:", error);
    return { success: false };
  }
}

export default function Repairorders() {
  const fetcher = useFetcher();
  const { repairs, devices, parts } = useLoaderData() as LoaderData;

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

  // Filter parts based on selected device
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");

  const filteredParts = useMemo(() => {
    const filtered = parts.filter(
      (part) => part.device?.id.toString() === selectedDeviceId.toString()
    );
    return filtered;
  }, [selectedDeviceId, parts]);
  
  
  const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDeviceId = e.target.value;
    setSelectedDeviceId(newDeviceId);
  };

  // Selected parts (for calculating the total price)
  const [selectedPartIds, setSelectedPartIds] = useState<string[]>([]);

  const totalPrice = useMemo(() => {
    return selectedPartIds.reduce((sum, partId) => {
      const part = filteredParts.find((part) => part.id.toString() === partId.toString());
      return sum + (part?.SellingPrice || 0);
    }, 0);
  }, [selectedPartIds, filteredParts]);

  const handlePartChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (opt) => opt.value
    );
    setSelectedPartIds(selectedOptions);
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
          <h2 className="text-xl font-bold mb-4">Nieuwe reparatie toevoegen</h2>
          <form onSubmit={handleSubmit}>
            {/* Repair data */}
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

            {/* Customer data */}
            <div className="mb-2 flex flex-col gap-2">
              <label>Klant</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="firstname"
                  placeholder="voornaam"
                  className="border rounded-md p-2 w-full"
                />
                <input
                  type="text"
                  name="lastname"
                  placeholder="achternaam"
                  className="border rounded-md p-2 w-full"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="email"
                  name="mail"
                  placeholder="e-mailadres"
                  className="border rounded-md p-2 w-full"
                />
                <input
                  type="text"
                  name="phonenumber"
                  placeholder="+32 123 45 67 89"
                  className="border rounded-md p-2 w-full"
                />
              </div>
            </div>

            {/* Device Data */}
            <div className="mb-2">
              <label>Device</label>
              <select
                name="deviceId"
                className="border rounded-md p-2 w-full"
                onChange={handleDeviceChange}
              >
                <option value="">Select Device</option>
                {devices.map((device) => (
                  <option key={device.id} value={device.id}>
                    {device.Model} {device.ModelType}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-2">
              <label>Parts</label>
              <select
                key={selectedDeviceId}
                name="parts"
                multiple
                className="border rounded-md p-2 w-full"
                onChange={handlePartChange}
              >
                {filteredParts.map((part) => (
                  <option key={part.id} value={part.id}>
                    {part.Name} - €{part.SellingPrice.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            {/* Invoice data */}
            <div>
            <div className="mb-2">
              <label>Invoice</label>
              <p className="text-lg font-bold">
                Total: €{totalPrice.toFixed(2)}
              </p>
              <input type="hidden" name="invoiceTotal" value={totalPrice} />
            </div>
            </div>

            <div className="mb-4">
              <label>
                <input type="checkbox" name="repairable" value="false" /> No fix
              </label>
            </div>

            <button
              type="submit"
              className="bg-accentLight px-4 py-2 rounded-md"
            >
              Reparatie toevoegen
            </button>
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
              <Link
                key={repair.documentId}
                to={`/detail?documentId=${repair.documentId}`}
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
              </Link>
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
