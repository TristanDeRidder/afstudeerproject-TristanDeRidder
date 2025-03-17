// Module
import qs from 'qs';

// Core
import API from '../../networking/API.server';
import { StrapiResponse } from '../strapi/type';
import { Orders } from './type';

// Type

export async function getOrders(pageSize = 100) {
    let page = 1;
    let totalPages = 1;
    let allOrders: Orders[] = [];

    while (page <= totalPages) {
        const query = qs.stringify(
            {
                populate: "*",
                pagination: {
                    page,
                    pageSize,
                },
            },
            {
                encodeValuesOnly: true,
            }
        );

        try {
            const response = await API.get(`orders?${query}`);
            const { data, meta } = response.data;

            allOrders = [...allOrders, ...data];
            totalPages = meta.pagination.pageCount;
            page++;
        } catch (error) {
            console.error("Error fetching orders:", error);
            throw error;
        }
    }

    return allOrders;
}

/**
 * Creates a new order in the system.
 *
 * @param orderData - The data of the order to be created.
 * @param orderData.statusOrder - The status of the order.
 * @param orderData.device - The device associated with the order.
 * @param orderData.parts - The parts associated with the order.
 * @param orderData.customer - The ID of the customer associated with the order.
 * @param orderData.invoice - The ID of the invoice associated with the order.
 * @param authToken - The authentication token for the API request.
 * @returns A promise that resolves to the created order's response.
 * @throws Will throw an error if the order creation fails.
 */
export async function createOrder(
  orderData: any,
  authToken: string
): Promise<StrapiResponse<Orders>> {
  const data = {
    data: {
      orderStatus: orderData.statusOrder,
      device: orderData.device,
      parts: orderData.parts,
      customer: orderData.customer, // ID of created customer
      invoice: orderData.invoice, // ID of created invoice
    },
  };

  try {
    console.log("Submitting order:", JSON.stringify(data, null, 2));
    const response = await API.post("orders", data, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error while creating order:", error);
    throw error;
  }
}

export async function updateOrderStatus(
  orderData: any,
  authToken: string
): Promise<StrapiResponse<Orders>> {
  const data = {
    data: {
      orderStatus: orderData.statusOrder,
    },
  };

  try {
    console.log("Updating order status:", JSON.stringify(data, null, 2));
    const response = await API.put(`orders/${orderData.orderId}`, data, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    console.log("Updated order status:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}