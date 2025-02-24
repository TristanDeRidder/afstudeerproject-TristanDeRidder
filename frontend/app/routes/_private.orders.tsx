import { getOrders } from "../core/modules/orders/api";
import type { Orders } from "../core/modules/orders/type";
import { useLoaderData } from "@remix-run/react";


type LoaderData = {
  orders: Orders[];
}

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
};

export default function Orders() {
  const { orders } = useLoaderData<LoaderData>();

  return (
    <div>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            <h2>{order.id}</h2>
            <p>{order.OrderStatus}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
