import { createProductGRNService } from "../product_GRN/service.js";

// export const createProductGRN = async (req, res) => {
//   try{

//     const { productId, GRN_NO, batchNo, totalQty, purchasePrice, sellingPrice, freeQty, expDate, amount, comment} = req.body;
//     const newProductGRN = await createProductGRNService({
//       productId, GRN_NO, batchNo, totalQty, purchasePrice, sellingPrice, freeQty, expDate, amount, comment
//     });
//     res.status(201).json(newProductGRN);
//   } catch (error) {
//     console.error("Error creating product GRN:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
