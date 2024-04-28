import { createProductGRNService } from "../product_GRN/service.js";

export const createProductGRN = async (req, res) => {
  try{

    const { productId, GRN_NO } = req.body;
    const newProductGRN = await createProductGRNService({
      productId,
      GRN_NO,
    });
    res.status(201).json(newProductGRN);
  } catch (error) {
    console.error("Error creating product GRN:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
