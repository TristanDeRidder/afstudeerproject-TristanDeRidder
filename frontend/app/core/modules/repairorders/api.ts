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
        console.error(error);
        throw error;
    }
}

export async function getRepairorderByDocumentId(documentId: string) {
  try {
    const response = await API.get(
      `repairorders/${documentId}?populate=*`
    );
    return response.data
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
      StatusRepair: repairData.statusRepair,
      Issue: repairData.issue,
      Repairable: repairData.repairable,
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