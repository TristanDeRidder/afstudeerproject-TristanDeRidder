// Module
import qs from 'qs';

// Core
import API from '../../networking/API.server';

// Type
import { StrapiResponse } from '../strapi/type';
import { Repairorders } from './type';

export async function getRepairorders() {
    const query = qs.stringify({
        populate: "*",
      },
      {
        encodeValuesOnly: true,
      }
    );

    try {
        const response = await API.get(`repairorders?${query}`);
        return response.data;
    } catch (error) {
        console.error("repairoder error", error);
        throw error;
    }
}

export async function getRepairorderByDocumentId(documentId: string) {
  const query = qs.stringify(
    {
      populate: {
        customer: {
          populate: "*",
        },
        parts: {
          populate: "*",
        },
        device: {
          populate: {
            brand: {
              populate: "*",
            },
          },
        },
        invoice: {
          populate: "*",
        },
      },
    },
    {
      encodeValuesOnly: true,
    }
  );

  try {
    const response = await API.get(`repairorders/${documentId}?${query}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching repair order:", error);
    throw error;
  }
}


/**
 * Creates a new repair order.
 *
 * @param repairData - The data for the repair order.
 * @param repairData.statusRepair - The status of the repair.
 * @param repairData.issue - The issue description.
 * @param repairData.repairable - Indicates if the item is repairable.
 * @param repairData.device - The device being repaired.
 * @param repairData.parts - The parts required for the repair.
 * @param repairData.customer - The ID of the customer.
 * @param repairData.invoice - The ID of the invoice.
 * @param repairData.technician - The ID of the technician.
 * @param authToken - The authentication token.
 * @returns A promise that resolves to the created repair order.
 * @throws Will throw an error if the repair order creation fails.
 */
export async function createRepairorder(
  repairData: any,
  authToken: string
): Promise<StrapiResponse<Repairorders>> {
  const data = {
    data: {
      statusRepair: repairData.statusRepair,
      issue: repairData.issue,
      repairable: repairData.repairable,
      device: repairData.device,
      parts: repairData.parts,
      customer: repairData.customer, // ID of created customer
      invoice: repairData.invoice, // ID of created invoice
      technician: repairData.technician, // ID of created technician
    },
  };

  try {
    const response = await API.post("repairorders", data, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to add repair order:", error);
    throw error;
  }
}

/**
 * Updates a repair order with the provided repair data.
 *
 * @param repairData - The data to update the repair order with.
 * @param repairData.statusRepair - The status of the repair.
 * @param repairData.issue - The issue description.
 * @param repairData.repairable - Indicates if the item is repairable.
 * @param repairData.device - The device information.
 * @param repairData.parts - The parts information.
 * @param repairData.customer - The ID of the customer.
 * @param repairData.invoice - The ID of the invoice.
 * @param repairData.documentId - The ID of the repair order document.
 * @param authToken - The authentication token for authorization.
 * @returns A promise that resolves to the updated repair order data.
 * @throws Will throw an error if the update operation fails.
 */
export async function updateRepairorder(
  repairData: any,
  authToken: string
): Promise<StrapiResponse<Repairorders>> {
  const data = {
    data: {
      statusRepair: repairData.statusRepair,
      issue: repairData.issue,
      repairable: repairData.repairable,
      device: repairData.device,
      parts: repairData.parts,
      customer: repairData.customer, // ID of created customer
      invoice: repairData.invoice, // ID of created invoice
    },
  };

  try {
    console.log("Updating repair order:", JSON.stringify(data, null, 2));
    const response = await API.put(`repairorders/${repairData.documentId}`, data, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    console.log("updated repair order", response.data);

    return response.data;
  } catch (error) {
    console.error("Failed to update repair order:", error);
    throw error;
  }
}