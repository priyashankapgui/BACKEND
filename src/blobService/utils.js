import multer from "multer";
import sharp from "sharp";
import blobServiceClient from "./blobService.js";
import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

export const processForm = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const upload = multer({ dest: `${__dirname}/uploads/` });
  const dataHandler = upload.single('image');

  return (req, res, next) => {
    dataHandler(req, res, (err) => {
      if (err) {
        throw new Error(err.message);
      }
    //   console.log(req.body); // Access the body data here
    //   console.log(req.file); // Access the file data here
      next();
    });
  };
};

export const imageUploadwithCompression = async (file, containerName, fileName) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    try {
        const tempPath = file.path;
        const targetPath = path.join(
            __dirname,
            "uploads/" + file.originalname
        );
        await sharp(tempPath)
          .toFormat("png")
          .resize(500) // Resize to 500px width
          .webp({ quality: 70, force: true }) // Compress the image to 70% quality
          .toFile(targetPath);
        // Move the file to the target path

        // Upload the image to Azure Blob Storage
        const containerClient = blobServiceClient.getContainerClient(containerName);
        //creates blob with given name
        const blockBlobClient = containerClient.getBlockBlobClient(`${fileName}.png`);

        await blockBlobClient.uploadFile(targetPath);

        // Delete the temporary files
        fs.unlinkSync(tempPath);
        fs.unlinkSync(targetPath);
        return { message: "Image uploaded successfully"};
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
};