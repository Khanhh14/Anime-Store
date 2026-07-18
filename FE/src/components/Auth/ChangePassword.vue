<template>
  <div class="animate-fadeIn max-w-2xl mx-auto p-4 md:p-0">
    <h2 class="text-3xl font-bold text-white mb-8">Đổi Mật Khẩu</h2>
    <div class="bg-gradient-to-br from-slate-700 to-slate-600 rounded-xl p-8 border border-slate-600 shadow-xl shadow-slate-900/50">
      <form @submit.prevent="changePassword" class="space-y-6">
        <div>
          <label class="block text-white font-bold mb-3">Mật Khẩu Hiện Tại</label>
          <input 
            v-model="passwordForm.currentPassword"
            :disabled="loading"
            type="password" 
            class="w-full px-4 py-3 bg-slate-800 text-white border border-slate-600 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition disabled:opacity-50"
            placeholder="Nhập mật khẩu hiện tại"
          />
        </div>
        <div>
          <label class="block text-white font-bold mb-3">Mật Khẩu Mới</label>
          <input 
            v-model="passwordForm.newPassword"
            :disabled="loading"
            type="password" 
            class="w-full px-4 py-3 bg-slate-800 text-white border border-slate-600 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition disabled:opacity-50"
            placeholder="Nhập mật khẩu mới"
          />
        </div>
        <div>
          <label class="block text-white font-bold mb-3">Xác Nhận Mật Khẩu Mới</label>
          <input 
            v-model="passwordForm.confirmPassword"
            :disabled="loading"
            type="password" 
            class="w-full px-4 py-3 bg-slate-800 text-white border border-slate-600 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition disabled:opacity-50"
            placeholder="Xác nhận mật khẩu mới"
          />
        </div>

        <div v-if="passwordMessage" :class="[
          'p-4 rounded-lg text-sm font-semibold',
          isSuccess ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
        ]">
          {{ passwordMessage }}
        </div>

        <button 
          type="submit"
          :disabled="loading"
          class="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-lg transition duration-300 hover:shadow-lg hover:shadow-blue-500/40 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <span v-if="loading" class="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
          {{ loading ? 'Đang cập nhật...' : 'Cập Nhật Mật Khẩu' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
// Import axios hoặc service quản lý gọi API của bạn
import axios from 'axios';
import AuthService from '@/plugins/authService';

export default {
  name: 'ChangePassword',
  data() {
    return {
      passwordForm: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      passwordMessage: '',
      isSuccess: false, // Thêm để phân biệt màu thông báo
      loading: false    // Trạng thái loading khi đợi API phản hồi
    }
  },
  methods: {
    async changePassword() {
      this.passwordMessage = '';
      this.isSuccess = false;
      
      // 1. Validate dữ liệu ở FE (Đồng bộ độ dài >= 8 ký tự giống Backend của bạn)
      if (!this.passwordForm.currentPassword || !this.passwordForm.newPassword || !this.passwordForm.confirmPassword) {
        this.passwordMessage = 'Vui lòng nhập đầy đủ thông tin';
        return;
      }

      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        this.passwordMessage = 'Mật khẩu mới không trùng khớp';
        return;
      }

      if (this.passwordForm.newPassword.length < 8) {
        this.passwordMessage = 'Mật khẩu mới phải có ít nhất 8 ký tự';
        return;
      }

      this.loading = true;

      try {
        // 2. Lấy token của user hiện tại đang lưu ở localStorage/cookie qua AuthService
        const token = AuthService.getToken ? AuthService.getToken() : localStorage.getItem('token');
        
        // 3. Gọi API Đổi mật khẩu
        // Thay đổi URL bên dưới cho đúng với cấu hình route Backend của bạn (Ví dụ: http://localhost:3000/api/auth/change-password)
        const response = await axios.post(
          'http://localhost:3000/api/auth/change-password', 
          {
            currentPassword: this.passwordForm.currentPassword,
            newPassword: this.passwordForm.newPassword,
            confirmPassword: this.passwordForm.confirmPassword
          },
          {
            headers: {
              // Gửi token kèm theo định dạng Bearer để middleware verifyToken bên Backend đọc được
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.success) {
          this.isSuccess = true;
          this.passwordMessage = '✓ ' + response.data.message;

          // Xóa trắng form sau khi đổi thành công
          this.passwordForm = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          };

          // Tự động biến mất dòng thông báo thành công sau 3 giây
          setTimeout(() => {
            this.passwordMessage = '';
          }, 3000);
        }

      } catch (error) {
        console.error('Lỗi đổi mật khẩu:', error);
        this.isSuccess = false;
        
        // Hiển thị thông báo lỗi từ backend trả về nếu có (ví dụ: Mật khẩu hiện tại không chính xác)
        if (error.response && error.response.data && error.response.data.message) {
          this.passwordMessage = error.response.data.message;
        } else {
          this.passwordMessage = 'Có lỗi xảy ra kết nối đến server. Vui lòng thử lại!';
        }
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
button {
  transition: all 0.3s ease;
}
button:active {
  transform: scale(0.95);
}
button:hover {
  transform: translateY(-2px);
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-fadeIn {
  animation: fadeIn 0.6s ease-out forwards;
}
.animate-spin {
  animation: spin 1s linear infinite;
}
input:focus {
  background-color: rgba(30, 41, 59, 0.8);
}
</style>