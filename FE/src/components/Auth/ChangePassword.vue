<template>
  <div class="animate-fadeIn max-w-md mx-auto p-2">
    <!-- Tiêu đề phụ tinh tế -->
    <div class="text-center mb-6">
      <h2 class="text-2xl font-black text-slate-800 tracking-wide">ĐỔI MẬT KHẨU</h2>
      <p class="text-slate-500 text-xs mt-1 font-semibold">Bảo mật tài khoản của bạn để trải nghiệm mua sắm an toàn</p>
    </div>

    <!-- Card Form Đổi Mật Khẩu -->
    <div class="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-md shadow-slate-100/80">
      <form @submit.prevent="changePassword" class="space-y-5">
        
        <!-- Mật Khẩu Hiện Tại -->
        <div>
          <label class="block text-slate-800 font-bold text-sm mb-2 flex items-center gap-1.5">
            Mật Khẩu Hiện Tại <span class="text-pink-500 font-black">*</span>
          </label>
          <input 
            v-model="passwordForm.currentPassword"
            :disabled="loading"
            type="password" 
            class="w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-xl focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-500/10 transition disabled:opacity-50 text-sm placeholder:text-slate-400 font-medium shadow-sm"
            placeholder="Nhập mật khẩu hiện tại"
          />
        </div>

        <!-- Mật Khẩu Mới -->
        <div>
          <label class="block text-slate-800 font-bold text-sm mb-2 flex items-center gap-1.5">
            Mật Khẩu Mới <span class="text-pink-500 font-black">*</span>
          </label>
          <input 
            v-model="passwordForm.newPassword"
            :disabled="loading"
            type="password" 
            class="w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-xl focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-500/10 transition disabled:opacity-50 text-sm placeholder:text-slate-400 font-medium shadow-sm"
            placeholder="Tối thiểu 8 ký tự"
          />
        </div>

        <!-- Xác Nhận Mật Khẩu Mới -->
        <div>
          <label class="block text-slate-800 font-bold text-sm mb-2 flex items-center gap-1.5">
            Xác Nhận Mật Khẩu Mới <span class="text-pink-500 font-black">*</span>
          </label>
          <input 
            v-model="passwordForm.confirmPassword"
            :disabled="loading"
            type="password" 
            class="w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-xl focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-500/10 transition disabled:opacity-50 text-sm placeholder:text-slate-400 font-medium shadow-sm"
            placeholder="Nhập lại mật khẩu mới"
          />
        </div>

        <!-- Nút Cập Nhật Mật Khẩu -->
        <button 
          type="submit"
          :disabled="loading"
          class="w-full mt-2 py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-xl transition duration-300 shadow-md shadow-pink-500/20 hover:shadow-lg hover:shadow-pink-500/30 disabled:opacity-60 flex items-center justify-center gap-2 text-sm tracking-wide transform active:scale-[0.98]"
        >
          <span v-if="loading" class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
          {{ loading ? 'ĐANG CẬP NHẬT...' : 'CẬP NHẬT MẬT KHẨU' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import AuthService from '@/plugins/authService';
import { useToast } from 'vue-toastification';

export default {
  name: 'ChangePassword',
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      passwordForm: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      loading: false
    }
  },
  methods: {
    async changePassword() {
      if (!this.passwordForm.currentPassword || !this.passwordForm.newPassword || !this.passwordForm.confirmPassword) {
        this.toast.error('Vui lòng nhập đầy đủ thông tin!');
        return;
      }

      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        this.toast.error('Mật khẩu mới không trùng khớp!');
        return;
      }

      if (this.passwordForm.newPassword.length < 8) {
        this.toast.error('Mật khẩu mới phải có ít nhất 8 ký tự!');
        return;
      }

      this.loading = true;

      try {
        const token = AuthService.getToken ? AuthService.getToken() : localStorage.getItem('token');
        
        const response = await axios.post(
          'http://localhost:3000/api/auth/change-password', 
          {
            currentPassword: this.passwordForm.currentPassword,
            newPassword: this.passwordForm.newPassword,
            confirmPassword: this.passwordForm.confirmPassword
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.success) {
          this.toast.success(response.data.message || 'Đổi mật khẩu thành công!');

          this.passwordForm = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          };
        } else {
          this.toast.error(response.data.message || 'Đổi mật khẩu thất bại!');
        }

      } catch (error) {
        console.error('Lỗi đổi mật khẩu:', error);
        
        if (error.response && error.response.data && error.response.data.message) {
          this.toast.error(error.response.data.message);
        } else {
          this.toast.error('Có lỗi kết nối đến server. Vui lòng thử lại!');
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
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
button:hover {
  transform: translateY(-1px);
}
input {
  transition: all 0.2s ease-in-out;
}
input:focus {
  border-color: #ec4899 !important;
  box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.15) !important;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-fadeIn {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.animate-spin {
  animation: spin 0.8s linear infinite;
}
</style>