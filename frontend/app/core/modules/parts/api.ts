// Module
import qs from "qs";

// Core
import API from "../../networking/API.server";

// Type
import { StrapiResponse } from "../strapi/type";
import { Parts } from "./type";

export async function getParts(pageSize = 100) {
  let page = 1;
  let totalPages = 1;
  let allParts: Parts[] = [];

  while (page <= totalPages) {
    const query = qs.stringify(
      {
        populate: "*",
        pagination: {
          page,
          pageSize,
        },
      },
      {
        encodeValuesOnly: true,
      }
    );

    try {
      const response = await API.get(`parts?${query}`);
      const { data, meta } = response.data;

      allParts = [...allParts, ...data];
      totalPages = meta.pagination.pageCount;
      page++;
    } catch (error) {
      console.error("Error fetching parts",error);
      throw error;
    }
  }

  return allParts;
}

/**
 * Creates a new part in the system.
 *
 * @param partData - The data of the part to be created.
 * @param partData.partName - The name of the part.
 * @param partData.purchasePrice - The purchase price of the part.
 * @param partData.sellingPrice - The selling price of the part.
 * @param partData.suppliers - The suppliers of the part.
 * @param partData.quality - The quality of the part.
 * @param authToken - The authentication token for the API request.
 * @returns A promise that resolves to the response from the Strapi API containing the created part.
 * @throws Will throw an error if the API request fails.
 */
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
    },
  };
  try {
    const response = await API.post("parts", data, {
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

export async function updatePart(
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
    },
  };
  try {
    console.log("Update part", partData);
    const response = await API.put(`parts/${partData.id}`, data, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    console.log("Update part response", response);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
