/**
 * API Service for orders
 * Handles all API calls related to orders
 */

import AuthService from './authService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class OrderService {
  // ===================================================
  // CẬP NHẬT: Lấy danh sách mã giảm giá từ CSDL Coupons
  // ===================================================
  static async getVouchers() {
    try {
      // Đã đổi endpoint thành /coupons để khớp với backend quản lý của bạn
      const response = await fetch(`${API_BASE_URL}/coupons`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...AuthService.getAuthHeader() // Gửi kèm token xác thực người dùng
        }
      });

      // Phòng tránh lỗi HTML trả về làm crash JSON parser (Lỗi Unexpected token '<')
      if (!response.ok) {
        return {
          success: false,
          message: `Lỗi máy chủ: Server phản hồi trạng thái ${response.status}`,
          data: []
        };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get vouchers/coupons error:', error);
      return {
        success: false,
        message: 'Không thể kết nối đến máy chủ',
        data: []
      };
    }
  }

  // Get user's orders
  static async getUserOrders() {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...AuthService.getAuthHeader()
        }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get user orders error:', error);
      return {
        success: false,
        message: 'Không thể kết nối đến máy chủ',
        data: []
      };
    }
  }

  // Get order by id
  static async getOrderById(orderId) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...AuthService.getAuthHeader()
        }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get order error:', error);
      return {
        success: false,
        message: 'Không thể kết nối đến máy chủ'
      };
    }
  }

  // Get user's cart
  static async getUserCart() {
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...AuthService.getAuthHeader()
        }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get user cart error:', error);
      return {
        success: false,
        message: 'Không thể kết nối đến máy chủ',
        data: []
      };
    }
  }

  // Add to cart
  static async addToCart(productId, quantity) {
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...AuthService.getAuthHeader()
        },
        body: JSON.stringify({
          product_id: productId,
          quantity
        })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Add to cart error:', error);
      return {
        success: false,
        message: 'Không thể kết nối đến máy chủ'
      };
    }
  }

  // Remove from cart
  static async removeFromCart(productId) {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...AuthService.getAuthHeader()
        }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Remove from cart error:', error);
      return {
        success: false,
        message: 'Không thể kết nối đến máy chủ'
      };
    }
  }

  // Create order
  static async createOrder(orderData) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...AuthService.getAuthHeader()
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Create order error:', error);
      return {
        success: false,   
        message: 'Không thể kết nối đến máy chủ'
      };
    }
  }
}

export default OrderService;