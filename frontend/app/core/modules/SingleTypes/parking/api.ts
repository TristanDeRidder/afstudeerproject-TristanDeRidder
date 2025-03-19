// Module
import qs from 'qs';

// Core
import API from '../../../networking/API.server';

// Type

export async function getParkingPage() {
    const query = qs.stringify(
      {
        populate: {
          PageContent: {
            populate: "*",
          },
        },
      },
      {
        encodeValuesOnly: true,
      }
    );

    try {
        const response = await API.get(`parking?${query}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}