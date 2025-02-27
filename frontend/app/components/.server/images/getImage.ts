import API from "../../../core/networking/API.server";

export async function getImageById({ id }: { id: string }) {
  try {
    const response = await API.get(`upload/files/${id}`);
    
    return response.data;
  } catch (error) {
    console.error("Error fetching image:", error);
    throw error;
  }
}
