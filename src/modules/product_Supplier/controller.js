// import { createProductSupplierService } from "../product_Supplier/service.js";

// export const createProductSupplier = async (req, res) => {
//   try{

//     const { productId, supplierId } = req.body;
//     const newProductSupplier = await createProductSupplierService({
//       productId,
//       supplierId,
//     });
//     res.status(201).json(newProductSupplier);
//   } catch (error) {
//     console.error("Error creating product supplier:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
