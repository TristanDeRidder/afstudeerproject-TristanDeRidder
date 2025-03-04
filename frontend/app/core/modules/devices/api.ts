// Module
import qs from 'qs';

// Core
import API from '../../networking/API.server';

// Type
import { Repairorders } from '../repairorders/type';

export async function getDevices() {
    const query = qs.stringify({
        populate: "*",
      },
      {
        encodeValuesOnly: true,
      }
    );

    try {
        const response = await API.get(`devices?${query}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getTopDevices() {
  try {
    // Haal alle repairorders op
    const query = qs.stringify({
      populate: {
        device: {
          populate: "Image",
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