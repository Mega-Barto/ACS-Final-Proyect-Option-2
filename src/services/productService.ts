import axios from 'axios';
import { API_URL } from '../config';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
}

// Configure axios defaults
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const productService = {
  // Get all products
  getProducts: async (): Promise<Product[]> => {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get product by ID
  getProduct: async (id: string): Promise<Product> => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Create new product
  createProduct: async (data: CreateProductData): Promise<Product> => {
    try {
      const response = await api.post('/products', JSON.stringify(data));
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update product
  updateProduct: async (id: string, data: UpdateProductData): Promise<Product> => {
    try {
      const response = await api.put(`/products/${id}`, JSON.stringify(data));
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Delete product
  deleteProduct: async (id: string): Promise<void> => {
    try {
      await api.delete(`/products/${id}`);
    } catch (error) {
      throw error;
    }
  },
  
  // Get user's products
  getUserProducts: async (): Promise<Product[]> => {
    try {
      const response = await api.get('/products/user');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};