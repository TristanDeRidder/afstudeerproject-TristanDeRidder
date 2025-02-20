// Module
import qs from 'qs';

// Core
import API from '../../networking/API.server';

// Type

export async function getBrands() {
    const query = qs.stringify({
        populate: '*',
    }, { 
        encodeValuesOnly: true,
    });

    try {
        const response = await API.get(`brands?${query}`);
        console.log(response.data.data)
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}