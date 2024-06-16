import { BlobServiceClient } from "@azure/storage-blob";

const account = "flexflowstorage01";
const sas = "sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2024-06-18T13:03:41Z&st=2024-06-11T05:03:41Z&spr=https&sig=MoJen5lSR2ENxdP4CZgTNIJA05IEq%2BcnaVPAdCPKi3Q%3D";

const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net/?${sas}`);

export const uploadToBlob = async (containerName, fileName, file) => {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    // Create the container if it does not exist
    const createContainerResponse = await containerClient.createIfNotExists();
    //creates blob with given name
    const blockBlobClient = containerClient.getBlockBlobClient(
      `${fileName}.png`
    );
    await blockBlobClient.uploadFile(file);
};

export default blobServiceClient;