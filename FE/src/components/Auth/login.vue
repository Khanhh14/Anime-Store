<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">
      <!-- Login Card -->
      <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-rose-500 to-pink-500 px-6 sm:px-8 py-8">
          <h1 class="text-2xl sm:text-3xl font-bold text-white text-center">
            Chào mừng trở lại
          </h1>
          <p class="text-rose-100 text-center mt-2 text-sm">
            Đăng nhập vào tài khoản của bạn
          </p>
        </div>

        <!-- Form Content -->
        <form @submit.prevent="handleLogin" class="px-6 sm:px-8 py-8">
          <!-- Email Input -->
          <div class="mb-5">
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
                v-model="formData.email"
                type="email"
                placeholder="example@email.com"
                required
                class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300"
              />
            </div>
          </div>

          <!-- Password Input -->
          <div class="mb-2">
            <label for="password" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Mật khẩu
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="password"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                required
                class="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-4.753 4.753m7.538-1.15a3 3 0 00-4.243-4.243M9.365 11.599a6 6 0 018.488 8.488M3 3l3.257 3.257m9.486 9.486L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between mb-6">
            <label class="flex items-center cursor-pointer">
              <input
                v-model="formData.rememberMe"
                type="checkbox"
                class="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-rose-500 focus:ring-rose-500 dark:bg-gray-800 cursor-pointer"
              />
              <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">
                Nhớ tôi
              </span>
            </label>
            <button
              type="button"
              @click="goToForgotPassword"
              class="text-sm font-semibold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors bg-none border-none cursor-pointer p-0"
            >
              Quên mật khẩu?
            </button>
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3 px-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 active:from-rose-700 active:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-rose-500/50 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center"
          >
            <span v-if="!isLoading">Đăng nhập</span>
            <span v-else class="flex items-center space-x-2">
              <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Đang xử lý...</span>
            </span>
          </button>

          <!-- Divider -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                Hoặc tiếp tục với
              </span>
            </div>
          </div>

          <!-- Google Login Button (Centered) -->
          <div class="flex justify-center w-full">
            <div id="googleBtn"></div>
          </div>
        </form>

        <!-- Sign Up Link -->
        <div class="px-6 sm:px-8 py-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 text-center">
          <p class="text-gray-700 dark:text-gray-300 text-sm">
            Chưa có tài khoản?
            <button
              type="button"
              @click="goToRegister"
              class="font-bold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors bg-none border-none cursor-pointer p-0"
            >
              Đăng ký ngay
            </button>
          </p>
        </div>
      </div>

      <!-- Footer Text -->
      <p class="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
        Bằng cách đăng nhập, bạn đồng ý với
        <a href="#" class="text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
          Điều khoản dịch vụ
        </a>
        và
        <a href="#" class="text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
          Chính sách bảo mật
        </a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const formData = ref({
  email: '',
  password: '',
  rememberMe: false
})

const showPassword = ref(false)
const isLoading = ref(false)

// Logic xử lý Đăng nhập thông thường qua Email/Password
const handleLogin = async () => {
  isLoading.value = true
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.value.email,
        password: formData.value.password,
        rememberMe: formData.value.rememberMe
      })
    })

    const data = await response.json()

    if (data.success) {
      authStore.loginSuccess(data.data.user, data.data.token)
      if (formData.value.rememberMe) {
        localStorage.setItem('rememberMe', 'true')
      }
      alert('Đăng nhập thành công!')
      router.push({ name: 'home' })
    } else {
      alert(data.message || 'Đăng nhập thất bại')
    }
  } catch (error) {
    console.error('Login error:', error)
    alert('Có lỗi xảy ra. Vui lòng thử lại.')
  } finally {
    isLoading.value = false
  }
}

// Hàm callback xử lý kết quả nhận về chuỗi credential từ Google pop-up
const handleCredentialResponse = async (response) => {
  isLoading.value = true
  try {
    const res = await fetch('http://localhost:3000/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: response.credential })
    })
    const data = await res.json()

    if (data.success) {
      authStore.loginSuccess(data.data.user, data.data.token)
      alert('Đăng nhập bằng Google thành công!')
      router.push({ name: 'home' })
    } else {
      alert(data.message || 'Đăng nhập bằng Google thất bại.')
    }
  } catch (err) {
    console.error('Google backend auth error:', err)
    alert('Không thể xác thực tài khoản Google với máy chủ.')
  } finally {
    isLoading.value = false
  }
}

// Tự động nạp cấu hình và dựng nút bấm chính chủ ngay khi trang Login được mở
onMounted(() => {
  if (window.google && window.google.accounts && window.google.accounts.id) {
    // 1. Khởi tạo cấu hình ứng dụng
    window.google.accounts.id.initialize({
      client_id: '911076441690-50oqg4h5a2g8ltr0v393g5tobkklb0lp.apps.googleusercontent.com',
      callback: handleCredentialResponse
    });

    // 2. Tự động vẽ nút bấm Google chuẩn vào thẻ div #googleBtn
    window.google.accounts.id.renderButton(
      document.getElementById('googleBtn'),
      { 
        theme: 'outline', 
        size: 'large', 
        text: 'signin_with', 
        shape: 'rectangular',
        width: 240 // Tăng nhẹ chiều rộng để nút Google trông đầy đặn hơn khi đứng một mình
      }
    );
  }
})

const goToRegister = () => {
  router.push({ name: 'register' })
}

const goToForgotPassword = () => {
  router.push({ name: 'forgot-password' })
}
</script>

<style scoped>
/* Smooth transitions */
input:focus,
button:focus {
  outline: none;
}

button {
  transition: all 0.3s ease-out;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>