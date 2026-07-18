import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  // State: Khởi tạo giá trị token ban đầu lấy từ LocalStorage (nếu có)
  const token = ref(localStorage.getItem('token') || null);
  const user = ref(JSON.parse(localStorage.getItem('user')) || null);

  // Getters: Kiểm tra xem user đã đăng nhập hay chưa (trả về true/false)
  const isLoggedIn = computed(() => !!token.value);

  // Actions: Hàm xử lý Đăng nhập thành công
  const loginSuccess = (userData, tokenData) => {
    token.value = tokenData;
    user.value = userData;

    // Lưu vào LocalStorage để tắt trình duyệt đi mở lại không bị mất phiên
    localStorage.setItem('token', tokenData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Actions: Hàm xử lý Đăng xuất hoặc khi Token hết hạn (Lỗi 401)
  const logout = () => {
    token.value = null;
    user.value = null;

    // Xóa sạch dấu vết trong LocalStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return {
    token,
    user,
    isLoggedIn,
    loginSuccess,
    logout
  };
});