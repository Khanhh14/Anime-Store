<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50/30 font-sans selection:bg-rose-500 selection:text-white">
    <!-- Background Animated Elements -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-1/4 -right-24 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
    </div>

    <!-- Header -->
    <Header 
      @logo-click="handleLogoClick"
      @nav-click="handleNavClick"
      @search-click="handleSearchClick"
      @login="handleLogin"
      @signup="handleSignup"
    />

    <main class="min-h-screen relative z-10 pb-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        
        <!-- Hero Section -->
        <div class="text-center mb-10">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold tracking-wider uppercase mb-4 shadow-sm animate-fade-in">
            <span> SẢN PHẨM CHÍNH HÃNG</span>
          </div>
          <h1 class="text-4xl sm:text-6xl font-black tracking-tight text-gray-900 mb-4">
            Thế Giới <span class="bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 bg-clip-text text-transparent">ANIME</span> Cao Cấp
          </h1>
          <p class="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto font-medium">
            Khám phá bộ sưu tập mô hình & phụ kiện Anime độc quyền với mức giá tốt nhất
          </p>
        </div>

        <!-- THANH CÔNG CỤ: Ô TÌM KIẾM CẬP NHẬT TỨC THÌ & ICON PHỄU LỌC -->
        <div class="max-w-4xl mx-auto mb-10">
          <div class="flex items-center gap-3">
            
            <!-- Ô TÌM KIẾM (Nhập là tự động lọc ngay lập tức) -->
            <div class="relative flex-1">
              <input 
                :value="searchQuery"
                @input="onSearchInput"
                type="text"
                placeholder="Nhập tên sản phẩm để tìm ngay..."
                class="w-full pl-11 pr-10 py-3.5 bg-white/90 backdrop-blur-md border border-gray-200/80 rounded-2xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-500/10 transition-all font-semibold shadow-lg shadow-gray-200/40"
              />
              <svg class="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <button 
                v-if="searchQuery" 
                @click="searchQuery = ''" 
                class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 w-6 h-6 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
              >
                ✕
              </button>
            </div>

            <!-- NÚT ICON PHỄU LỌC BẬT/TẮT MENU -->
            <button 
              @click="isFilterOpen = !isFilterOpen"
              :class="[
                'flex items-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg duration-200 flex-shrink-0 border',
                isFilterOpen || hasActiveFilters
                  ? 'bg-rose-600 text-white border-rose-600 shadow-rose-500/25' 
                  : 'bg-white text-gray-700 border-gray-200/80 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 shadow-gray-200/40'
              ]"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
              </svg>
              <span class="hidden sm:inline">Bộ lọc</span>
              <span v-if="hasActiveFilters" class="w-2 h-2 rounded-full bg-white animate-ping"></span>
            </button>

          </div>

          <!-- PHẦN LỌC NÂNG CAO -->
          <Transition name="expand">
            <div 
              v-if="isFilterOpen" 
              class="mt-4 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-3xl p-6 shadow-2xl shadow-rose-500/5 space-y-6"
            >
              <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                <!-- Lọc Khoảng Giá (Slider) -->
                <div class="md:col-span-7 space-y-2">
                  <div class="flex justify-between items-center text-xs font-bold text-gray-700">
                    <span class="flex items-center gap-1">
                      <span> Lọc theo giá tối đa:</span>
                      <span class="text-rose-600 font-extrabold text-sm">{{ formatPrice(maxPriceFilter) }}</span>
                    </span>
                    <span class="text-gray-400 font-normal">Mốc cao nhất: {{ formatPrice(absoluteMaxPrice) }}</span>
                  </div>

                  <input 
                    type="range" 
                    :min="0" 
                    :max="absoluteMaxPrice" 
                    step="50000"
                    v-model.number="maxPriceFilter"
                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                  />

                  <!-- Tag Lọc Giá Nhanh -->
                  <div class="flex flex-wrap gap-1.5 pt-1">
                    <button 
                      v-for="preset in pricePresets" 
                      :key="preset.label"
                      @click="maxPriceFilter = preset.value"
                      :class="[
                        'px-3 py-1 rounded-lg text-[11px] font-bold transition-all border',
                        maxPriceFilter === preset.value 
                          ? 'bg-rose-600 text-white border-rose-600 shadow-sm' 
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-rose-50 hover:text-rose-600'
                      ]"
                    >
                      {{ preset.label }}
                    </button>
                  </div>
                </div>

                <!-- Sắp xếp giá -->
                <div class="md:col-span-5">
                  <label class="block text-xs font-bold text-gray-700 mb-1.5">↕ Sắp xếp sản phẩm</label>
                  <select 
                    v-model="sortOption"
                    class="w-full py-2.5 px-4 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold text-gray-700 focus:outline-none focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-500/10 cursor-pointer"
                  >
                    <option value="default">Mặc định mới nhất</option>
                    <option value="price-asc">Giá: Thấp đến Cao</option>
                    <option value="price-desc">Giá: Cao đến Thấp</option>
                  </select>
                </div>

              </div>

              <!-- Nút Xóa / Đặt Lại Bộ Lọc -->
              <div class="pt-3 border-t border-gray-100 flex justify-between items-center text-xs font-semibold text-gray-500">
                <span>Đang hiển thị <strong class="text-rose-600 font-bold">{{ filteredCollections.length }}</strong> sản phẩm</span>
                <button 
                  v-if="hasActiveFilters" 
                  @click="resetFilters" 
                  class="text-rose-600 hover:underline flex items-center gap-1 font-bold"
                >
                   Đặt lại mặc định
                </button>
              </div>

            </div>
          </Transition>
        </div>

        <!-- LOADING STATE -->
        <div v-if="loading" class="text-center py-32">
          <div class="inline-flex flex-col items-center">
            <div class="relative w-16 h-16">
              <div class="absolute inset-0 rounded-full border-4 border-rose-200 animate-ping"></div>
              <div class="rounded-full h-16 w-16 border-4 border-rose-600 border-t-transparent animate-spin"></div>
            </div>
            <p class="text-gray-700 font-bold text-base mt-6 tracking-wide">Đang tải vũ trụ Anime...</p>
          </div>
        </div>

        <!-- EMPTY STATE -->
        <div v-else-if="filteredCollections.length === 0" class="text-center py-20">
          <div class="bg-white rounded-3xl shadow-xl p-12 max-w-lg mx-auto border border-gray-100/80">
            <div class="w-20 h-20 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl"></div>
            <p class="text-gray-900 text-xl font-black">Không tìm thấy sản phẩm</p>
            <p class="text-gray-500 text-sm mt-2">Thử thay đổi mức giá hoặc từ khóa tìm kiếm của bạn xem sao!</p>
            <button 
              @click="resetFilters" 
              class="mt-6 px-6 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-rose-500/20 hover:scale-105 transition-all"
            >
              Xem tất cả sản phẩm
            </button>
          </div>
        </div>

        <!-- PRODUCT GRID -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            v-for="(product, index) in filteredCollections"
            :key="product.id"
            class="group bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-2xl hover:shadow-rose-500/10 transition-all duration-500 overflow-hidden flex flex-col transform hover:-translate-y-2"
            :style="{ animationDelay: `${index * 30}ms` }"
            style="animation: slideUp 0.4s ease-out forwards;"
          >
            <!-- Image Area -->
            <div class="relative h-64 bg-gray-50 overflow-hidden">
              <img
                v-if="product.image"
                :src="product.image"
                :alt="product.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                @error="(e) => handleImageError(e, product.id)"
                loading="lazy"
              />
              <div v-else :id="`placeholder-${product.id}`" class="w-full h-full flex items-center justify-center bg-gray-100">
                <svg class="w-16 h-16 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"></path>
                </svg>
              </div>

              <!-- NÚT TRÁI TIM YÊU THÍCH (Góc trên bên phải) -->
              <button 
                @click.stop="toggleWishlist(product.id)"
                class="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white active:scale-90"
                :title="isWishlisted(product.id) ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'"
              >
                <!-- Tim đặc màu đỏ (fas) -->
                <font-awesome-icon 
                  v-if="isWishlisted(product.id)" 
                  :icon="['fas', 'heart']" 
                  class="text-rose-600 text-lg animate-fade-in" 
                />
                <!-- Tim rỗng viền xám (far) -->
                <font-awesome-icon 
                  v-else 
                  :icon="['far', 'heart']" 
                  class="text-gray-400 hover:text-rose-500 text-lg transition-colors" 
                />
              </button>

              <!-- CATEGORY TAG (Góc trên bên trái) -->
              <div class="absolute top-3 left-3 z-10">
                <span class="px-3 py-1 rounded-full text-[11px] font-bold bg-white/90 backdrop-blur-md text-gray-800 shadow-md border border-white/40">
                  {{ product.category?.name || product.category_name || 'Anime' }}
                </span>
              </div>
            </div>

<!-- Content Area -->
            <div class="p-4 flex-1 flex flex-col justify-between bg-white">
              <div>
                <!-- Tên sản phẩm -->
                <h3 class="text-sm font-bold text-gray-800 line-clamp-2 group-hover:text-rose-600 transition-colors duration-200 leading-snug">
                  {{ product.name }}
                </h3>

                <!-- DÒNG GIÁ TIỀN & SỐ LƯỢNG HÀNG TỒN (Chung 1 dòng) -->
                <div class="mt-2 mb-3 flex items-center justify-between gap-2">
                  <!-- Giá tiền bên trái -->
                  <span class="text-xl font-black bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                    {{ formatPrice(product.price) }}
                  </span>

                  <!-- Số lượng hàng bên phải -->
                  <span 
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0"
                    :class="product.stock > 0 ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60' : 'bg-rose-50 text-rose-600 border border-rose-200/60'"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" :class="product.stock > 0 ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                    {{ product.stock > 0 ? `Còn ${product.stock}` : 'Hết hàng' }}
                  </span>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-2 pt-2.5 border-t border-gray-100">
                <button
                  @click="selectCollection(product)"
                  class="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-2 px-3 rounded-xl transition-all duration-200 text-xs border border-gray-200 active:scale-95"
                >
                  Chi Tiết
                </button>
                <button
                  :disabled="product.stock <= 0"
                  @click="handleBuyNow(product)"
                  class="flex-1 font-bold py-2 px-3 rounded-xl transition-all duration-200 text-xs shadow-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
                  :class="product.stock > 0 
                    ? 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white shadow-rose-500/25' 
                    : 'bg-gray-200 text-gray-500'"
                >
                  Mua Ngay
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/Home/Header.vue'

const router = useRouter()
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const baseUrl = apiUrl.replace('/api', '') 

const collections = ref([])
const loading = ref(false)
const wishlistIds = ref(new Set())

// TRẠNG THÁI BỘ LỌC
const isFilterOpen = ref(false)
const searchQuery = ref('')
const maxPriceFilter = ref(10000000)
const absoluteMaxPrice = ref(10000000)
const sortOption = ref('default')

// Mức giá chọn nhanh
const pricePresets = [
  { label: 'Tất cả', value: 10000000 },
  { label: '< 500k', value: 500000 },
  { label: '< 1 Triệu', value: 1000000 },
  { label: '< 3 Triệu', value: 3000000 },
]

const onSearchInput = (event) => {
  searchQuery.value = event.target.value
}

const hasActiveFilters = computed(() => {
  return searchQuery.value.trim() !== '' || 
         maxPriceFilter.value < absoluteMaxPrice.value || 
         sortOption.value !== 'default'
})

const buildImageUrl = (imagePath) => {
  if (!imagePath) return null
  if (imagePath.startsWith('http')) return imagePath
  return `${baseUrl}/uploads/${imagePath}`
}

// Lấy danh sách ID các sản phẩm đã yêu thích
const fetchWishlist = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return

    const response = await fetch(`${apiUrl}/wishlist`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await response.json()
    if (data.success) {
      wishlistIds.value = new Set(data.data.map(item => item.product_id || item.id))
    }
  } catch (error) {
    console.error('Lỗi lấy danh sách wishlist:', error)
  }
}

// Bật/Tắt trạng thái yêu thích
const toggleWishlist = async (productId) => {
  const token = localStorage.getItem('token')
  if (!token) {
    alert('Vui lòng đăng nhập để lưu sản phẩm yêu thích!')
    router.push({ name: 'login' })
    return
  }

  // Cập nhật UI ngay lập tức (Optimistic Update)
  if (wishlistIds.value.has(productId)) {
    wishlistIds.value.delete(productId)
  } else {
    wishlistIds.value.add(productId)
  }
  wishlistIds.value = new Set(wishlistIds.value)

  try {
    const response = await fetch(`${apiUrl}/wishlist/toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ product_id: productId })
    })
    const resData = await response.json()
    if (!resData.success) {
      fetchWishlist()
    }
  } catch (error) {
    console.error('Lỗi khi toggle wishlist:', error)
    fetchWishlist()
  }
}

const isWishlisted = (productId) => {
  return wishlistIds.value.has(productId)
}

const fetchCollections = async () => {
  loading.value = true
  try {
    const response = await fetch(`${apiUrl}/products`)
    const data = await response.json()
    
    if (data.success) {
      collections.value = data.data.map(product => ({
        ...product,
        price: Number(product.price) || 0,
        image: buildImageUrl(product.image)
      }))

      if (collections.value.length > 0) {
        const highestPrice = Math.max(...collections.value.map(p => p.price))
        absoluteMaxPrice.value = highestPrice > 0 ? highestPrice : 10000000
        maxPriceFilter.value = absoluteMaxPrice.value
      }
    }
  } catch (error) {
    console.error('Error fetching products:', error)
  } finally {
    loading.value = false
  }
}

const filteredCollections = computed(() => {
  return collections.value
    .filter(product => {
      const query = searchQuery.value.toLowerCase().trim()
      const matchesSearch = query === '' || product.name.toLowerCase().includes(query)
      const matchesPrice = product.price <= maxPriceFilter.value
      return matchesSearch && matchesPrice
    })
    .sort((a, b) => {
      if (sortOption.value === 'price-asc') return a.price - b.price
      if (sortOption.value === 'price-desc') return b.price - a.price
      return 0
    })
})

const resetFilters = () => {
  searchQuery.value = ''
  maxPriceFilter.value = absoluteMaxPrice.value
  sortOption.value = 'default'
}

const selectCollection = (product) => {
  router.push({
    name: 'DetailProducts', 
    params: { id: product.id }
  })
}

const handleBuyNow = (product) => {
  localStorage.setItem('buy_now_product', JSON.stringify(product))
  localStorage.setItem('buy_now_quantity', '1')
  router.push({ name: 'checkout' })
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price || 0)
}

const handleImageError = (event, id) => {
  event.target.style.display = 'none'
  const placeholder = document.getElementById(`placeholder-${id}`)
  if (placeholder && placeholder.querySelector('svg') === null) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('class', 'w-16 h-16 text-gray-300 mx-auto')
    svg.setAttribute('fill', 'currentColor')
    svg.setAttribute('viewBox', '0 0 20 20')
    svg.innerHTML = '<path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"></path>'
    placeholder.appendChild(svg)
  }
}

// Navigation Handlers
const handleLogoClick = () => router.push({ name: 'home' })
const handleNavClick = (linkId) => {
  if (linkId === 'home') router.push({ name: 'home' })
  else if (linkId === 'collections') router.push({ name: 'collections' })
  else if (linkId === 'about') router.push({ name: 'about' })
}
const handleSearchClick = () => console.log('Search clicked')
const handleLogin = () => router.push({ name: 'login' })
const handleSignup = () => router.push({ name: 'register' })

onMounted(() => {
  fetchCollections()
  fetchWishlist()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 300px;
  opacity: 1;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
  overflow: hidden;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>