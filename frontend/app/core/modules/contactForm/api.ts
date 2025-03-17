// Module
import qs from 'qs';

// Core
import API from '../../networking/API.server';

// Type
import { ContactForm } from './type';
import { StrapiResponse } from '../strapi/type';


export async function getContactForms(pageSize = 100) {
    let page = 1;
    let totalPages = 1;
    let allContactForms: ContactForm[] = [];

    while (page <= totalPages) {
        const query = qs.stringify({
            populate: '*',
            pagination: {
                page,
                pageSize,
            },
        }, {
            encodeValuesOnly: true,
        });

        try {
            const response = await API.get(`contact-forms?${query}`);
            const { data, meta } = response.data;

            allContactForms = [...allContactForms, ...data];
            totalPages = meta.pagination.pageCount;
            page++;
        } catch (error) {
            console.error('contact-form error', error);
            throw error;
        }
    }
    
    return allContactForms;
}

/**
 * Adds a new contact form entry.
 *
 * @param {string} firstname - The first name of the contact.
 * @param {string} lastname - The last name of the contact.
 * @param {string} email - The email address of the contact.
 * @param {string | null} phonenumber - The phone number of the contact. Can be null.
 * @param {string} message - The message from the contact.
 * @param {string} subject - The subject of the contact form.
 * @returns {Promise<StrapiResponse<ContactForm>>} - A promise that resolves to the response from the Strapi API.
 * @throws Will throw an error if the API request fails.
 */
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