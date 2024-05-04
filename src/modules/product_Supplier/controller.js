import { createProductSupplierService, getProductDetailsByProductNameService } from "../product_Supplier/service.js";

export const createProductSupplier = async (req, res) => {
  try{

    const { productId, supplierId } = req.body;
    const newProductSupplier = await createProductSupplierService({
      productId,
      supplierId,
    });
    res.status(201).json(newProductSupplier);
  } catch (error) {
    console.error("Error creating product supplier:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getProductDetailsByProductNameController = async (req, res) => {
  const { productName } = req.params;

  try {
    const productDetails = await getProductDetailsByProductNameService(productName);
    if (!productDetails) {
      res.status(404).json({ error: "No product details found for the given product name" });
      return;
    }
    res.status(200).json(productDetails);
  } catch (error) {
    console.error("Error fetching product details by product name:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};