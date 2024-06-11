import { BlobServiceClient } from "@azure/storage-blob";

const account = "flexflowstorage01";
const sas = "sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2024-06-18T13:03:41Z&st=2024-06-11T05:03:41Z&spr=https&sig=MoJen5lSR2ENxdP4CZgTNIJA05IEq%2BcnaVPAdCPKi3Q%3D";

const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net/?${sas}`);

export default blobServiceClient;