import { BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob";

const account = process.env.AZURE_STORAGE_ACCOUNT;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;

const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net`, sharedKeyCredential);

export const uploadToBlob = async (containerName, fileName, file) => {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    // Create the container if it does not exist
    const createContainerResponse = await containerClient.createIfNotExists({access: "blob"});
    //creates blob with given name
    const blockBlobClient = containerClient.getBlockBlobClient(
      `${fileName}`
    );
    await blockBlobClient.uploadFile(file);
};

export default blobServiceClient;