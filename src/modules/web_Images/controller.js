import { imageUpload } from "./service.js";

export const createwebImage = async (req, res) => {
  try {
    const { type } = req.body;
    if (!req.files || !type) {
      return res.status(400).json({ error: "Incomplete request body" });
    }
    await imageUpload(req.files, type);
    res.status(201).json({ message: "SUCCESS" });
  } catch (error) {
    console.error("Error adding Image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
