import request from 'supertest';
import express from 'express';
import * as controller from './controller'; // Adjust the path to your controller file

const app = express();
app.use(express.json());
app.use('/', controller); // Adjust the path as necessary

describe('Product Controller', () => {

  test('should get all products', async () => {
    const response = await request(app).get('/products'); // Adjust endpoint as necessary
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('should get a product by ID', async () => {
    const productId = '12345'; // Replace with a valid product ID
    const response = await request(app).get(`/products/${productId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', productId);
  });

  test('should create a new product', async () => {
    const newProduct = {
      productName: 'Test Product',
      description: 'Test Description',
      categoryName: 'Test Category',
      barcode: '123456789',
      minQty: 10,
      image: 'base64imageString'
    };
    const response = await request(app).post('/products').send(newProduct);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('productName', 'Test Product');
  });

  test('should update a product', async () => {
    const productId = '12345'; // Replace with a valid product ID
    const updatedData = {
      productName: 'Updated Product'
    };
    const response = await request(app).put(`/products/${productId}`).send(updatedData);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('productName', 'Updated Product');
  });

  test('should delete a product', async () => {
    const productId = '12345'; // Replace with a valid product ID
    const response = await request(app).delete(`/products/${productId}`);
    expect(response.status).toBe(200);
  });

});
