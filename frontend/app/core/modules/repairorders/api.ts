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


export async function addRepairorder(
  statusRepair: string,
  issue: string,
  repairable: boolean,
  authToken: string // Add authToken as a parameter
): Promise<StrapiResponse<Repairorders>> {
  const data = {
    data: { StatusRepair: statusRepair, Issue: issue, Repairable: repairable },
  };
  
  try {
    const response = await API.post("repairorders", data, {
      headers: {
        Authorization: `Bearer ${authToken}`, // Use the provided token
      },
    });

    return response.data;
  } catch (error) {
    console.error("2: Failed add response:", error);
    throw error;
  }
}