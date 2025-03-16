// Module
import qs from 'qs';

// Core
import API from '../../networking/API.server';
import { StrapiResponse } from '../strapi/type';
import { Parts } from './type';
import { data } from '@remix-run/node';

// Type

export async function getParts() {
    const query = qs.stringify({
        populate: "*",
      },
      {
        encodeValuesOnly: true,
      }
    );

    try {
        const response = await API.get(`parts?${query}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function createPart(
  partData: any,
  authToken: string
): Promise<StrapiResponse<Parts>> {
  const data = {
    data: {
    name: partData.partName,
    purchasePrice: partData.purchasePrice,
    sellingPrice: partData.sellingPrice,
    suppliers: partData.suppliers,
    quality: partData.quality,
    }
  };
  try {
    const response = await API.post( 'parts', data,{
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}