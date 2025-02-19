// Module
import qs from 'qs';

// Core
import API from '../../networking/API.server';

// Type

export async function getRepairorders() {
    const query = qs.stringify({

    }, { 
        encodeValuesOnly: true,
    });

    try {
        const response = await API.get(`repairorders?populate=*`);
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
    // console.log("API response", response.data);
    return response.data
  } catch (error) {
    console.error("Error fetching repair order:", error);
    throw error;
  }
}