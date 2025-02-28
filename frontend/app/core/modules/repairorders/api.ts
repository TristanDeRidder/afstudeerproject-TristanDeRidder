// Module
import qs from 'qs';

// Core
import API from '../../networking/API.server';

// Type

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