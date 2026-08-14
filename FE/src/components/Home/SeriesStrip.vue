<!-- src/views/HomeView.vue -->
<template>
  <div class="w-full bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950/20 min-h-screen">
    
    <!-- ================= DANH MỤC SẢN PHẨM ================= -->
    <section class="max-w-[1376px] mx-auto px-4 py-16">
      <div class="text-center mb-12">
        <span class="text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 px-4 py-1.5 rounded-full inline-block mb-3">
          🎯 Danh Mục
        </span>
        <h2 class="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
          Khám Phá Theo
          <span class="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Thể Loại
          </span>
        </h2>
        <p class="text-gray-500 dark:text-gray-400 mt-2">Tìm mô hình anime yêu thích của bạn</p>
      </div>

      <!-- Trạng thái Loading Danh mục -->
      <div v-if="isLoadingCategories" class="flex flex-wrap justify-center gap-4 md:gap-6">
        <div v-for="i in 5" :key="i" class="w-full sm:w-48 h-56 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
      </div>

      <!-- Danh sách 5 Danh mục căn giữa cân bằng -->
      <div v-else class="flex flex-wrap justify-center items-center gap-4 md:gap-6">
        <div 
          v-for="(cat, i) in categoriesWithFixedImages" 
          :key="cat.id || i"
          @click="goToCategory(cat.id)"
          class="group relative w-[calc(50%-8px)] sm:w-48 lg:w-52 aspect-square bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-indigo-400 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 cursor-pointer flex-shrink-0"
        >
          <!-- Ảnh Logo Danh Mục -->
          <img 
            :src="cat.displayImage" 
            :alt="cat.name" 
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            @error="handleCategoryImageError"
          />

          <!-- Lớp Phủ Tên + Số Lượng Sản Phẩm Thực Từ CSDL -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
            <div>
              <p class="text-white font-bold text-sm leading-tight">{{ cat.name }}</p>
              <p class="text-white/70 text-xs mt-1">{{ cat.products_count || cat.count || 0 }} sản phẩm</p>
            </div>
          </div>

          <!-- Tag Nhãn (Hot, Best, New...) -->
          <div v-if="cat.tag" class="absolute top-2.5 right-2.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-indigo-600 dark:text-indigo-400 shadow-sm">
            {{ cat.tag }}
          </div>
        </div>
      </div>
    </section>

    <!-- ================= SẢN PHẨM BÁN CHẠY (TOP 4) ================= -->
    <section class="max-w-[1376px] mx-auto px-4 py-16">
      <div class="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
        <div>
          <span class="text-sm font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 px-4 py-1.5 rounded-full inline-block mb-3">
            🔥 Hot Trend
          </span>
          <h2 class="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
            Sản Phẩm
            <span class="bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
              Bán Chạy
            </span>
          </h2>
        </div>
      </div>

      <!-- Trạng thái Loading Sản phẩm -->
      <div v-if="isLoadingTopSelling" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="i in 4" :key="i" class="h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
      </div>

      <!-- Trạng thái không có sản phẩm -->
      <div v-else-if="topSellingProducts.length === 0" class="text-center py-12 text-gray-500">
        Chưa có dữ liệu sản phẩm bán chạy.
      </div>

      <!-- Danh sách Top 4 Sản phẩm Bán Chạy -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="product in topSellingProducts" 
          :key="product.id"
          class="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-rose-400 transition-all duration-300 hover:shadow-2xl hover:shadow-rose-500/10 hover:-translate-y-2 cursor-pointer"
          @click="goToProductDetail(product.id)"
        >
          <div class="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            <img 
              :src="getImageUrl(product.image)" 
              :alt="product.name" 
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              @error="handleProductImageError"
            />
            
            <div v-if="product.discount_percent" class="absolute top-3 left-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              -{{ product.discount_percent }}%
            </div>

            <div v-if="product.total_sold" class="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-medium">
              🔥 Đã bán {{ product.total_sold }}
            </div>

            <div class="absolute top-3 right-3 flex flex-col gap-2" @click.stop>
              <button class="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-md">
                ❤️
              </button>
            </div>
            
            <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" @click.stop>
              <button class="w-full bg-white text-gray-900 font-bold py-2 rounded-xl hover:bg-rose-500 hover:text-white transition-all">
                Thêm vào giỏ
              </button>
            </div>
          </div>

          <div class="p-4 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs text-indigo-600 dark:text-indigo-400 font-medium truncate">{{ product.brand_name || 'Anime Figure' }}</span>
              <div class="flex items-center gap-1 text-yellow-400 text-sm">
                ⭐ {{ product.avg_rating || '5.0' }}
              </div>
            </div>
            
            <h3 class="font-bold text-gray-800 dark:text-gray-100 text-sm group-hover:text-rose-500 transition-colors line-clamp-2">
              {{ product.name }}
            </h3>
            
            <div class="flex items-center gap-2">
              <span class="text-lg font-bold text-rose-500">{{ formatPrice(product.price) }}</span>
              <span v-if="product.old_price" class="text-sm text-gray-400 line-through">{{ formatPrice(product.old_price) }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="text-center mt-10">
        <button @click="goToCollections" class="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-full hover:scale-105 transition-all shadow-lg hover:shadow-indigo-500/30 cursor-pointer">
          Xem Tất Cả Sản Phẩm
        </button>
      </div>
    </section>

    <!-- ================= 3 ĐÁNH GIÁ 5 SAO TỪ CSDL ================= -->
    <section class="max-w-[1376px] mx-auto px-4 py-16">
      <div class="text-center mb-12">
        <span class="text-sm font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-4 py-1.5 rounded-full inline-block mb-3">
          ⭐ Trải Nghiệm Thực Tế
        </span>
        <h2 class="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
          Đánh Giá 5 Sao
          <span class="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
            Nổi Bật
          </span>
        </h2>
      </div>

      <div v-if="isLoadingReviews" class="flex flex-col items-center justify-center py-12 text-slate-400 text-sm">
        <div class="w-8 h-8 border-3 border-pink-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p class="font-medium">Đang tải trải nghiệm từ người mua...</p>
      </div>

      <div v-else-if="topReviews.length === 0" class="text-center py-12 px-4 bg-gradient-to-b from-slate-50/80 to-white dark:from-gray-900 dark:to-gray-800 rounded-3xl border border-dashed border-slate-200 dark:border-gray-800">
        <div class="w-16 h-16 bg-pink-50 dark:bg-pink-950/30 text-pink-500 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 shadow-sm">
          💬
        </div>
        <p class="text-slate-700 dark:text-gray-200 font-bold text-base mb-1">Chưa có đánh giá 5 sao nào</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          v-for="review in topReviews" 
          :key="review.id"
          class="group bg-white dark:bg-gray-900 p-5 sm:p-6 rounded-2xl border border-slate-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-pink-100 transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-center gap-3.5">
                <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 text-white font-extrabold flex items-center justify-center text-base shadow-md shadow-pink-500/20 flex-shrink-0 transform group-hover:scale-105 transition-transform duration-300">
                  {{ getAvatarText(getUserDisplayName(review)) }}
                </div>
                
                <div>
                  <div class="flex items-center gap-2">
                    <h4 class="font-extrabold text-slate-800 dark:text-gray-100 text-sm tracking-tight">
                      {{ getUserDisplayName(review) }}
                    </h4>
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                      <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                      Đã mua hàng
                    </span>
                  </div>

                  <div class="flex items-center gap-1 text-amber-400 text-sm mt-1">
                    <span v-for="star in 5" :key="star">★</span>
                    <span class="text-xs font-bold text-slate-400 ml-1.5">(5/5)</span>
                  </div>
                </div>
              </div>

              <span class="text-slate-400 text-xs font-medium bg-slate-50 dark:bg-gray-800 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-gray-700 flex-shrink-0">
                {{ formatDate(review.created_at) }}
              </span>
            </div>

            <div class="mt-4">
              <div class="bg-slate-50/80 dark:bg-gray-800/50 rounded-xl p-3.5 border border-slate-100/80 dark:border-gray-700/50 group-hover:bg-pink-50/20 group-hover:border-pink-100/50 transition-colors">
                <p class="text-slate-700 dark:text-gray-300 text-sm leading-relaxed font-normal">
                  {{ review.comment || 'Khách hàng không để lại bình luận chi tiết.' }}
                </p>
              </div>
            </div>
          </div>

          <div v-if="review.product_name" class="mt-4 pt-3 border-t border-slate-100 dark:border-gray-800 flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-bold truncate">
            <span>🛒 {{ review.product_name }}</span>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

// Bảng ánh xạ linh hoạt hỗ trợ nhiều kiểu đặt tên khác nhau cho 5 Danh Mục
const categoryMapping = {
  'onepiece': { image: '/images/onepiece.jpg', tag: 'OP' },
  'dragonball': { image: '/images/dragonball.jpg', tag: '7B' },
  'naruto': { image: '/images/naruto.jpg', tag: 'Nar' },
  'demonslayer': { image: '/images/demonslayer.jpg', tag: 'DML' },
  'demonslayerkimetsunoyaiba': { image: '/images/demonslayer.jpg', tag: 'DML' },
  'attackontitan': { image: '/images/aot.jpg', tag: 'AOT' },
  'aot': { image: '/images/aot.jpg', tag: 'AOT' }
}

// ================= STATE DỮ LIỆU =================
const categories = ref([])
const isLoadingCategories = ref(true)

const topSellingProducts = ref([])
const isLoadingTopSelling = ref(true)

const topReviews = ref([])
const isLoadingReviews = ref(true)

// Tự động gán Logo chuẩn dựa trên Tên Danh Mục từ CSDL
const categoriesWithFixedImages = computed(() => {
  if (!categories.value || categories.value.length === 0) return []
  
  return categories.value.map(cat => {
    // Làm sạch tên danh mục: "Demon Slayer" -> "demonslayer"
    const cleanName = cat.name ? cat.name.toLowerCase().replace(/[^a-z0-9]/g, '') : ''
    const match = categoryMapping[cleanName]
    
    return {
      ...cat,
      displayImage: match ? match.image : (cat.image ? getImageUrl(cat.image) : '/images/demonslayer.jpg'),
      tag: match ? match.tag : null
    }
  })
})

// ================= API CALLS =================

// 1. Lấy danh mục kèm số lượng sản phẩm từ Backend
const fetchCategories = async () => {
  isLoadingCategories.value = true
  try {
    const response = await axios.get('http://localhost:3000/api/categories')
    if (response.data && response.data.success) {
      categories.value = response.data.data
    } else if (Array.isArray(response.data)) {
      categories.value = response.data
    }
  } catch (error) {
    console.error('Lỗi khi tải danh mục:', error)
  } finally {
    isLoadingCategories.value = false
  }
}

// 2. Lấy 4 Sản phẩm bán chạy nhất
const fetchTopSellingProducts = async () => {
  isLoadingTopSelling.value = true
  try {
    const response = await axios.get('http://localhost:3000/api/products/top-selling')
    if (response.data && response.data.success) {
      topSellingProducts.value = response.data.data.slice(0, 4)
    } else if (Array.isArray(response.data)) {
      topSellingProducts.value = response.data.slice(0, 4)
    }
  } catch (error) {
    console.error('Lỗi khi tải sản phẩm bán chạy:', error)
  } finally {
    isLoadingTopSelling.value = false
  }
}

// 3. Lấy 3 Đánh giá 5 sao
const fetchTopFiveStarReviews = async () => {
  isLoadingReviews.value = true
  try {
    const response = await axios.get('http://localhost:3000/api/reviews/top-five-stars')
    if (response.data && response.data.success) {
      topReviews.value = response.data.data.slice(0, 3)
    }
  } catch (error) {
    console.error('Lỗi khi tải đánh giá 5 sao:', error)
  } finally {
    isLoadingReviews.value = false
  }
}

// ================= HELPER FUNCTIONS =================

const goToCollections = () => router.push({ name: 'collections' })
const goToCategory = (id) => router.push({ name: 'collections', query: { category: id } })
const goToProductDetail = (id) => router.push({ name: 'product-detail', params: { id } })

const formatPrice = (price) => {
  if (!price) return '0 ₫'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

const getImageUrl = (imageName) => {
  if (!imageName) return '/images/demonslayer.jpg'
  if (imageName.startsWith('http') || imageName.startsWith('/images/')) return imageName
  return `http://localhost:3000/uploads/${imageName}`
}

const handleCategoryImageError = (e) => {
  e.target.src = '/images/demonslayer.jpg'
}

const handleProductImageError = (e) => {
  e.target.src = '/images/hero.jpg'
}

const getUserDisplayName = (review) => review.user_name || review.user_username || (review.user_id ? `Khách hàng #${review.user_id}` : 'Khách hàng')
const getAvatarText = (name) => name ? String(name).trim().charAt(0).toUpperCase() : 'K'
const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('vi-VN') : ''

onMounted(() => {
  fetchCategories()
  fetchTopSellingProducts()
  fetchTopFiveStarReviews()
})
</script>

<style scoped>
.animate-spin {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>