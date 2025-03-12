// Module
import qs from 'qs';

// Core
import API from '../../networking/API.server';

// Type
import { ContactForm } from './type';
import { StrapiResponse } from '../strapi/type';

export async function getContactForms() {
    const query = qs.stringify({
        populate: '*',
    }, { 
        encodeValuesOnly: true,
    });

    try {
        const response = await API.get(`contact-forms?${query}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export async function addContactForm(firstname: string, lastname: string, email: string, phonenumber: string | null, message: string, subject: string): Promise<StrapiResponse<ContactForm>> {
    const data = { data: { firstname, lastname, email, phonenumber: phonenumber || undefined, message, subject } };

    try {
        const response = await API.post('contact-forms', data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}