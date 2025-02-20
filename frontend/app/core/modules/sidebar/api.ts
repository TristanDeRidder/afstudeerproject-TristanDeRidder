// Module
import qs from 'qs';

// Core
import API from '../../networking/API.server';

// Type

export async function getSidebars() {
    const query = qs.stringify({
        populate: "*",
      },
      {
        encodeValuesOnly: true,
      }
    );

    try {
        const response = await API.get(`sidebars?${query}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
