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
    },
  };

  try {
    console.log("Submitting repair order:", JSON.stringify(data, null, 2));
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