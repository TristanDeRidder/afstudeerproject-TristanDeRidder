// Module
import qs from 'qs';

// Core
import API from '../../networking/API.server';

// Type

export async function getTechnicians() {
    const query = qs.stringify({
        populate: "*",
      },
      {
        encodeValuesOnly: true,
      }
    );

    try {
        const response = await API.get(`technicians?${query}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}