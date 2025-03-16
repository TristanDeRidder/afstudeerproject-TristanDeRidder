// Module
import qs from 'qs';

// Core
import API from '../../networking/API.server';
import { StrapiResponse } from '../strapi/type';
import { Invoices } from './type';

// Type

export async function getInvoices() {
    const query = qs.stringify({
        populate: "*",
      },
      {
        encodeValuesOnly: true,
      }
    );

    try {
        const response = await API.get(`invoices?${query}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
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
      paymentmethod: invoiceData.Paymentmethod,
      paid: invoiceData.Paid,
      invoice: invoiceData.Invoice,
    },
  };

  try {
    console.log("invoice data", data);
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
