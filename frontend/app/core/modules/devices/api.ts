// Module
import qs from 'qs';

// Core
import API from '../../networking/API.server';

// Type
import { Repairorders } from '../repairorders/type';
import { StrapiResponse } from '../strapi/type';
import { Devices } from './type';

/**
 * Fetches a list of devices from the API with pagination.
 *
 * @param {number} [pageSize=100] - The number of devices to fetch per page.
 * @returns {Promise<Devices[]>} A promise that resolves to an array of devices.
 * @throws Will throw an error if the API request fails.
 */
export async function getDevices(pageSize = 100) {
  let page = 1;
  let totalPages = 1;
  let allDevices: Devices[] = [];

  /**
   * Loop through all pages of devices until we have fetched all devices.
   * The API returns a maximum of 100 devices per page.
  */
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
      const response = await API.get(`devices?${query}`);
      const { data, meta } = response.data;

      allDevices = [...allDevices, ...data];
      totalPages = meta.pagination.pageCount;
      page++;
    } catch (error) {
      console.error("Error fetching devices:", error);
      throw error;
    }
  }

  return allDevices;
}

/**
 * Fetches a single device from the API by its document ID.
 *
 * @param {string} documentId - The document ID of the device to fetch.
 * @returns {Promise<Devices>} A promise that resolves to the device.
 * @throws Will throw an error if the API request fails.
 */
export async function getDeviceById(documentId: string) {
  const query = qs.stringify({
    populate: "*"
  });
  try {
    const response = await API.get(`devices/${documentId}?${query}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching device:", error);
    throw error;
  }
}

export async function getTopDevices() {
  try {
    // Haal alle repairorders op
    const query = qs.stringify({
      populate: {
        device: {
          populate: "image",
        },
        parts: true,
        customer: true,
      },
    });
    const response = await API.get(`/repairorders?${query}`);
    const repairOrders = response.data;

     
    const deviceCounts: { [key: string]: { count: number, device: any } } = {};

    // Tel hoe vaak elk toestel voorkomt
    repairOrders.data.forEach((repairOrder: Repairorders) => {
      if (!repairOrder.device) return; // Ensure the device exists

      // Here we can use the device object directly
      const device = repairOrder.device;

      if (!deviceCounts[device.documentId]) {
        deviceCounts[device.documentId] = {
          count: 0,
          device: device,
        };
      }

      deviceCounts[device.documentId].count++;
    });

    // Sorteer de toestellen op aantal reparaties en pak de top 10
    const sortedDevices = Object.values(deviceCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map((item) => item.device);

    return sortedDevices;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createDevice(
  deviceData: any,
  authToken: string
): Promise<StrapiResponse<Devices>> {
  const data = {
    data: {
      type: deviceData.type,
      brand: deviceData.brand,
      model: deviceData.model,
      modelType: deviceData.modelType || null,
      modelNumber: deviceData.modelNumber,
      image: deviceData.image,
    },
  };

  try {
    const response = await API.post(`devices`, data, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    console.log("Part response", response);
    return response.data;
  } catch (error) {
    console.error("Error creating device:", error);
    throw error;
  }
}