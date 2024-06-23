import { imageUploadMultiple } from "../../blobService/utils.js";

export const imageUpload = async (files, type) => {
  try {
    const newImage = await imageUploadMultiple(files, "webimage", type);
    return newImage;
  } catch (error) {
    throw new Error('Error creating Image: ' + error.message);
  }
};