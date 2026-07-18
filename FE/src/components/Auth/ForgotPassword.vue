<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">
      <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden">
        
        <div class="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 sm:px-8 py-8">
          <h1 class="text-2xl sm:text-3xl font-bold text-white text-center">
            {{ isOtpStep ? 'Xác thực OTP' : 'Quên mật khẩu' }}
          </h1>
          <p class="text-blue-100 text-center mt-2 text-sm">
            {{ isOtpStep ? 'Nhập mã OTP từ email và thiết lập mật khẩu mới' : 'Nhập email của bạn để nhận mã xác thực đặt lại mật khẩu' }}
          </p>
        </div>

        <form v-if="!isOtpStep" @submit.prevent="handleSendOtp" class="px-6 sm:px-8 py-8 animate-fadeIn">
          <div class="mb-6">
            <label for="email" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="example@email.com"
                required
                :disabled="isLoading"
                class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
              />
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Mã xác thực 6 số sẽ được gửi tới địa chỉ email này.
            </p>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 active:from-blue-700 active:to-cyan-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/50 disabled:shadow-none flex items-center justify-center"
          >
            <span v-if="!isLoading">Gửi mã OTP</span>
            <span v-else class="flex items-center space-x-2">
              <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Đang gửi...</span>
            </span>
          </button>

          <div class="text-center mt-6">
            <button
              type="button"
              @click="goBackToLogin"
              class="text-sm font-semibold text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-none border-none p-0"
            >
              ← Quay lại đăng nhập
            </button>
          </div>
        </form>

        <form v-else @submit.prevent="handleResetPassword" class="px-6 sm:px-8 py-8 animate-fadeIn">
          
          <div class="mb-4">
            <label for="otp" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Mã xác thực OTP
            </label>
            <input
              id="otp"
              v-model="otpCode"
              type="text"
              maxlength="6"
              placeholder="Nhập 6 số OTP"
              required
              :disabled="isLoading"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center font-bold tracking-widest text-lg transition-all duration-300 disabled:opacity-50"
            />
          </div>

          <div class="mb-4">
            <label for="newPassword" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Mật khẩu mới
            </label>
            <input
              id="newPassword"
              v-model="newPassword"
              type="password"
              placeholder="Tối thiểu 8 ký tự"
              required
              :disabled="isLoading"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50"
            />
          </div>

          <div class="mb-6">
            <label for="confirmPassword" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Xác nhận mật khẩu mới
            </label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              required
              :disabled="isLoading"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 active:from-green-700 active:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/50 disabled:shadow-none flex items-center justify-center"
          >
            <span v-if="!isLoading">Xác nhận đặt lại</span>
            <span v-else class="flex items-center space-x-2">
              <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Đang xử lý...</span>
            </span>
          </button>

          <div class="text-center mt-6">
            <button
              type="button"
              @click="isOtpStep = false"
              class="text-sm font-semibold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors bg-none border-none p-0"
            >
              ← Thay đổi địa chỉ Email
            </button>
          </div>
        </form>

        <div v-if="showSuccess" class="px-6 sm:px-8 py-6 bg-green-50 dark:bg-green-900/20 border-t border-green-200 dark:border-green-700 animate-fadeIn">
          <div class="flex items-start">
            <svg class="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <div>
              <p class="text-sm font-semibold text-green-800 dark:text-green-200">
                {{ successMessage }}
              </p>
            </div>
          </div>
        </div>

        <div v-if="showError" class="px-6 sm:px-8 py-6 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-700 animate-fadeIn">
          <div class="flex items-start">
            <svg class="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <div>
              <p class="text-sm font-semibold text-red-800 dark:text-red-200">Lỗi: {{ errorMessage }}</p>
            </div>
          </div>
        </div>
      </div>

      <p class="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
        <a href="#" class="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          Liên hệ hỗ trợ
        </a>
        nếu bạn gặp vấn đề
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Các trạng thái quản lý form
const isOtpStep = ref(false) // Quản lý chuyển đổi giữa form Email và form OTP
const isLoading = ref(false)
const showSuccess = ref(false)
const showError = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Dữ liệu form
const email = ref('')
const otpCode = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const resetToken = ref('') // Lưu mã Token ẩn nhận từ backend gửi về

// HÀM 1: Gửi yêu cầu mã OTP lên Backend
const handleSendOtp = async () => {
  if (!email.value) return

  isLoading.value = true
  showError.value = false
  showSuccess.value = false

  try {
    const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value })
    })

    const data = await response.json()

    if (data.success) {
      // Lưu lại mã token bảo mật ẩn mà backend phản hồi về
      resetToken.value = data.resetToken 
      
      // Kích hoạt trạng thái chuyển sang bước 2 (Form nhập OTP & mật khẩu mới)
      isOtpStep.value = true
      
      // Hiện thông báo thành công tạm thời
      successMessage.value = 'Mã OTP đã được gửi thành công về email của bạn!'
      showSuccess.value = true
      setTimeout(() => { showSuccess.value = false }, 4000)
    } else {
      errorMessage.value = data.message || 'Email không hợp lệ hoặc chưa được đăng ký.'
      showError.value = true
    }
  } catch (error) {
    console.error('Send OTP error:', error)
    errorMessage.value = 'Không thể kết nối đến máy chủ. Vui lòng thử lại.'
    showError.value = true
  } finally {
    isLoading.value = false
  }
}

// HÀM 2: Gửi mã OTP cùng mật khẩu mới để xác thực đặt lại mật khẩu
const handleResetPassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'Mật khẩu xác nhận không trùng khớp.'
    showError.value = true
    return
  }

  if (newPassword.value.length < 8) {
    errorMessage.value = 'Mật khẩu mới phải có độ dài ít nhất từ 8 ký tự.'
    showError.value = true
    return
  }

  isLoading.value = true
  showError.value = false
  showSuccess.value = false

  try {
    const response = await fetch('http://localhost:3000/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        otpCode: otpCode.value,
        newPassword: newPassword.value,
        confirmPassword: confirmPassword.value,
        resetToken: resetToken.value // Truyền ngược token bảo mật lên backend đối chiếu
      })
    })

    const data = await response.json()

    if (data.success) {
      successMessage.value = 'Đặt lại mật khẩu thành công! Bạn đang được chuyển về trang đăng nhập.'
      showSuccess.value = true
      
      // Xóa sạch dữ liệu form cũ an toàn
      otpCode.value = ''
      newPassword.value = ''
      confirmPassword.value = ''

      // Tự động điều hướng về lại trang Login sau 3 giây
      setTimeout(() => {
        router.push({ name: 'login' })
      }, 3000)
    } else {
      errorMessage.value = data.message || 'Mã OTP không chính xác hoặc phiên làm việc đã hết hạn.'
      showError.value = true
    }
  } catch (error) {
    console.error('Reset password error:', error)
    errorMessage.value = 'Quá trình cập nhật thất bại. Vui lòng thử lại.'
    showError.value = true
  } finally {
    isLoading.value = false
  }
}

const goBackToLogin = () => {
  router.push({ name: 'login' })
}
</script>

<style scoped>
input:focus,
button:focus {
  outline: none;
}

button {
  transition: all 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>