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

        <!-- BƯỚC 1: FORM GỬI EMAIL -->
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

        <!-- BƯỚC 2: FORM NHẬP OTP VÀ ĐẶT MẬT KHẨU MỚI -->
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
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()

// Trạng thái quản lý form
const isOtpStep = ref(false)
const isLoading = ref(false)

// Dữ liệu form
const email = ref('')
const otpCode = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const resetToken = ref('')

// HÀM 1: Gửi yêu cầu mã OTP lên Backend
const handleSendOtp = async () => {
  if (!email.value) return

  isLoading.value = true

  try {
    const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value })
    })

    const data = await response.json()

    if (data.success) {
      resetToken.value = data.resetToken 
      isOtpStep.value = true
      toast.success('Mã OTP đã được gửi thành công về email của bạn!')
    } else {
      toast.error(data.message || 'Email không hợp lệ hoặc chưa được đăng ký.')
    }
  } catch (error) {
    console.error('Send OTP error:', error)
    toast.error('Không thể kết nối đến máy chủ. Vui lòng thử lại.')
  } finally {
    isLoading.value = false
  }
}

// HÀM 2: Gửi mã OTP cùng mật khẩu mới để xác thực đặt lại mật khẩu
const handleResetPassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    toast.error('Mật khẩu xác nhận không trùng khớp!')
    return
  }

  if (newPassword.value.length < 8) {
    toast.error('Mật khẩu mới phải có độ dài ít nhất từ 8 ký tự!')
    return
  }

  isLoading.value = true

  try {
    const response = await fetch('http://localhost:3000/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        otpCode: otpCode.value,
        newPassword: newPassword.value,
        confirmPassword: confirmPassword.value,
        resetToken: resetToken.value
      })
    })

    const data = await response.json()

    if (data.success) {
      toast.success('Đặt lại mật khẩu thành công! Đang chuyển về trang đăng nhập.')
      
      otpCode.value = ''
      newPassword.value = ''
      confirmPassword.value = ''

      setTimeout(() => {
        router.push({ name: 'login' })
      }, 2000)
    } else {
      toast.error(data.message || 'Mã OTP không chính xác hoặc phiên làm việc đã hết hạn.')
    }
  } catch (error) {
    console.error('Reset password error:', error)
    toast.error('Quá trình cập nhật thất bại. Vui lòng thử lại.')
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