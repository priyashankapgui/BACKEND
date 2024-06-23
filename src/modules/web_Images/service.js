
import { imageUploadMultiple } from "../../blobService/utils.js";



export const imageUpload = async (req, res) => {
   
    try {
        const newImage = await imageUploadMultiple(req.files, "webimage", "carosel");
        
        return newImage;
    } catch (error) {
        throw new Error('Error creating Image: ' + error.message);
    }
};

