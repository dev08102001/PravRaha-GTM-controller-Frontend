import api from "./api";

/**
 * Upload image to server
 * @param {File} file
 * @returns {Promise<string>} Uploaded image URL
 */
export const uploadImage = async (file) => {
  if (!file) {
    throw new Error("No image selected");
  }

  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post("/upload/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (!response.data?.success) {
    throw new Error(response.data?.message || "Image upload failed");
  }

  return response.data.url;
};