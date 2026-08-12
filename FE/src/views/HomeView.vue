<!-- src/views/HomeView.vue -->
<template>
  <div class="min-h-screen bg-white text-gray-900 flex flex-col">
    <!-- Header Component -->
    <Header 
      @logo-click="handleLogoClick"
      @nav-click="handleNavClick"
      @search-click="handleSearchClick"
      @login="handleLogin"
      @signup="handleSignup"
      @logout="handleLogout"
      @view-profile="handleViewProfile"
    />

    <!-- Main Content: Hero Banner mới -->
    <main class="flex-1 min-h-screen">
      <section class="relative overflow-hidden bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 dark:from-rose-800 dark:via-purple-800 dark:to-indigo-800">
        <div class="absolute inset-0 opacity-10">
          <div class="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div class="absolute bottom-0 right-0 w-96 h-96 bg-pink-400 rounded-full blur-3xl"></div>
        </div>
        
        <div class="max-w-[1376px] mx-auto px-4 py-16 md:py-20 relative">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <!-- Cột trái: Văn bản & Nút thao tác -->
            <div class="text-white space-y-6">
              <div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
              </div>
              <h1 class="text-4xl md:text-6xl font-extrabold leading-tight">
                Sưu Tầm Mô Hình
                <span class="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                  Anime Chính Hãng
                </span>
              </h1>
              <p class="text-lg text-white/80 max-w-lg">
                Hàng ngàn mô hình anime chất lượng cao, độc quyền từ các thương hiệu nổi tiếng Nhật Bản
              </p>
              <div class="flex flex-wrap gap-4">
                <!-- Nút Mua Ngay: Chuyển sang trang bộ sưu tập -->
                <button 
                  @click="goToCollections"
                  class="group px-8 py-3 bg-white text-purple-600 font-bold rounded-full hover:scale-105 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 cursor-pointer"
                >
                  Mua Ngay
                  <span class="group-hover:translate-x-1 transition-transform">→</span>
                </button>
                
                <!-- Nút Xem Bộ Sưu Tập: Chuyển sang trang bộ sưu tập -->
                <button 
                  @click="goToCollections"
                  class="px-8 py-3 border-2 border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition-all backdrop-blur-sm cursor-pointer"
                >
                  Xem Bộ Sưu Tập
                </button>
              </div>

              <!-- Thống kê động từ CSDL -->
              <div class="flex items-center gap-8 pt-4">
                <div>
                  <p class="text-2xl font-bold">
                    <span v-if="isLoadingStats" class="animate-pulse">...</span>
                    <span v-else>{{ stats.products.toLocaleString('vi-VN') }}+</span>
                  </p>
                  <p class="text-sm text-white/60">Sản phẩm</p>
                </div>
                <div>
                  <p class="text-2xl font-bold">
                    <span v-if="isLoadingStats" class="animate-pulse">...</span>
                    <span v-else>{{ stats.brands.toLocaleString('vi-VN') }}+</span>
                  </p>
                  <p class="text-sm text-white/60">Thương hiệu</p>
                </div>
                <div>
                  <p class="text-2xl font-bold">
                    <span v-if="isLoadingStats" class="animate-pulse">...</span>
                    <span v-else>{{ stats.users.toLocaleString('vi-VN') }}+</span>
                  </p>
                  <p class="text-sm text-white/60">Khách hàng</p>
                </div>
              </div>
            </div>
            
            <!-- Cột phải: Hình ảnh Hero -->
            <div class="relative hidden lg:block">
              <div class="relative w-full aspect-square max-w-lg mx-auto">
                <div class="absolute inset-0 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
                
                <img 
                  :src="heroBg" 
                  alt="Anime Figure Collection" 
                  class="relative w-full h-full object-contain drop-shadow-2xl animate-float"
                />
                
                <div class="absolute -top-4 -right-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded-2xl rotate-12 shadow-xl font-bold text-sm animate-bounce-slow">
                  🔥 Hot Deal
                </div>
                <div class="absolute -bottom-4 -left-4 bg-white text-purple-600 px-4 py-2 rounded-2xl -rotate-6 shadow-xl font-bold text-sm">
                  ✨ Free Ship
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SeriesStrip />
    </main>

    <!-- Footer Component -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Header from '@/components/Home/Header.vue'
import SeriesStrip from '@/components/Home/SeriesStrip.vue'
import Footer from '@/components/Home/Footer.vue'

const router = useRouter()
const heroBg = '/images/hero.jpg'

// Điều hướng tới trang bộ sưu tập
const goToCollections = () => {
  router.push({ name: 'collections' })
}

// Biến lưu trữ dữ liệu thống kê từ CSDL
const stats = ref({
  products: 0,
  brands: 0,
  users: 0
})
const isLoadingStats = ref(true)

// Hàm gọi API lấy số liệu thực tế
const fetchStats = async () => {
  isLoadingStats.value = true
  try {
    const response = await axios.get('http://localhost:3000/api/stats/overview')
    if (response.data && response.data.success) {
      stats.value = response.data.data
    }
  } catch (error) {
    console.error('Lỗi khi tải số liệu thống kê:', error)
    stats.value = { products: 500, brands: 50, users: 10000 }
  } finally {
    isLoadingStats.value = false
  }
}

onMounted(() => {
  fetchStats()
})

// Handle Header Events
const handleLogoClick = () => {
  console.log('Logo clicked')
}

const handleNavClick = (linkId) => {
  console.log('Navigation clicked:', linkId)
  if (linkId === 'home') {
    router.push({ name: 'home' })
  } else if (linkId === 'collections') {
    router.push({ name: 'collections' })
  } else if (linkId === 'series') {
    console.log('Navigate to series')
  } else if (linkId === 'about') {
    router.push({ name: 'about' })
  } else if (linkId === 'contact') {
    console.log('Navigate to contact')
  }
}

const handleSearchClick = () => {
  console.log('Search clicked')
}

const handleLogin = () => {
  router.push({ name: 'login' })
}

const handleSignup = () => {
  router.push({ name: 'register' })
}

const handleLogout = () => {
  window.location.reload()
}

const handleViewProfile = () => {
  router.push({ name: 'dashboard' })
}
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(-3deg); }
  50% { transform: translateY(-20px) rotate(3deg); }
}

@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}
</style>