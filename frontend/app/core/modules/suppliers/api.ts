// Module
import qs from 'qs';

// Core
import API from '../../networking/API.server';

// Type

export async function getSuppliers() {
    const query = qs.stringify({
        populate: "*",
      },
      {
        encodeValuesOnly: true,
      }
    );

    try {
        const response = await API.get(`suppliers?${query}`);
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}