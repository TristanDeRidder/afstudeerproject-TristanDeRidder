// Module
import qs from 'qs';

// Core
import API from '../../networking/API.server';

// Type

export async function getInvoices() {
    const query = qs.stringify({
        populate: "*",
      },
      {
        encodeValuesOnly: true,
      }
    );

    try {
        const response = await API.get(`invoices?${query}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}