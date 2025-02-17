// Module
import qs from 'qs';

// Core
import API from '../../../networking/API.server';

// Type

export async function getAboutPage() {
    const query = qs.stringify({

    }, { 
        encodeValuesOnly: true,
    });

    try {
        const response = await API.get(`about?populate=*`);
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}