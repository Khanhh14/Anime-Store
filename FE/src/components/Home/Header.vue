<template>
  <header class="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
    <div class="mx-auto px-4 sm:px-6 md:px-8" :style="{ maxWidth: '1376px' }">
      <div class="flex items-center justify-between h-16">
        
        <!-- Logo (Bấm vào về Trang chủ) -->
        <div class="flex items-center flex-shrink-0">
          <router-link
            to="/"
            class="inline-flex items-center justify-center text-rose-500 hover:text-rose-600 transition-colors duration-300 focus:outline-none"
            aria-label="Logo"
          >
            <span class="text-2xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              ANIME
            </span>
          </router-link>
        </div>

        <!-- Navigation Menu Desktop (Dùng router-link) -->
        <nav class="hidden md:flex items-center space-x-1">
          <router-link
            v-for="link in navLinks"
            :key="link.id"
            :to="link.path"
            class="px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-300 relative group"
            active-class="text-rose-500 font-bold"
          >
            <span class="relative z-10 bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-300 dark:to-gray-100 bg-clip-text text-transparent group-hover:from-rose-500 group-hover:to-pink-500 transition-all duration-300">
              {{ link.label }}
            </span>
            <div class="absolute bottom-1 left-3 right-3 h-0.5 bg-gradient-to-r from-rose-500 to-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </router-link>
        </nav>

        <!-- Nút Tìm kiếm, User Avatar / Nút Đăng nhập -->
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

          <!-- Khi ĐÃ đăng nhập -->
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
                  <p class="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate">
                    {{ authStore.user?.email || 'User' }}
                  </p>
                </div>

                <div class="py-2">
                  <button
                    @click="handleViewProfile"
                    class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-3 cursor-pointer"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Xem thông tin</span>
                  </button>

                  <button
                    @click="handleLogout"
                    class="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 flex items-center space-x-3 cursor-pointer"
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

          <!-- Khi CHƯA đăng nhập -->
          <template v-else>
            <router-link
              to="/login"
              class="inline-flex items-center justify-center rounded-lg px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 font-semibold text-sm hover:border-rose-500 hover:text-rose-500 dark:hover:border-rose-400 dark:hover:text-rose-400 transition-all duration-300 hover:shadow-md"
            >
              {{ loginText }}
            </router-link>

            <router-link
              to="/register"
              class="inline-flex items-center justify-center rounded-lg px-5 py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-rose-500/50 font-semibold text-white text-sm hover:scale-105 active:scale-95"
            >
              {{ signupText }}
            </router-link>
          </template>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden flex items-center space-x-2">
          <button
            class="inline-flex items-center justify-center p-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-rose-50 transition-all duration-300"
            @click="$emit('search-click')"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <button
            class="inline-flex items-center justify-center p-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-rose-50 transition-all duration-300"
            @click="mobileMenuOpen = !mobileMenuOpen"
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

    <!-- Mobile Dropdown Navigation -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div class="px-4 sm:px-6 py-4 space-y-3">
          <router-link
            v-for="link in navLinks"
            :key="link.id"
            :to="link.path"
            @click="mobileMenuOpen = false"
            class="block w-full text-left px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 font-semibold hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all duration-300"
          >
            {{ link.label }}
          </router-link>
          
          <div v-if="authStore.isLoggedIn" class="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
            <button
              @click="mobileMenuOpen = false; handleViewProfile()"
              class="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 text-sm font-semibold"
            >
              Xem thông tin
            </button>
            <button
              @click="mobileMenuOpen = false; handleLogout()"
              class="block w-full text-left px-3 py-2 text-red-600 dark:text-red-400 text-sm font-semibold"
            >
              Đăng xuất
            </button>
          </div>

          <template v-else>
            <router-link
              to="/login"
              @click="mobileMenuOpen = false"
              class="block w-full text-center px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 font-semibold text-sm"
            >
              {{ loginText }}
            </router-link>

            <router-link
              to="/register"
              @click="mobileMenuOpen = false"
              class="block w-full text-center px-3 py-2 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold text-sm"
            >
              {{ signupText }}
            </router-link>
          </template>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router' 
import { useAuthStore } from '@/stores/auth'

defineProps({
  // Đã cập nhật đúng đường dẫn `path` trùng khớp với router/index.js
  navLinks: {
    type: Array,
    default: () => [
      { id: 'home', label: 'Trang chủ', path: '/' },
      { id: 'collections', label: 'Bộ sưu tập', path: '/collections' },
      { id: 'anime', label: 'Anime', path: '/anime' }, // Đường dẫn trỏ thẳng tới trang Anime mới tạo
      { id: 'about', label: 'Về chúng tôi', path: '/about' },
      { id: 'contact', label: 'Liên hệ', path: '/about' }
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
const authStore = useAuthStore()

const emit = defineEmits(['search-click', 'logout', 'view-profile'])

const handleViewProfile = () => {
  userMenuOpen.value = false
  emit('view-profile')
  router.push('/dashboard') 
}

const handleLogout = () => {
  userMenuOpen.value = false
  authStore.logout() 
  localStorage.removeItem('rememberMe') 
  emit('logout')
  router.push('/login')
}
</script>

<style scoped>
header {
  position: sticky;
  top: 0;
  z-index: 50;
}
</style>