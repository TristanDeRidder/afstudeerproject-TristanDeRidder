// Module
import qs from 'qs';

// Core
import API from '../../../networking/API.server';

// Type

export async function getPaymentPage() {
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
        const response = await API.get(`payment?${query}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}