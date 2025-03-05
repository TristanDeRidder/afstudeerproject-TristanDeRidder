import { useState, useMemo } from "react";
import { useLoaderData } from "@remix-run/react";
import Datepicker from "../components/design/DatePicker/DataPicker";
import DashboardTitle from "../components/design/Title/DashboardTitle";
import { getOrders } from "../core/modules/orders/api";
import { Orders } from "../core/modules/orders/type";

type LoaderData = {
  orders: Orders[];
};

export async function loader() {
  try {
    const orders = await getOrders();

    if (!orders?.data) {
      throw new Error("No data available");
    }

    return { orders: orders.data };
  } catch (error) {
    console.error("Error while fetching data:", error);
    return { orders: [] };
  }
}

export default function Invoices() {
  const { orders } = useLoaderData<LoaderData>();
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

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <DashboardTitle title="Bestellingen" />
        <Datepicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          showDatePicker={showDatePicker}
          setShowDatePicker={setShowDatePicker}
        />
      </div>

      {/* Table */}
      <div className="bg-primaryHelper rounded-md">
        <div className="flex justify-between font-bold px-4 py-2">
          <div className="w-1/4">ID</div>
          <div className="w-1/4">Onderdeel</div>
          <div className="w-1/4">Status</div>
        </div>

        <div className="px-4 py-2 rounded-md">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="flex justify-between bg-accentLight mt-2"
              >
                <div className="px-4 py-2 w-1/4">
                {/* FIXME: */}
                  {order.parts.map((part: any) => (
                    <p key={part.id}>{part.Name}</p>
                  ))}
                </div>

                <div className="px-4 py-2 w-1/4">
                <p>{order.orderStatus}</p>{" "}
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
