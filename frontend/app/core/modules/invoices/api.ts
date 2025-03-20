// Module
import qs from 'qs';

// Core
import API from '../../networking/API.server';
import { StrapiResponse } from '../strapi/type';
import { Invoices } from './type';

// Type

export async function getInvoices(pageSize = 100) {
    let page = 1;
    let totalPages = 1;
    let allInvoices: Invoices[] = [];

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
            const response = await API.get(`invoices?${query}`);
            const { data, meta } = response.data;

            allInvoices = [...allInvoices, ...data];
            totalPages = meta.pagination.pageCount;
            page++;
        } catch (error) {
            console.error('invoice error', error);
            throw error;
        }
    }
    
    return allInvoices;
}

/**
 * Creates a new invoice using the provided invoice data and authorization token.
 *
 * @param invoiceData - The data for the invoice to be created.
 * @param authToken - The authorization token for the API request.
 * @returns A promise that resolves to the response data containing the created invoice.
 * @throws Will throw an error if the API request fails.
 */
export async function createInvoice(
  invoiceData: any,
  authToken: string
): Promise<StrapiResponse<Invoices>> {
  const data = {
    data: {
      totalAmount: invoiceData.TotalAmount,
      paymentmethod: "Bancontact",
      paid: invoiceData.Paid,
      invoice: invoiceData.Invoice,
    },
  };

  try {
    const response = await API.post('invoices', data, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
