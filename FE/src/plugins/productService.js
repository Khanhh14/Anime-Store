/**
 * API Service for products
 * Handles all API calls related to products
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ProductService {
  // Get all products
  static async getAllProducts() {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get all products error:', error);
      return {
        success: false,
        message: 'Không thể kết nối đến máy chủ',
        data: []
      };
    }
  }

  // Get product by id
  static async getProductById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get product error:', error);
      return {
        success: false,
        message: 'Không thể kết nối đến máy chủ'
      };
    }
  }

  // Get products by category
  static async getProductsByCategory(categoryId) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/category/${categoryId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get products by category error:', error);
      return {
        success: false,
        message: 'Không thể kết nối đến máy chủ',
        data: []
      };
    }
  }

  // Get categories
  static async getCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get categories error:', error);
      return {
        success: false,
        message: 'Không thể kết nối đến máy chủ',
        data: []
      };
    }
  }

  // Get brands
  static async getBrands() {
    try {
      const response = await fetch(`${API_BASE_URL}/brands`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get brands error:', error);
      return {
        success: false,
        message: 'Không thể kết nối đến máy chủ',
        data: []
      };
    }
  }
}

export default ProductService;
