// Module
import qs from 'qs';

// Core
import API from '../../networking/API.server';

// Type

/**
 * Fetches the list of brands from the API.
 *
 * Constructs a query string to populate all fields and sends a GET request
 * to the `brands` endpoint. If the request is successful, it returns the
 * data from the response. If an error occurs, it logs the error to the console
 * and rethrows the error.
 *
 * @returns {Promise<any>} A promise that resolves to the data from the response.
 * @throws Will throw an error if the API request fails.
 */
export async function getBrands() {
    const query = qs.stringify({
        populate: '*',
    }, { 
        encodeValuesOnly: true,
    });

    try {
        const response = await API.get(`brands?${query}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}