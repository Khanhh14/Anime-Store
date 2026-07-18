<template>
  <header class="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
    <div class="mx-auto px-4 sm:px-6 md:px-8" :style="{ maxWidth: '1376px' }">
      <div class="flex items-center justify-between h-16">
        
        <div class="flex items-center flex-shrink-0">
          <button
            class="inline-flex items-center justify-center text-rose-500 hover:text-rose-600 transition-colors duration-300 focus:outline-none"
            @click="$emit('logo-click')"
            aria-label="Logo"
          >
            <span class="text-2xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              ANIME
            </span>
          </button>
        </div>

        <nav class="hidden md:flex items-center space-x-1">
          <button
            v-for="link in navLinks"
            :key="link.id"
            class="px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 font-semibold text-sm transition-all duration-300 relative group"
            :aria-label="link.label"
            @click="$emit('nav-click', link.id)"
          >
            <span class="relative z-10 bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-300 dark:to-gray-100 bg-clip-text text-transparent group-hover:from-rose-500 group-hover:to-pink-500 transition-all duration-300">
              {{ link.label }}
            </span>
            <div class="absolute bottom-1 left-3 right-3 h-0.5 bg-gradient-to-r from-rose-500 to-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </button>
        </nav>

        <div class="hidden md:flex items-center space-x-3">
          <button
            class="inline-flex items-center justify-center p-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gradient-to-br hover:from-rose-50 hover:to-pink-50 dark:hover:from-rose-900/20 dark:hover:to-pink-900/20 transition-all duration-300 hover:shadow-md"
            @click="$emit('search-click')"
            aria-label="Search"
          >
            <svg class="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <div v-if="authStore.isLoggedIn" class="relative">
            <button
              @click="userMenuOpen = !userMenuOpen"
              class="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 transition-all duration-300 hover:shadow-md hover:shadow-rose-500/20"
              aria-label="User profile"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </button>

            <transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 scale-95 -translate-y-2"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 scale-100 translate-y-0"
              leave-to-class="opacity-0 scale-95 -translate-y-2"
            >
              <div
                v-if="userMenuOpen"
                class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-2xl z-50 overflow-hidden"
              >
                <div class="px-4 py-3 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border-b border-gray-200 dark:border-gray-700">
                  <p class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {{ authStore.user?.email || 'User' }}
                  </p>
                </div>

                <div class="py-2">
                  <button
                    @click="handleViewProfile"
                    class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-3"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Xem thông tin</span>
                  </button>

                  <button
                    @click="handleLogout"
                    class="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 flex items-center space-x-3"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            </transition>
          </div>

          <template v-else>
            <button
              class="inline-flex items-center justify-center rounded-lg px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 font-semibold text-sm hover:border-rose-500 hover:text-rose-500 dark:hover:border-rose-400 dark:hover:text-rose-400 transition-all duration-300 hover:shadow-md hover:shadow-rose-500/20"
              @click="$emit('login')"
            >
              {{ loginText }}
            </button>

            <button
              class="inline-flex items-center justify-center rounded-lg px-5 py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 active:from-rose-700 active:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-rose-500/50 font-semibold text-white text-sm hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-rose-400/50"
              @click="$emit('signup')"
            >
              {{ signupText }}
            </button>
          </template>
        </div>

        <div class="md:hidden flex items-center space-x-2">
          <button
            class="inline-flex items-center justify-center p-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gradient-to-br hover:from-rose-50 hover:to-pink-50 dark:hover:from-rose-900/20 dark:hover:to-pink-900/20 transition-all duration-300"
            @click="$emit('search-click')"
            aria-label="Search"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <button
            class="inline-flex items-center justify-center p-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gradient-to-br hover:from-rose-50 hover:to-pink-50 dark:hover:from-rose-900/20 dark:hover:to-pink-900/20 transition-all duration-300"
            @click="mobileMenuOpen = !mobileMenuOpen"
            aria-label="Toggle menu"
          >
            <svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-200 dark:border-gray-800">
        <div class="px-4 sm:px-6 py-4 space-y-3">
          <button
            v-for="link in navLinks"
            :key="link.id"
            class="block w-full text-left px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 font-semibold hover:bg-gradient-to-br hover:from-rose-50 hover:to-pink-50 dark:hover:from-rose-900/20 dark:hover:to-pink-900/20 transition-all duration-300 group"
            @click="mobileMenuOpen = false; $emit('nav-click', link.id)"
          >
            <span class="bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-300 dark:to-gray-100 group-hover:from-rose-500 group-hover:to-pink-500 bg-clip-text text-transparent transition-all duration-300">
              {{ link.label }}
            </span>
          </button>
          
          <div v-if="authStore.isLoggedIn" class="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
            <div class="px-3 py-2 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-lg mb-2">
              <p class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {{ authStore.user?.email || 'User' }}
              </p>
            </div>
            <button
              @click="mobileMenuOpen = false; handleViewProfile()"
              class="block w-full px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gradient-to-br hover:from-rose-50 hover:to-pink-50 dark:hover:from-rose-900/20 dark:hover:to-pink-900/20 transition-all duration-300 text-sm font-semibold flex items-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Xem thông tin</span>
            </button>
            <button
              @click="mobileMenuOpen = false; handleLogout()"
              class="block w-full px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 text-sm font-semibold flex items-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Đăng xuất</span>
            </button>
          </div>

          <template v-else>
            <button
              class="block w-full px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 font-semibold text-sm hover:border-rose-500 hover:text-rose-500 transition-all duration-300"
              @click="mobileMenuOpen = false; $emit('login')"
            >
              {{ loginText }}
            </button>

            <button
              class="block w-full px-3 py-2 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold text-sm transition-all duration-300"
              @click="mobileMenuOpen = false; $emit('signup')"
            >
              {{ signupText }}
            </button>
          </template>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router' 
import { useAuthStore } from '@/stores/auth' // 1. Import Pinia Store vừa tạo

defineProps({
  navLinks: {
    type: Array,
    default: () => [
      { id: 'home', label: 'Trang chủ' },
      { id: 'collections', label: 'Bộ sưu tập' },
      { id: 'series', label: 'Anime' },
      { id: 'about', label: 'Về chúng tôi' },
      { id: 'contact', label: 'Liên hệ' }
    ]
  },
  loginText: {
    type: String,
    default: 'Đăng nhập'
  },
  signupText: {
    type: String,
    default: 'Đăng ký'
  }
})

const mobileMenuOpen = ref(false)
const userMenuOpen = ref(false)

const router = useRouter() 
const authStore = useAuthStore() // 2. Kích hoạt Store để dùng trong template

const emit = defineEmits(['logo-click', 'nav-click', 'search-click', 'login', 'signup', 'logout', 'view-profile'])

const handleViewProfile = () => {
  userMenuOpen.value = false
  emit('view-profile')
  router.push('/dashboard') 
}

const handleLogout = () => {
  userMenuOpen.value = false
  
  // 3. Gọi hàm logout của Store (nó sẽ tự dọn dẹp localStorage giúp bạn)
  authStore.logout() 
  
  // Xóa thủ công thêm key rememberMe nếu bạn cần dọn sạch hoàn toàn
  localStorage.removeItem('rememberMe') 
  
  emit('logout')
}
</script>

<style scoped>
header {
  position: sticky;
  top: 0;
  z-index: 50;
}

button {
  transition: all 0.3s ease-out;
}
</style>