import { useState, useMemo, useEffect } from "react";
import { useFetcher, useLoaderData } from "@remix-run/react";
import Datepicker from "../components/design/DatePicker/DataPicker";
import DashboardTitle from "../components/design/Title/DashboardTitle";

import {
  createOrder,
  getOrders,
  updateOrderStatus,
} from "../core/modules/orders/api";
import { getDevices } from "../core/modules/devices/api";
import { getParts } from "../core/modules/parts/api";
import { createCustomer } from "../core/modules/customers/api";
import { createInvoice } from "../core/modules/invoices/api";

import type { Orders } from "../core/modules/orders/type";
import { Devices } from "../core/modules/devices/type";
import { Parts } from "../core/modules/parts/type";

import { jwtCookie } from "../core/cookies/cookies.server";

import CloseIcon from "../assets/svg/X_Icon.svg";
import Edit from "../components/design/Icons/Edit";
import Cancel from "../components/design/Icons/Cancel";
import Check from "../components/design/Icons/Check";

type LoaderData = {
  orders: Orders[];
  devices: Devices[];
  parts: Parts[];
};

export async function loader() {
  try {
    const orders = await getOrders();
    const devices = await getDevices();
    const parts = await getParts();

    if (!orders.length) {
      throw new Error("No data available");
    }
    if (!devices.length) throw new Error("No devices available");
    if (!parts.length) throw new Error("No parts available");

    return { orders, devices, parts };
  } catch (error) {
    console.error("Error while fetching data:", error);
    return { orders: [] };
  }
}

export async function action({ request }: any) {
  const jwt = await jwtCookie.parse(request.headers.get("Cookie"));
  const formData = await request.formData();
  const actionType = formData.get("actionType");

  if (actionType === "addOrder") {
    // customerData
    const firstname = formData.get("firstname");
    const lastname = formData.get("lastname");
    const mail = formData.get("mail");
    const phonenumber = formData.get("phonenumber");

    // device
    const deviceId = formData.get("deviceId");

    // invoiceData
    const invoiceTotal = formData.get("invoiceTotal");
    const invoiceBool = false;
    const paid = false;
    const paymentMethod = "Bancontact";

    // orderData
    const statusRepair = formData.get("statusRepair");
    const parts = formData.getAll("parts");

    try {
      // 1. Create customer
      const customer = await createCustomer(
        {
          Firstname: firstname,
          Lastname: lastname,
          Mailaddress: mail,
          Phonenumber: phonenumber,
        },
        jwt
      );
      const customerId = customer?.data?.id;

      if (!customerId) throw new Error("Failed to get customer ID");

      // 2. Create invoice
      const invoice = await createInvoice(
        {
          TotalAmount: invoiceTotal,
          Invoice: invoiceBool,
          Paid: paid,
          invoiceMethod: paymentMethod,
        },
        jwt
      );
      const invoiceId = invoice?.data?.id;

      if (!invoiceId) throw new Error("Failed to get invoice ID");

      // 3. Create order
      const orderData = {
        statusOrder: statusRepair,
        device: deviceId,
        parts:
          parts.length > 0 ? parts.map((partId: any) => ({ id: partId })) : [],
        customer: customerId,
        invoice: invoiceId,
      };
      await createOrder(orderData, jwt);
      return { success: true };
    } catch (error) {
      console.error("Error while creating order:", error);
      throw error;
    }
  } else if (actionType === "updateOrder") {
    const orderId = formData.get("documentId");
    const orderStatus = formData.get("orderStatus");

    console.log("Updating order status:", orderId, orderStatus)
    
    const orderData = {
      orderId: orderId,
      statusOrder: orderStatus,
    };

    console.log("Order data:", orderData);

    try {
      await updateOrderStatus(orderData, jwt);

      return { success: true };
    } catch (error) {
      console.error("Error while updating order status:", error);
      throw error;
    }
  }
}

export default function Orders() {
  const fetcher = useFetcher();
  const { orders, devices, parts } = useLoaderData() as LoaderData;
  const [editingId, setEditingId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [showOverlay, setShowOverlay] = useState<boolean>(false);

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const repairDate = new Date(order.createdAt).toISOString().split("T")[0];
      return repairDate === selectedDate;
    });
  }, [orders, selectedDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    fetcher.submit(formData, { method: "post" });
    setShowOverlay(false);

    useEffect(() => {
      if (
        fetcher.data &&
        typeof fetcher.data === "object" &&
        "success" in fetcher.data &&
        fetcher.data.success
      ) {
        setSuccessMessage("Bestelling succesvol toegevoegd!");
        setTimeout(() => setSuccessMessage(null), 3000); // auto-hide after 3 seconds
      }
    }, [fetcher.data]);
  };

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

  const [selectedPartIds, setSelectedPartIds] = useState<string[]>([]);

  const totalPrice = useMemo(() => {
    return selectedPartIds.reduce((sum, partId) => {
      const part = filteredParts.find(
        (part) => part.id.toString() === partId.toString()
      );
      return sum + (part?.sellingPrice || 0);
    }, 0);
  }, [selectedPartIds, filteredParts]);

  const handlePartChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (opt) => opt.value
    );
    setSelectedPartIds(selectedOptions);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    fetcher.submit(formData, { method: "put" });
    setEditingId(null);
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-4 mt-6">
        <DashboardTitle title="Bestellingen" />
        <Datepicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          showDatePicker={showDatePicker}
          setShowDatePicker={setShowDatePicker}
        />
      </div>

      <button
        onClick={() => setShowOverlay(true)}
        className="absolute bottom-9 left-1/2 transform -translate-x-1/2 bg-dashboardPrimary py-2 px-8 rounded-full hover:bg-dashboardPrimaryHelper transition-all duration-300"
      >
        +
      </button>
      {successMessage && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-dashboardSucces text-white p-3 rounded-md shadow-lg">
          {successMessage}
        </div>
      )}

      {/* Add Order */}
      {showOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-primaryHelper p-4 rounded-md w-1/2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold mb-4">
                Nieuwe bestelling toevoegen
              </h2>
              <button onClick={() => setShowOverlay(false)}>
                <img src={CloseIcon} alt="Close" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <input type="hidden" name="actionType" value="addOrder" />

              {/* Repair data */}
              <div className="mb-2">
                <label>Status Bestelling</label>
                <select
                  name="statusRepair"
                  required
                  className="border rounded-md p-2 w-full"
                >
                  <option value="Bestellen">Bestellen</option>
                  <option value="Besteld">Besteld</option>
                  <option value="Geleverd">Geleverd</option>
                </select>
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
                    placeholder="0412345678"
                    className="border rounded-md p-2 w-full"
                    required
                  />
                </div>
              </div>

              {/* Device Data */}
              <div className="mb-2">
                <label>Toestel</label>
                <select
                  name="deviceId"
                  className="border rounded-md p-2 w-full"
                  onChange={handleDeviceChange}
                >
                  <option value="">Selecteer Toestel</option>
                  {devices.map((device) => (
                    <option key={device.id} value={device.id}>
                      {device.model} {device.modelType}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-2">
                <label>Onderdelen</label>
                <select
                  key={selectedDeviceId}
                  name="parts"
                  multiple
                  className="border rounded-md p-2 w-full"
                  onChange={handlePartChange}
                >
                  {filteredParts.map((part) => (
                    <option key={part.id} value={part.id}>
                      {part.name} - €{part.sellingPrice}
                    </option>
                  ))}
                </select>
              </div>

              {/* Invoice data */}
              <div>
                <div className="mb-2">
                  <p className="text-lg font-bold">
                    Totaal: €{totalPrice.toFixed(2)}
                  </p>
                  <input type="hidden" name="invoiceTotal" value={totalPrice} />
                </div>
              </div>

              <div className="mb-4">
                <label>
                  <input type="checkbox" name="repairable" value="false" /> No
                  fix
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

      {/* Table */}
      <div className="bg-dashboardSidebar rounded-md">
        <div className="flex justify-between font-bold px-4 py-2">
          <div className="px-4 py-2 w-1/5">Datum</div>
          <div className="px-4 py-2 w-1/5">Toestel</div>
          <div className="px-4 py-2 w-1/5">Onderdeel</div>
          <div className="px-4 py-2 w-1/5">Klant</div>
          <div className="px-4 py-2 w-1/5">Status</div>
        </div>

        <div className="px-4 py-2 rounded-md overflow-y-auto h-[35rem]">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="flex justify-between bg-accentLight mt-2 items-center"
              >
                <div className="px-4 py-2 w-1/5">
                  <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="px-4 py-2 w-1/5">
                  {order.device.map((device) => (
                    <p key={device.id}>
                      {device.model} {device.modelType || ""}
                    </p>
                  ))}
                </div>

                <div className="px-4 py-2 w-1/5">
                  {order.parts.map((part) => (
                    <p key={part.id}>{part.name}</p>
                  ))}
                </div>

                <div className="px-4 py-2 w-1/5">
                  <p>{order.customer.phonenumber}</p>
                </div>

                <div className="px-4 py-2 w-1/5 flex items-center relative">
                  {editingId === order.id ? (
                    <form
                      method="post"
                      className="flex"
                      onSubmit={handleUpdateSubmit}
                    >
                      <input
                        type="hidden"
                        name="actionType"
                        value="updateOrder"
                      />
                      <input
                        type="hidden"
                        name="documentId"
                        value={order.documentId}
                      />
                      <select
                        name="orderStatus"
                        className="border rounded px-2 py-1"
                        defaultValue={order.orderStatus}
                      >
                        <option value="Bestellen">Bestellen</option>
                        <option value="Besteld">Besteld</option>
                        <option value="Geleverd">Geleverd</option>
                      </select>
                      <button
                        type="submit"
                        className="ml-2 px-2 py-1 rounded bg-green-500 text-white"
                      >
                        <Check />
                      </button>
                      <button
                        type="button"
                        className="ml-2 px-2 py-1 rounded bg-gray-500 text-white"
                        onClick={() => setEditingId(null)}
                      >
                        <Cancel />
                      </button>
                    </form>
                  ) : (
                    <>
                      <p>{order.orderStatus}</p>
                      <button
                        className="absolute right-4"
                        onClick={() => setEditingId(order.id)}
                      >
                        <Edit />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-center">
              Geen bestellingen voor vandaag
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
