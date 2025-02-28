// Module
import qs from 'qs';

// Core
import API from '../../networking/API.server';

// Type

export async function getCustomers() {
    const query = qs.stringify({
        populate: "*",
      },
      {
        encodeValuesOnly: true,
      }
    );

    try {
        const response = await API.get(`customers?${query}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}