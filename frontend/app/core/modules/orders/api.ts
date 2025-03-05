// Module
import qs from 'qs';

// Core
import API from '../../networking/API.server';
import { StrapiResponse } from '../strapi/type';
import { Orders } from './type';

// Type

export async function getOrders() {
    const query = qs.stringify({
        populate: "*",
      },
      {
        encodeValuesOnly: true,
      }
    );

    try {
        const response = await API.get(`orders?${query}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

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