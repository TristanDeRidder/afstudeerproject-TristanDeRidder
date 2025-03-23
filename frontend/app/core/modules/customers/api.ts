// Module
import qs from 'qs';

// Core
import API from '../../networking/API.server';
import { StrapiResponse } from '../strapi/type';
import { Customers } from './type';

// Type

export async function getCustomers(pageSize = 100) {
    let page = 1;
    let totalPages = 1;
    let allCustomers: Customers[] = [];

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
            const response = await API.get(`customers?${query}`);
            const { data, meta } = response.data;

            allCustomers = [...allCustomers, ...data];
            totalPages = meta.pagination.pageCount;
            page++;
        } catch (error) {
            console.error('customer error', error);
            throw error;
        }
    }
    
    return allCustomers;
}

/**
 * Creates a new customer in the system.
 *
 * @param customerData - The data of the customer to be created.
 * @param customerData.Firstname - The first name of the customer.
 * @param customerData.Lastname - The last name of the customer.
 * @param customerData.Mailaddress - The email address of the customer.
 * @param customerData.Phonenumber - The phone number of the customer.
 * @param authToken - The authentication token for the API request.
 * @returns A promise that resolves to the response data from the Strapi API.
 * @throws Will throw an error if the API request fails.
 */
export async function createCustomer(
  customerData: any,
  authToken: string
):Promise<StrapiResponse<Customers>> {
  const data = {
    data: {
      firstname: customerData.Firstname || null,
      lastname: customerData.Lastname || null,
      mailadress: customerData.Mailaddress || null,
      phonenumber: customerData.Phonenumber,
    },
  };

  try {
    const response = await API.post("customers", data, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    console.log("customer data", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * Updates a customer record in the database.
 *
 * @param customerData - An object containing the customer's updated information.
 * @param customerData.Firstname - The customer's first name.
 * @param customerData.Lastname - The customer's last name.
 * @param customerData.Mailaddress - The customer's email address.
 * @param customerData.Phonenumber - The customer's phone number.
 * @param customerData.documentId - The unique identifier of the customer document.
 * @param authToken - The authentication token for API access.
 * @returns A promise that resolves to the updated customer data.
 * @throws Will throw an error if the update operation fails.
 */
export async function updateCustomer(
  customerData: any,
  authToken: string
):Promise<StrapiResponse<Customers>> {
  const data = {
    data: {
      firstname: customerData.Firstname || null,
      lastname: customerData.Lastname || null,
      mailadress: customerData.Mailaddress || null,
      phonenumber: customerData.Phonenumber,
    },
  };

  try {
    console.log("customer data", data);
    const response = await API.put(`customers/${customerData.documentId}`, data, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    console.log("customer data", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}