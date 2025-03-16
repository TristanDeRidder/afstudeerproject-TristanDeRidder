import API from "../../../core/networking/API.server";


/**
 * Fetches an image by its ID.
 *
 * @param {Object} params - The parameters for fetching the image.
 * @param {string} params.id - The ID of the image to fetch.
 * @returns {Promise<any>} The image data.
 * @throws Will throw an error if the image cannot be fetched.
 */
export async function getImageById({ id }: { id: string }) {
  try {
    const response = await API.get(`upload/files/${id}`);
    
    return response.data;
  } catch (error) {
    console.error("Error fetching image:", error);
    throw error;
  }
}
