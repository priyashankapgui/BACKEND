import { Op, fn, col } from 'sequelize';
import Sequelize from 'sequelize';
import sequelize from '../../../config/database.js';
import { to, TE } from "../../helper.js";
import productGRN from "../../modules/product_GRN/product_GRN.js";
import grn from "../../modules/GRN/grn.js";
import productBatchSum from '../productBatchSum/productBatchSum.js';
import products from '../product/product.js';
import branches from '../branch/branch.js';
import { mapBranchNameToId } from '../branch/service.js';
import categories from '../category/category.js';


// Add data to the productBatchSum table using hooks in productGRN table
export const updateProductBatchSum = async (productId, batchNo, branchId) => {
  try {
    const grnNumbers = await grn.findAll({
      attributes: ['GRN_NO'],
      where: { branchId: branchId }
    });

    if (!grnNumbers || grnNumbers.length === 0) {
      return;
    }

    const grnNos = grnNumbers.map(grn => grn.GRN_NO);

    const result = await productGRN.findOne({
      attributes: [
        'productId',
        'batchNo',
        'expDate',
        'sellingPrice',
        [fn('SUM', col('availableQty')), 'totalAvailableQty']
      ],
      where: {
        productId: productId,
        batchNo: batchNo,
        GRN_NO: { [Op.in]: grnNos },
        expDate: { [Op.gte]: new Date() },
        sellingPrice: { [Op.not]: null }
      },
      group: ['productId', 'batchNo', 'expDate', 'sellingPrice']
    });

    if (result) {
      const { totalAvailableQty, expDate, sellingPrice } = result.dataValues;

      const product = await products.findOne({
        where: { productId: productId },
        attributes: ['productName', 'barcode']
      });

      if (!product) {
        throw new Error(`Product with productId ${productId} not found`);
      }

      const productName = product.productName;
      const barcode = product.barcode;

      const branch = await branches.findOne({
        where: { branchId: branchId },
        attributes: ['branchName']
      });

      if (!branch) {
        throw new Error(`Branch with branchId ${branchId} not found`);
      }

      const branchName = branch.branchName;

      await productBatchSum.upsert({
        productId: productId,
        batchNo: batchNo,
        barcode: barcode,
        branchId: branchId,
        expDate: expDate,
        sellingPrice: sellingPrice,
        totalAvailableQty: totalAvailableQty,
        productName: productName,
        branchName: branchName
      });

      console.log(`Updated ProductBatchSum for productId ${productId}, batchNo ${batchNo}, branchId ${branchId} to ${totalAvailableQty}`);
    } else {
      await productBatchSum.destroy({
        where: {
          productId: productId,
          batchNo: batchNo,
          branchId: branchId,
        }
      });

      console.log(`Removed ProductBatchSum entry for productId ${productId}, batchNo ${batchNo}, branchId ${branchId}`);
    }
  } catch (error) {
    console.error("Error updating ProductBatchSum:", error);
    throw error;
  }
};

// Function to get active stock (controller file is in the product controller)
export const getProductTotalQuantity = async (branchName, productId) => {

  const [branchErr, branch] = await to(
    branches.findOne({ where: { branchName }, attributes: ['branchId', 'branchName'] })
  );
  if (branchErr) TE(branchErr);
  if (!branch) TE("Branch not found");

  const branchId = branch.branchId;

  const [productErr, productDetails] = await to(
    products.findOne({ where: { productId } })
  );
  if (productErr) TE(productErr);
  if (!productDetails) TE("Product not found");

  const [categoryErr, category] = await to(
    categories.findOne({ where: { categoryId: productDetails.categoryId }, attributes: ['categoryName'] })
  );
  if (categoryErr) TE(categoryErr);
  if (!category) TE("Category not found");

  const currentDate = new Date();

  const [qtyErr, totalAvailableQty] = await to(
    productBatchSum.sum('totalAvailableQty', {
       where: { 
        productId, 
        branchId,
        expDate: {
          [Op.gt]: currentDate, 
        }
      } })
  );
  if (qtyErr) TE(qtyErr);

  return {
    productId: productDetails.productId,
    productName: productDetails.productName,
    branchName: branch.branchName,
    categoryName: category.categoryName,
    qty: totalAvailableQty,
  };
};

// function to retrieve batch details by productName and branchNo for check price 
export const getBatchDetailsByProductName = async (productId, branchName) => {
  try {
    const [branchIdErr, branchId] = await to(mapBranchNameToId(branchName));
    if (branchIdErr) TE(branchIdErr);
    if (!branchId) TE(new Error("Branch not found"));

    const [branchErr, branch] = await to(branches.findOne({ where: { branchId } }));
    if (branchErr) TE(branchErr);
    if (!branch) TE(new Error("Branch not found"));

    const currentDate = new Date();

    const [productBatchSumDataErr, productBatchSumData] = await to(
      productBatchSum.findAll({ 
        where: { 
          productId, 
          branchId,  
          expDate: {
        [Op.gt]: currentDate, 
      } } })
    );
    if (productBatchSumDataErr) TE(productBatchSumDataErr);

    const batchDetails = productBatchSumData.map((productBatchSumData) => ({
      branchName: branch.branchName,
      batchNo: productBatchSumData.batchNo,
      expDate: productBatchSumData.expDate,
      availableQty: productBatchSumData.totalAvailableQty,
      sellingPrice: productBatchSumData.sellingPrice,
      discount: productBatchSumData.discount,
    }));

    return batchDetails;
  } catch (error) {
    console.error("Error retrieving batch details:", error);
    throw new Error("Error retrieving batch details: " + error.message);
  }
};

// Function to adjust the stock quantity
export const adjustProductGRNQuantity = async (productName, branchName, batchNo, newQuantity) => {
  try {
    const [branchErr, branch] = await to(branches.findOne({ where: { branchName: branchName } }));
    if (branchErr) TE(branchErr);
    if (!branch) TE(new Error('Branch not found.'));
    const branchId = branch.branchId;
    console.log(`Found branchId: ${branchId} for branchName: ${branchName}`);

    const [productErr, product] = await to(products.findOne({ where: { productName: productName } }));
    if (productErr) TE(productErr);
    if (!product) TE(new Error('Product not found.'));
    const productId = product.productId;
    console.log(`Found productId: ${productId} for productName: ${productName}`);

    // Update the totalAvailableQty with the newQuantity
    const [updateErr] = await to(
      productBatchSum.update(
        { totalAvailableQty: newQuantity },
        {
          where: {
            productId: productId,
            branchId: branchId,
            batchNo: batchNo
          }
        }
      )
    );
    if (updateErr) TE(updateErr);

    return true;
  } catch (error) {
    console.error("Error adjusting Product Batch Sum quantity:", error);
    throw error;
  }
};


// Function to update totalAvailableQty when stock transfer IN
export const updateProductBatchSumQty = async (productId, batchNo, supplyingBranch, transferQty) => {
  const [branchErr, branch] = await to(branches.findOne({ where: { branchName: supplyingBranch } }));
  if (branchErr) TE(branchErr);
  if (!branch) TE(new Error('Branch not found.'));
  const branchId = branch.branchId;

  try {
    const productBatchSumEntry = await productBatchSum.findOne({
      where: {
        productId,
        batchNo,
        branchId,
      },
    });

    if (productBatchSumEntry) {
      if (productBatchSumEntry.totalAvailableQty < transferQty) {
        throw new Error(`Insufficient quantity available for transfer. Available: ${productBatchSumEntry.totalAvailableQty}, Requested: ${transferQty}`);
      }
      productBatchSumEntry.totalAvailableQty -= transferQty;
      await productBatchSumEntry.save();
    } else {
      throw new Error(`Product batch sum entry not found for productId: ${productId}, batchNo: ${batchNo}, branchId: ${branchId}`);
    }
  } catch (error) {
    console.error('Error updating product batch sum:', error);
    throw error;
  }
};




// Function to update or create productBatchSum entry when saving stock transfer OUT
export const updateOrAddProductBatchSum = async (requestBranch, productDetails) => {
  const updatedProductBatchSums = [];

  try {
    for (const product of productDetails) {
      const { productId, batchNo, transferQty, unitPrice, expDate } = product;

      const [branchErr, branch] = await to(branches.findOne({ where: { branchName: requestBranch } }));
      if (branchErr) TE(branchErr);
      if (!branch) TE(new Error('Requesting branch not found.'));
      const branchId = branch.branchId;

      let productBatchSumEntry = await productBatchSum.findOne({
        where: {
          productId,
          batchNo,
          branchId,
        },
      });

      // Update existing productBatchSum entry or create new one
      if (productBatchSumEntry) {
        productBatchSumEntry.totalAvailableQty += transferQty;
        await productBatchSumEntry.save();
      } else {

        const product = await products.findOne({
          where: { productId: productId },
          attributes: ['productName']
        });

        if (!product) {
          throw new Error(`Product with productId ${productId} not found`);
        }

        const productName = product.productName;

        productBatchSumEntry = await productBatchSum.create({
          productId,
          batchNo,
          branchId,
          productName,
          branchName: requestBranch,
          totalAvailableQty: transferQty,
          sellingPrice: unitPrice,
          expDate
        });
      }

      updatedProductBatchSums.push(productBatchSumEntry);
    }

    return updatedProductBatchSums;
  } catch (error) {
    console.error('Error updating or adding product batch sum:', error);
    throw error;
  }
};



//function to get batchNo
export const getBatchNumbersByBranchAndProduct = async (branchName, productId) => {
  try {

    const branch = await branches.findOne({
      where: { branchName: branchName },
      attributes: ['branchId']
    });

    if (!branch) {
      throw new Error(`BranchId not found`);
    }

    const branchId = branch.branchId;

    const currentDate = new Date();

    const batchNumbers = await productBatchSum.findAll({
      attributes: ['batchNo', 'totalAvailableQty', 'sellingPrice', 'expDate'],
      where: {
        branchId,
        productId,
        expDate: {
          [Op.gt]: currentDate, // Check if expDate is greater than the current date
        }
      },
    });
    console.log("data",batchNumbers);

    return batchNumbers.map(record => ({
      batchNo: record.batchNo,
      totalAvailableQty: record.totalAvailableQty,
      sellingPrice: record.sellingPrice,
      expDate: record.expDate,
    }));
  } catch (error) {
    console.error('Error fetching batch numbers:', error);
    throw error;
  }
};



export const getAllProductBatchSumData = async () => {
  try {
    const allData = await productBatchSum.findAll();
    return allData;
  } catch (error) {
    throw new Error("Error retrieving all product batch sum data: " + error.message);
  }
};


// Handling billing process with detailed logging
export const handleBilling = async (billedProducts, branchName) => {
  console.log(billedProducts);
  try {
    const branchId = await mapBranchNameToId(branchName);
    if (!branchId) {
      throw new Error(`Branch not found for branchName: ${branchName}`);
    }
    console.log(`Processing billing for branchId: ${branchId}, branchName: ${branchName}`);

    const updates = billedProducts.map(async (billedProduct) => {
      const { productId, batchNo, billQty } = billedProduct;
      console.log(`Billing productId: ${productId}, batchNo: ${batchNo}, billQty: ${billQty}`);

      const productBatch = await productBatchSum.findOne({
        where: {
          branchId: branchId,
          productId: productId,
          batchNo: batchNo,
        },
      });

      if (!productBatch) {
        throw new Error(`No product batch found for productId: ${productId}, batchNo: ${batchNo},branchId: ${branchId}`);
      }

      console.log(`Found productBatch: ${JSON.stringify(productBatch.dataValues)}`);

      const newTotalAvailableQty = productBatch.totalAvailableQty - billQty;
      if (newTotalAvailableQty < 0) {
        throw new Error(`Insufficient quantity for productId: ${productId}, batchNo: ${batchNo}, branchId: ${branchId}, Available: ${productBatch.totalAvailableQty}, Requested: ${billQty}`);
      }

      await productBatchSum.update(
        { totalAvailableQty: newTotalAvailableQty },
        {
          where: {
            productId: productId,
            batchNo: batchNo,
            branchId: branchId,
          },
        }
      );

      console.log(`Updated productBatchSum for productId: ${productId}, batchNo: ${batchNo}, branchId: ${branchId} to newTotalAvailableQty: ${newTotalAvailableQty}`);
    });

    await Promise.all(updates);
    console.log(`Billing processed successfully for branch: ${branchName}`);
  } catch (error) {
    console.error(`Error handling billing for branch: ${branchName}`, error);
    throw new Error(`Error handling billing: ${error.message}`);
  }
};



// Handling refunds process
export const handleRefund = async (refundedProducts, branchName) => {
  console.log(refundedProducts);
  try {
    const branchId = await mapBranchNameToId(branchName);
    if (!branchId) {
      throw new Error(`Branch not found for branchName: ${branchName}`);
    }
    console.log(`Processing billing for branchId: ${branchId}, branchName: ${branchName}`);

    const updates = refundedProducts.map(async (refundedProduct) => {
      const { productId, batchNo, returnQty } = refundedProduct;

      const productBatch = await productBatchSum.findOne({
        where: {
          productId: productId,
          batchNo: batchNo,
          branchId: branchId,
        },
      });

      if (!productBatch) {
        throw new Error(`No product batch found for productId: ${productId}, batchNo: ${batchNo}, branchId: ${branchId}`);
      }

      console.log(`Found productBatch: ${JSON.stringify(productBatch.dataValues)}`);

      const newTotalAvailableQty = productBatch.totalAvailableQty + returnQty;

      await productBatchSum.update(
        { totalAvailableQty: newTotalAvailableQty },
        {
          where: {
            productId: productId,
            batchNo: batchNo,
            branchId: branchId,
          },
        }
      );
      console.log(`Updated productBatchSum refund for productId: ${productId}, batchNo: ${batchNo}, branchId: ${branchId} to newTotalAvailableQty: ${newTotalAvailableQty}`);
    });
    await Promise.all(updates);
    console.log(`Refund processed successfully for branch: ${branchName}`);
  } catch {
    console.error(`Error handling refund for branch: ${branchName}`, error);
    throw new Error(`Error handling refund: ${error.message}`);
  }
};


export const getAllProductsByBranch = async (searchTerm, branchId) => {
  try {
    const products = await productBatchSum.findAll({
      where: {
        branchId: branchId,
        [Op.or]: [
          { productId: { [Op.like]: `%${searchTerm}%` } },
          { productName: { [Op.like]: `%${searchTerm}%` } }
        ]
      }
    });

    if (!products || products.length === 0) {
      return [];
    }

    return products.map(product => {
      if (!product.barcode) {
        console.error('Product does not have a barcode:', product);
      }

      return {
        productId: product.productId,
        productName: product.productName,
        batchNo: product.batchNo,
        barcode: product.barcode,
        totalAvailableQty: product.totalAvailableQty,
        discount: product.discount,
        branchId: product.branchId,
        branchName: product.branchName,
        expDate: product.expDate,
        sellingPrice: product.sellingPrice,
      };
    });
  } catch (error) {
    console.error('Error retrieving products data by branch:', error);
    throw new Error('Error retrieving products data by branch');
  }
};


export const getProductsByBarcode = async (barcode, branchId) => {
  try {
    const products = await productBatchSum.findAll({
      where: {
        branchId: branchId,
        barcode: barcode
      }
    });

    if (!products || products.length === 0) {
      return []; // Return an empty array if no products found
    }

    return products.map(product => {
      return {
        productId: product.productId,
        productName: product.productName,
        batchNo: product.batchNo,
        barcode: product.barcode,
        totalAvailableQty: product.totalAvailableQty,
        discount: product.discount,
        branchId: product.branchId,
        branchName: product.branchName,
        expDate: product.expDate,
        sellingPrice: product.sellingPrice,
      };
    });
  } catch (error) {
    console.error('Error retrieving products data by barcode:', error);
    throw new Error('Error retrieving products data by barcode');
  }
};



//Function to update the discount
export const updateProductBatchDiscount = async (
  productId,
  batchNo,
  branchName,
  discount
) => {
  try {
    const branchId = await mapBranchNameToId(branchName);

    const productBatchSumData = await productBatchSum.findOne({
      where: {
        productId,
        batchNo,
        branchId,
      },
    });

    if (!productBatchSumData) {
      throw new Error('Product batch not found');
    }

    productBatchSumData.discount = discount;
    await productBatchSumData.save();

    return productBatchSumData;
  } catch (error) {
    throw new Error(`Failed to update discount: ${error.message}`);
  }
};



//Function to minQty
export const getProductQuantitiesByBranch = async (branchName) => {
  try {
    const branchId = await mapBranchNameToId(branchName);

    const currentDate = new Date();

    const productBatches = await productBatchSum.findAll({
      where: { 
        branchId,
        expDate: {
          [Op.gt]: currentDate, 
        }
      },
      attributes: ['productId', [sequelize.fn('SUM', sequelize.col('totalAvailableQty')), 'totalAvailableQty'],],
      group: ['productId'],
    });

    const results = [];

    for (const productBatch of productBatches) {
      const productId = productBatch.productId;
      const totalAvailableQty = parseFloat(productBatch.getDataValue('totalAvailableQty'));

      const product = await products.findOne({
        where: { productId },
        attributes: ['minQty', 'productName'],
      });

      if (product && totalAvailableQty < product.minQty) {
        results.push({
          branchName,
          productId,
          productName: product.productName,
          minQty: product.minQty,
          totalAvailableQty,

        });
      }
    }

    return results;
  } catch (error) {
    console.error('Error fetching product quantities by branch:', error);
    throw new Error('Unable to fetch product quantities');
  }
};





export const getProductQuantitiesByProductAndBranch = async (branchName, productId) => {
  try {
    const branchId = await mapBranchNameToId(branchName);

    const currentDate = new Date();

    const productBatches = await productBatchSum.findAll({
      where: { 
        branchId, 
        productId,  
        expDate: {
        [Op.gt]: currentDate, 
      } },
      attributes: ['productId', [sequelize.fn('SUM', sequelize.col('totalAvailableQty')), 'totalAvailableQty']],
      group: ['productId', 'branchId'],
    });

    const results = [];

    for (const productBatch of productBatches) {
      const productId = productBatch.productId;
      const totalAvailableQty = parseFloat(productBatch.getDataValue('totalAvailableQty'));

      const product = await products.findOne({
        where: { productId },
        attributes: ['minQty', 'productName'],
      });

      if (product && totalAvailableQty < product.minQty) {
        results.push({
          branchName,
          productId,
          productName: product.productName,
          minQty: product.minQty,
          totalAvailableQty,
        });
      }
    }

    return results;
  } catch (error) {
    console.error('Error fetching product quantities by branch:', error);
    throw new Error('Unable to fetch product quantities');
  }
};




//min qty without any parameter
export const getAllProductQuantities = async () => {
  try {
    const currentDate = new Date();
    const productBatches = await productBatchSum.findAll({
      where: {  
        expDate: {
      [Op.gt]: currentDate, 
    } },
      attributes: [
        'productId',
        'branchId',
        'branchName',
        [sequelize.fn('SUM', sequelize.col('totalAvailableQty')), 'totalAvailableQty']
      ],
      group: ['productId', 'branchId', 'branchName'],
    });

    const results = [];

    for (const productBatch of productBatches) {
      const productId = productBatch.productId;
      const branchName = productBatch.branchName;
      const totalAvailableQty = parseFloat(productBatch.getDataValue('totalAvailableQty'));

      const product = await products.findOne({
        where: { productId },
        attributes: ['minQty', 'productName'],
      });

      if (product && totalAvailableQty < product.minQty) {
        results.push({
          branchName,
          productId,
          productName: product.productName,
          minQty: product.minQty,
          totalAvailableQty,
        });
      }
    }

    return results;
  } catch (error) {
    console.error('Error fetching product quantities:', error);
    throw new Error('Unable to fetch product quantities');
  }
};







export const getProductQuantitiesByProductId = async (productId) => {
  try {
    const currentDate = new Date();

    const productBatches = await productBatchSum.findAll({
      where: { 
        productId,
        expDate: {
          [Op.gt]: currentDate, 
        } },
      attributes: [
        'productId',
        'branchId',
        'branchName',
        [sequelize.fn('SUM', sequelize.col('totalAvailableQty')), 'totalAvailableQty']
      ],
      group: ['productId', 'branchId', 'branchName'],
    });

    const results = [];

    for (const productBatch of productBatches) {
      const branchName = productBatch.branchName;
      const totalAvailableQty = parseFloat(productBatch.getDataValue('totalAvailableQty'));

      const product = await products.findOne({
        where: { productId },
        attributes: ['minQty', 'productName'],
      });

      if (product && totalAvailableQty < product.minQty) {
        results.push({
          branchName,
          productId,
          productName: product.productName,
          minQty: product.minQty,
          totalAvailableQty,
        });
      }
    }

    return results;
  } catch (error) {
    console.error('Error fetching product quantities by product ID:', error);
    throw new Error('Unable to fetch product quantities');
  }
};




export const getAllProductBatchSumDataByBranch = async (branchName) => {
  try {
    const branchId = await mapBranchNameToId(branchName);

    if (!branchId) {
      throw new Error(`Branch not found for branchName: ${branchName}`);
    }

    const productBatchSumData = await productBatchSum.findAll({
      where: { branchId: branchId }
    });

    if (!productBatchSumData || productBatchSumData.length === 0) {
      return [];
    }

    return productBatchSumData.map(record => ({
      productId: record.productId,
      batchNo: record.batchNo,
      barcode: record.barcode,
      branchId: record.branchId,
      branchName: record.branchName,
      expDate: record.expDate,
      sellingPrice: record.sellingPrice,
      totalAvailableQty: record.totalAvailableQty,
      productName: record.productName,
      discount: record.discount,
    }));
  } catch (error) {
    console.error('Error retrieving Stock summery product batch sum data by branch:', error);
    throw new Error('Error retrieving  Stock summery product batch sum data by branch');
  }
};


export const getUpcomingExpProductBatchSumDataByBranch = async (branchName) => {
  try {
    const branchId = await mapBranchNameToId(branchName);

    if (!branchId) {
      throw new Error(`Branch not found for branchName: ${branchName}`);
    }

    const currentDate = new Date();
    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(currentDate.getMonth() + 6);

    const productBatchSumData = await productBatchSum.findAll({
      where: {
        branchId: branchId,
        expDate: {
          [Op.between]: [currentDate, sixMonthsLater]
        }
      }
    });

    if (!productBatchSumData || productBatchSumData.length === 0) {
      return [];
    }

    return productBatchSumData.map(record => ({
      productId: record.productId,
      batchNo: record.batchNo,
      barcode: record.barcode,
      branchId: record.branchId,
      branchName: record.branchName,
      expDate: record.expDate,
      sellingPrice: record.sellingPrice,
      totalAvailableQty: record.totalAvailableQty,
      productName: record.productName,
      discount: record.discount,
    }));
  } catch (error) {
    console.error('Error retrieving Upcoming exp product batch sum data by branch:', error);
    throw new Error('Error retrieving Upcoming exp product batch sum data by branch');
  }
};


export const getAlreadyExpProductBatchSumDataByBranch = async (branchName) => {
  try {
    const branchId = await mapBranchNameToId(branchName);

    if (!branchId) {
      throw new Error(`Branch not found for branchName: ${branchName}`);
    }

    const currentDate = new Date();

    const productBatchSumData = await productBatchSum.findAll({
      where: {
        branchId: branchId,
        expDate: {
          [Op.lt]: currentDate  // Find records where expDate is less than currentDate
        }
      }
    });

    if (!productBatchSumData || productBatchSumData.length === 0) {
      return [];
    }

    return productBatchSumData.map(record => ({
      productId: record.productId,
      batchNo: record.batchNo,
      barcode: record.barcode,
      branchId: record.branchId,
      branchName: record.branchName,
      expDate: record.expDate,
      sellingPrice: record.sellingPrice,
      totalAvailableQty: record.totalAvailableQty,
      productName: record.productName,
      discount: record.discount,
    }));
  } catch (error) {
    console.error('Error retrieving Already exp product batch sum data by branch:', error);
    throw new Error('Error retrieving Already exp product batch sum data by branch');
  }
};


export const getProductDetailsByBranchName = async (branchName) => {
  try {
    const branch = await branches.findOne({
      where: { branchName },
    });

    if (!branch) {
      throw new Error('Branch not found');
    }

    console.log("branchId", branch.branchId);

    const productsData = await productBatchSum.findAll({
      where: { branchId: branch.branchId },
      attributes: ['productId', 'productName', 'branchName', 'discount', 'sellingPrice', 'totalAvailableQty'],
    });

    const results = [];

    for (const productData of productsData) {
      const { productId, branchName, discount, sellingPrice, totalAvailableQty } = productData.dataValues;

      const product = await products.findOne({
        where: { productId },
        attributes: ['productName', 'description', 'image'],
      });

      if (product) {
        results.push({
          branchName,
          productId,
          productName: product.productName,
          description: product.description,
          image: product.image,
          discount,
          sellingPrice,
          totalAvailableQty
        });
      }
    }

    return results;
  } catch (error) {
    throw error;
  }
};


export const getProductsAndBatchSumDetails = async (categoryId, branchName) => {
  try {
    // Find the branchId from branchName
    const branch = await branches.findOne({
      where: { branchName },
      attributes: ['branchId']
    });

    if (!branch) {
      throw new Error('Branch not found');
    }

    const branchId = branch.branchId;

    // Fetch products based on categoryId
    const productDetails = await products.findAll({
      where: { categoryId },
      attributes: ['productId', 'productName', 'barcode', 'description', 'image'],
    });

    // Extract productIds from the productDetails
    const productIds = productDetails.map(product => product.productId);

    if (productIds.length === 0) {
      return { productDetails, batchSumDetails: [] }; // No products found for the given category
    }

    const currentDate = new Date();
    const nearExpiryThreshold = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    const nearExpiryDate = new Date(currentDate.getTime() + nearExpiryThreshold);

    // Fetch one product batch sum based on productIds and branchId, excluding near-expiration batches
    const batchSumDetail = await productBatchSum.findOne({
      where: {
        productId: productIds,
        branchId,
        expDate: {
          [Op.gt]: nearExpiryDate, // Exclude near-expiration batches
        }
      },
      attributes: ['productId', 'productName', 'batchNo', 'barcode', 'totalAvailableQty', 'discount', 'branchId', 'branchName', 'expDate', 'sellingPrice'],
      order: [['expDate', 'ASC']] // Optional: Order by expiration date
    });

    return { productDetails, batchSumDetails: batchSumDetail ? [batchSumDetail] : [] };
  } catch (error) {
    throw new Error(error.message);
  }
};
