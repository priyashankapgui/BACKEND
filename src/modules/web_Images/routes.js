import express from "express";
import { createwebImage } from "../web_Images/controller.js";
import { processMultipleForm } from "../../blobService/utils.js";

const webImagesrouter = express.Router();

webImagesrouter.post("/webIamges", processMultipleForm(), createwebImage);

export default webImagesrouter;