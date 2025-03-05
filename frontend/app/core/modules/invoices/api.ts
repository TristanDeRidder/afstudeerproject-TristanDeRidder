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

export async function createInvoice(
  invoiceData: any,
  authToken: string
): Promise<StrapiResponse<Invoices>> {
  const data = {
    data: {
      TotalAmount: invoiceData.TotalAmount,
      Paymentmethod: invoiceData.Paymentmethod,
      Paid: invoiceData.Paid,
      Invoice: invoiceData.Invoice,
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
