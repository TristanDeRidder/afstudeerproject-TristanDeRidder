// Module
import qs from 'qs';

// Core
import API from '../../networking/API.server';

// Type

export async function getOpeninghours() {
    const query = qs.stringify({
        populate: "*",
      },
      {
        encodeValuesOnly: true,
      }
    );

    try {
        const response = await API.get(`openinghours?${query}`);
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}