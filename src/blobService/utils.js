import multer from "multer";
import sharp from "sharp";
import blobServiceClient from "./blobService.js";
import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { uploadToBlob } from "./blobService.js";

/**
Example usage of processForm() and imageUploadTest() in routes.js
  EmployeeRouter.post("/imageupload", processMultipleForm(), imageUploadTest);

Example usage of imageUpload in a service.js
  export const imageUploadTest = async (req, res) => {
    try {
      const response = await imageUploadMultiple(req.files, "cms-product", "product");
      res.status(200).json({ message: response.message, fileNames: response.fileNames });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
*/

/**
 * Processes the form data for single image upload.
 * Once processed, the images is stored in the `uploads` folder.
 * File can be accessed using `req.file`.
 * Text fields can be accessed using `req.body`.
 * @returns {Function} Middleware function to handle the form data.
 */
export const processForm = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const upload = multer({ dest: `${__dirname}/uploads/` });
  const dataHandler = upload.single("image");

  return (req, res, next) => {
    dataHandler(req, res, (err) => {
      if (err) {
        throw new Error(err.message);
      }
      next();
    });
  };
};

/**
 * Processes the form data for multiple image upload.
 * Once processed, the images are stored in the `uploads` folder.
 * Files can be accessed using `req.files`.
 * Text fields can be accessed using `req.body`.
 * @returns {Function} Middleware function to handle the form data.
 */
export const processMultipleForm = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const upload = multer({ dest: `${__dirname}/uploads/` });
  const dataHandler = upload.array("images", 10);

  return (req, res, next) => {
    dataHandler(req, res, (err) => {
      if (err) {
        throw new Error(err.message);
      }
      next();
    });
  };
};

/**
 * Uploads an image to Azure Blob Storage without compression.
 * @param {MulterFile} file - The file object to upload with extension.
 * @param {string} containerName - The name of the container in Azure Blob Storage.
 * @param {string} fileName - The name of the file to be uploaded.
 * @returns {Promise<Object>} A promise that resolves to an object with a success message.
 * @throws {Error} If there is an error during the upload process.
 */
export const imageUpload = async (file, containerName, fileName) => {
  try {
    const tempPath = file.path;
    await uploadToBlob(containerName, fileName, tempPath);
    fs.unlink(tempPath, (err) => {
      if (err) {
        console.error(`Error deleting file ${tempPath}: `, err);
      }
    });
    console.log("Image uploaded successfully");
    return { message: "Image uploaded successfully" };
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

/**
 * Uploads an image to Azure Blob Storage with compression.
 * @param {MulterFile} file - The file object to upload.
 * @param {string} containerName - The name of the container in Azure Blob Storage.
 * @param {string} imageFormat - The format of the compressed image (default: 'png').
 * @param {string} fileName - The name of the file to be uploaded.
 * @param {number} resizeWidth - The width to resize the image to in pixels (default: 200).
 * @param {number} quality - The quality of the compressed image. 0-100, 0 being the lowest (default: 70).
 * @returns {Promise<Object>} A promise that resolves to an object with a success message.
 * @throws {Error} If there is an error during the upload process.
 */
export const imageUploadwithCompression = async (
  file,
  containerName,
  fileName,
  imageFormat = "png",
  resizeWidth = 200,
  quality = 70
) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  try {
    const tempPath = file.path;
    const targetPath = path.join(
      __dirname,
      "uploads/" + "compressed-" + file.originalname
    );
    sharp.cache(false);
    await sharp(tempPath)
      .resize(resizeWidth)
      .png({ quality: quality, force: true })
      .toFormat(imageFormat) // Compress the image to 70% quality
      .toFile(targetPath);

    await uploadToBlob(containerName, `${fileName}.${imageFormat}`, targetPath);

    fs.unlink(tempPath, (err) => {
      if (err) {
        console.error(`Error deleting file ${tempPath}: `, err);
      }
    });
    // Delete the temporary files
    fs.unlink(targetPath, (err) => {
      if (err) {
        console.error(`Error deleting file ${targetPath}: `, err);
      }
    });
    console.log("Image uploaded successfully");
    return { message: "Image uploaded successfully" };
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

/**
 * Uploads multiple images to Azure Blob Storage.
 * @param {MulterFile[]} files - The array of files to upload.
 * @param {string} containerName - The name of the container in Azure Blob Storage.
 * @param {string} commonFileName - The common name for the uploaded files.
 * @param {boolean} [shouldCompress=false] - Indicates whether to compress the images. Default is false.
 * @param {string} [imageFormat='png'] - The format of the compressed images. Default is 'png'.
 * @param {number} [resizeWidth=200] - The width to resize the images (if compress is true).
 * @param {number} [quality=70] - The quality of the compressed images (if compress is true).
 * @returns {Promise} A promise that resolves when the images are uploaded successfully.
 * @throws {Error} If there is an error during the upload process.
 */
export const imageUploadMultiple = async (
  files,
  containerName,
  commonFileName,
  shouldCompress = false,
  imageFormat = "png",
  resizeWidth = 200,
  quality = 70
) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const fileNames = [];
  console.log(files);
  try {
    for (let i = 0; i < files.length; i++) {
      let finalPath = files[i].path;
      if (shouldCompress) {
        const targetPath = path.join(
          __dirname,
          "uploads/" + "compressed-" + files[i].originalname
        );
        sharp.cache(false);
        await sharp(files[i].path)
          .resize(resizeWidth)
          .png({ quality: quality, force: true })
          .toFormat(imageFormat) 
          .toFile(targetPath);
        finalPath = targetPath;
      }

      await uploadToBlob(containerName, `${commonFileName}(${i}).${imageFormat}`, finalPath);
      fileNames.push(`${commonFileName}(${i})`);

      fs.unlink(files[i].path, (err) => {
        if (err) {
          console.error(`Error deleting file ${targetPath}: `, err);
        }
      });
      if (shouldCompress) {
        fs.unlink(finalPath, (err) => {
          if (err) {
            console.error(`Error deleting file ${targetPath}: `, err);
          }
        });
      }
    }
    console.log("Images uploaded successfully");
    return { message: "Images uploaded successfully", fileNames: fileNames};
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};
