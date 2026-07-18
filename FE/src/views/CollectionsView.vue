<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-rose-200 opacity-20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-200 opacity-20 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
    </div>

    <Header 
      @logo-click="handleLogoClick"
      @nav-click="handleNavClick"
      @search-click="handleSearchClick"
      @login="handleLogin"
      @signup="handleSignup"
    />

    <main class="min-h-screen relative z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="mb-12 text-center">
          <div class="inline-block mb-4">
            <span class="text-6xl">🎌</span>
          </div>
          <h1 class="text-6xl font-black bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-4 animate-fade-in">
            Sản Phẩm Anime
          </h1>
          <p class="text-gray-700 text-lg max-w-2xl mx-auto mb-2">Khám phá bộ sưu tập đầy đủ sản phẩm anime chính hãng của chúng tôi</p>
          <p class="text-gray-600 text-sm">{{ collections.length }} sản phẩm đang có sẵn</p>
        </div>

        <div v-if="loading" class="text-center py-32">
          <div class="inline-flex flex-col items-center">
            <div class="animate-spin rounded-full h-20 w-20 border-4 border-gray-300 border-t-rose-600 mb-4"></div>
            <p class="text-gray-700 font-semibold text-lg">Đang tải sản phẩm...</p>
          </div>
        </div>

        <div v-else-if="collections.length === 0" class="text-center py-32">
          <div class="bg-gradient-to-br from-white to-gray-100 rounded-3xl shadow-xl p-12 max-w-2xl mx-auto border border-gray-200">
            <svg class="w-24 h-24 mx-auto text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
            </svg>
            <p class="text-gray-800 text-2xl font-bold">Không có sản phẩm nào</p>
            <p class="text-gray-600 mt-2">Hãy quay lại sau để xem các sản phẩm mới</p>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            v-for="(product, index) in collections"
            :key="product.id"
            class="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-3 border border-gray-100"
            :style="{ animationDelay: `${index * 50}ms` }"
            style="animation: slideUp 0.6s ease-out forwards;"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500 blur-xl"></div>

            <div class="relative h-64 bg-gradient-to-br from-gray-200 to-gray-100 overflow-hidden border-b border-gray-200">
              <img
                v-if="product.image"
                :src="product.image"
                :alt="product.name"
                class="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700 saturate-100 group-hover:saturate-150"
                @error="(e) => handleImageError(e, product.id)"
                loading="lazy"
              />
              <div v-else :id="`placeholder-${product.id}`" class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-200">
                <svg class="w-24 h-24 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"></path>
                </svg>
              </div>
              
              <div class="absolute top-4 right-4">
                <span :class="[
                  'inline-block px-4 py-2 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm',
                  product.stock > 0 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                    : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                ]">
                  {{ product.stock > 0 ? `✅ ${product.stock}` : '❌ Hết' }}
                </span>
              </div>

              <div class="absolute top-4 left-4">
                <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
                  Anime
                </span>
              </div>
            </div>

            <div class="p-6 relative z-10">
              <h3 class="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-rose-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all duration-300">{{ product.name }}</h3>

              <div class="mb-5 pb-5 border-b border-gray-200">
                <p class="text-3xl font-black bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">{{ formatPrice(product.price) }}</p>
              </div>

              <div class="flex gap-2 transition-opacity duration-300">
                <button
                  @click="selectCollection(product)"
                  class="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-2 px-3 rounded-lg transition-all duration-200 text-sm shadow-lg hover:shadow-blue-500/50 transform hover:scale-105"
                >
                  📋 Chi Tiết
                </button>
                <button
                  :disabled="product.stock <= 0"
                  @click="handleBuyNow(product)"
                  class="flex-1 font-bold py-2 px-3 rounded-lg transition-all duration-200 text-sm shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transform hover:scale-105"
                  :class="product.stock > 0 
                    ? 'bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white hover:shadow-rose-500/50' 
                    : 'bg-gray-300 text-gray-500'"
                >
                  🛒 Mua
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/Home/Header.vue'

const router = useRouter()
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const baseUrl = apiUrl.replace('/api', '') // http://localhost:3000

const collections = ref([])
const loading = ref(false)

// Build full image URL
const buildImageUrl = (imagePath) => {
  if (!imagePath) return null
  
  // If already full URL, return as is
  if (imagePath.startsWith('http')) return imagePath
  
  // If it's just a filename or relative path, build complete URL
  return `${baseUrl}/uploads/${imagePath}`
}

// Fetch products on mount
const fetchCollections = async () => {
  loading.value = true
  try {
    const response = await fetch(`${apiUrl}/products`)
    const data = await response.json()
    
    if (data.success) {
      // Build full URLs for images
      collections.value = data.data.map(product => ({
        ...product,
        image: buildImageUrl(product.image)
      }))
      console.log('Products loaded:', collections.value)
    }
  } catch (error) {
    console.error('Error fetching products:', error)
  } finally {
    loading.value = false
  }
}

const selectCollection = (product) => {
  router.push({
    name: 'DetailProducts', 
    params: { id: product.id }
  })
}

// Hàm xử lý Mua ngay và chuyển tiếp sang trang checkout
const handleBuyNow = (product) => {
  // 1. Lưu sản phẩm và số lượng mặc định (1) vào localStorage
  localStorage.setItem('buy_now_product', JSON.stringify(product))
  localStorage.setItem('buy_now_quantity', '1')

  // 2. Chuyển hướng về trang Xác nhận đơn hàng (Đặt tên route cho khớp router/index.js của bạn)
  router.push({ name: 'checkout' })
}

// Format price to VND
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

const handleImageError = (event, id) => {
  event.target.style.display = 'none'
  const placeholder = document.getElementById(`placeholder-${id}`)
  if (placeholder && placeholder.querySelector('svg') === null) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('class', 'w-20 h-20 text-gray-400 mx-auto')
    svg.setAttribute('fill', 'currentColor')
    svg.setAttribute('viewBox', '0 0 20 20')
    svg.innerHTML = '<path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"></path>'
    placeholder.appendChild(svg)
  }
}

// Handle Header Events
const handleLogoClick = () => {
  router.push({ name: 'home' })
}

const handleNavClick = (linkId) => {
  if (linkId === 'home') {
    router.push({ name: 'home' })
  } else if (linkId === 'collections') {
    router.push({ name: 'collections' })
  } else if (linkId === 'about') {
    router.push({ name: 'about' })
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

// Fetch data on mount
fetchCollections()
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 1s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>