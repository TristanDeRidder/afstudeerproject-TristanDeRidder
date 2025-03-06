// Module
import qs from 'qs';

// Core
import API from '../../networking/API.server';
import { StrapiResponse } from '../strapi/type';
import { Customers } from './type';

// Type

export async function getCustomers() {
    const query = qs.stringify({
        populate: "*",
      },
      {
        encodeValuesOnly: true,
      }
    );

    try {
        const response = await API.get(`customers?${query}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function createCustomer(
  customerData: any,
  authToken: string
):Promise<StrapiResponse<Customers>> {
  const data = {
    data: {
      firstname: customerData.Firstname,
      lastname: customerData.Lastname,
      mailadress: customerData.Mailaddress,
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

export async function updateCustomer(
  customerData: any,
  authToken: string
):Promise<StrapiResponse<Customers>> {
  const data = {
    data: {
      firstname: customerData.Firstname,
      lastname: customerData.Lastname,
      mailadress: customerData.Mailaddress,
      phonenumber: customerData.Phonenumber,
    },
  };

  try {
    const response = await API.put(`customers/${customerData.id}`, data, {
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