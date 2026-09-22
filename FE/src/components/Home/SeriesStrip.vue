<!-- src/views/HomeView.vue -->
<template>
  <div class="w-full bg-gradient-to-br from-slate-50 via-white to-rose-50/30 font-sans min-h-screen">
    
    <!-- ================= DANH MỤC SẢN PHẨM ================= -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center mb-12">
        <span class="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 mb-3 shadow-sm uppercase tracking-wider">
          <font-awesome-icon :icon="['fas', 'tags']" class="text-[11px]" />
          <span>Danh Mục</span>
        </span>
        <h2 class="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
          Khám Phá Theo
          <span class="bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
            Thể Loại
          </span>
        </h2>
        <p class="text-gray-600 text-sm sm:text-base mt-2 font-medium">Tìm mô hình anime yêu thích của bạn</p>
      </div>

      <!-- Trạng thái Loading Danh mục -->
      <div v-if="isLoadingCategories" class="flex flex-wrap justify-center gap-4 md:gap-6">
        <div v-for="i in 5" :key="i" class="w-full sm:w-48 h-56 bg-gray-200 rounded-3xl animate-pulse"></div>
      </div>

      <!-- Danh sách Danh mục -->
      <div v-else class="flex flex-wrap justify-center items-center gap-4 md:gap-6">
        <div 
          v-for="(cat, i) in categoriesWithFixedImages" 
          :key="cat.id || i"
          @click="goToCategory(cat.id)"
          class="group relative w-[calc(50%-8px)] sm:w-48 lg:w-52 aspect-square bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-rose-300 transition-all duration-500 hover:shadow-2xl hover:shadow-rose-500/10 hover:-translate-y-2 cursor-pointer flex-shrink-0"
        >
          <!-- Ảnh Logo Danh Mục -->
          <img 
            :src="cat.displayImage" 
            :alt="cat.name" 
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            @error="handleCategoryImageError"
          />

          <!-- Lớp Phủ Tên + Số Lượng Sản Phẩm -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
            <div>
              <p class="text-white font-bold text-sm leading-tight">{{ cat.name }}</p>
              <p class="text-white/75 text-xs mt-1 font-medium">{{ cat.products_count || cat.count || 0 }} sản phẩm</p>
            </div>
          </div>

          <!-- Tag Nhãn -->
          <div v-if="cat.tag" class="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-rose-600 shadow-md border border-white/40">
            {{ cat.tag }}
          </div>
        </div>
      </div>
    </section>

    <!-- ================= SẢN PHẨM BÁN CHẠY (TOP 4) ================= -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center mb-10">
        <span class="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 mb-3 shadow-sm uppercase tracking-wider">
          <font-awesome-icon :icon="['fas', 'fire']" class="text-amber-500" />
          <span>Hot Trend</span>
        </span>
        <h2 class="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
          Sản Phẩm
          <span class="bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
            Bán Chạy
          </span>
        </h2>
        <p class="text-gray-600 text-sm sm:text-base mt-2 font-medium">Những siêu phẩm được cộng đồng săn đón nhiều nhất</p>
      </div>

      <!-- Trạng thái Loading Sản phẩm -->
      <div v-if="isLoadingTopSelling" class="text-center py-20">
        <div class="inline-flex flex-col items-center">
          <div class="relative w-14 h-14">
            <div class="absolute inset-0 rounded-full border-4 border-rose-200 animate-ping"></div>
            <div class="rounded-full h-14 w-14 border-4 border-rose-600 border-t-transparent animate-spin"></div>
          </div>
          <p class="text-gray-700 font-bold text-sm mt-4 tracking-wide">Đang tải sản phẩm hot...</p>
        </div>
      </div>

      <!-- Trạng thái không có sản phẩm -->
      <div v-else-if="topSellingProducts.length === 0" class="text-center py-12 text-gray-500 font-medium">
        Chưa có dữ liệu sản phẩm bán chạy.
      </div>

      <!-- Grid Sản phẩm chuẩn UI Collection -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="(product, index) in topSellingProducts" 
          :key="product.id"
          class="group bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-2xl hover:shadow-rose-500/10 transition-all duration-500 overflow-hidden flex flex-col transform hover:-translate-y-2"
          :style="{ animationDelay: `${index * 50}ms` }"
          style="animation: slideUp 0.4s ease-out forwards;"
        >
          <!-- Image Area -->
          <div class="relative h-64 bg-gray-50 overflow-hidden">
            <img 
              v-if="product.image" 
              :src="getImageUrl(product.image)" 
              :alt="product.name" 
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              @error="(e) => handleImageError(e, product.id)"
              loading="lazy"
            />
            <div v-else :id="`placeholder-${product.id}`" class="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
              <font-awesome-icon :icon="['fas', 'image']" class="text-4xl" />
            </div>

            <!-- NÚT TRÁI TIM YÊU THÍCH (Góc trên bên phải) -->
            <button 
              @click.stop="toggleWishlist(product.id)"
              class="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white active:scale-90"
              :title="isWishlisted(product.id) ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'"
            >
              <font-awesome-icon 
                v-if="isWishlisted(product.id)" 
                :icon="['fas', 'heart']" 
                class="text-rose-600 text-lg animate-fade-in" 
              />
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

            <!-- Tag Đã bán nếu có -->
            <div v-if="product.total_sold" class="absolute bottom-3 left-3 z-10 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1">
              <font-awesome-icon :icon="['fas', 'fire']" class="text-rose-400 text-[10px]" />
              <span>Đã bán {{ product.total_sold }}</span>
            </div>
          </div>

          <!-- Content Area -->
          <div class="p-4 flex-1 flex flex-col justify-between bg-white">
            <div>
              <!-- Tên sản phẩm -->
              <h3 class="text-sm font-bold text-gray-800 line-clamp-2 group-hover:text-rose-600 transition-colors duration-200 leading-snug">
                {{ product.name }}
              </h3>

              <!-- DÒNG GIÁ TIỀN & SỐ LƯỢNG HÀNG TỒN -->
              <div class="mt-2 mb-3 flex items-center justify-between gap-2">
                <span class="text-xl font-black bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  {{ formatPrice(product.price) }}
                </span>

                <span 
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0"
                  :class="(product.stock > 0 || product.stock === undefined) ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60' : 'bg-rose-50 text-rose-600 border border-rose-200/60'"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="(product.stock > 0 || product.stock === undefined) ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                  {{ (product.stock > 0 || product.stock === undefined) ? `Còn ${product.stock ?? 10}` : 'Hết hàng' }}
                </span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-2 pt-2.5 border-t border-gray-100">
              <button
                @click="selectCollection(product)"
                class="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-2 px-3 rounded-xl transition-all duration-200 text-xs border border-gray-200 active:scale-95 cursor-pointer"
              >
                Chi Tiết
              </button>
              <button
                :disabled="product.stock <= 0"
                @click="handleBuyNow(product)"
                class="flex-1 font-bold py-2 px-3 rounded-xl transition-all duration-200 text-xs shadow-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none cursor-pointer flex items-center justify-center gap-1.5"
                :class="(product.stock > 0 || product.stock === undefined)
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white shadow-rose-500/25' 
                  : 'bg-gray-200 text-gray-500'"
              >
                <font-awesome-icon :icon="['fas', 'cart-shopping']" class="text-xs" />
                <span>Mua Ngay</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Nút xem tất cả -->
      <div class="text-center mt-12">
        <button 
          @click="goToCollections" 
          class="px-8 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold rounded-2xl hover:scale-105 transition-all shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 cursor-pointer inline-flex items-center gap-2"
        >
          <span>Xem Tất Cả Sản Phẩm</span>
          <font-awesome-icon :icon="['fas', 'arrow-right']" />
        </button>
      </div>
    </section>

    <!-- ================= 3 ĐÁNH GIÁ 5 SAO TỪ CSDL ================= -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center mb-12">
        <span class="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100 px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 mb-3 shadow-sm uppercase tracking-wider">
          <font-awesome-icon :icon="['fas', 'star']" class="text-amber-500" />
          <span>Trải Nghiệm Thực Tế</span>
        </span>
        <h2 class="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
          Đánh Giá 5 Sao
          <span class="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
            Nổi Bật
          </span>
        </h2>
      </div>

      <div v-if="isLoadingReviews" class="flex flex-col items-center justify-center py-12 text-slate-400 text-sm">
        <div class="w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p class="font-medium">Đang tải trải nghiệm từ người mua...</p>
      </div>

      <div v-else-if="topReviews.length === 0" class="text-center py-12 px-4 bg-gradient-to-b from-slate-50/80 to-white rounded-3xl border border-dashed border-slate-200">
        <div class="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 shadow-sm">
          <font-awesome-icon :icon="['fas', 'comments']" />
        </div>
        <p class="text-slate-700 font-bold text-base mb-1">Chưa có đánh giá 5 sao nào</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          v-for="review in topReviews" 
          :key="review.id"
          class="group bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-rose-100 transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-center gap-3.5">
                <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 text-white font-extrabold flex items-center justify-center text-base shadow-md shadow-rose-500/20 flex-shrink-0 transform group-hover:scale-105 transition-transform duration-300">
                  {{ getAvatarText(getUserDisplayName(review)) }}
                </div>
                
                <div>
                  <div class="flex items-center gap-2">
                    <h4 class="font-extrabold text-slate-800 text-sm tracking-tight">
                      {{ getUserDisplayName(review) }}
                    </h4>
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                      <font-awesome-icon :icon="['fas', 'check']" class="text-[9px]" />
                      Đã mua hàng
                    </span>
                  </div>

                  <div class="flex items-center gap-1 text-amber-400 text-xs mt-1">
                    <font-awesome-icon v-for="star in 5" :key="star" :icon="['fas', 'star']" />
                    <span class="text-xs font-bold text-slate-400 ml-1.5">(5/5)</span>
                  </div>
                </div>
              </div>

              <span class="text-slate-400 text-xs font-medium bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 flex-shrink-0">
                {{ formatDate(review.created_at) }}
              </span>
            </div>

            <div class="mt-4">
              <div class="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100/80 group-hover:bg-rose-50/20 group-hover:border-rose-100/50 transition-colors">
                <p class="text-slate-700 text-sm leading-relaxed font-normal">
                  {{ review.comment || 'Khách hàng không để lại bình luận chi tiết.' }}
                </p>
              </div>
            </div>
          </div>

          <div v-if="review.product_name" class="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-rose-600 font-bold truncate">
            <font-awesome-icon :icon="['fas', 'box-archive']" />
            <span class="truncate">{{ review.product_name }}</span>
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
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const baseUrl = apiUrl.replace('/api', '')

const categoryMapping = {
  'onepiece': { image: '/images/onepiece.jpg', tag: 'OP' },
  'dragonball': { image: '/images/dragonball.jpg', tag: '7B' },
  'naruto': { image: '/images/naruto.jpg', tag: 'Nar' },
  'demonslayer': { image: '/images/demonslayer.jpg', tag: 'DML' },
  'demonslayerkimetsunoyaiba': { image: '/images/demonslayer.jpg', tag: 'DML' },
  'attackontitan': { image: '/images/aot.jpg', tag: 'AOT' },
  'aot': { image: '/images/aot.jpg', tag: 'AOT' }
}

const categories = ref([])
const isLoadingCategories = ref(true)

const topSellingProducts = ref([])
const isLoadingTopSelling = ref(true)

const topReviews = ref([])
const isLoadingReviews = ref(true)

const wishlistIds = ref(new Set())

const categoriesWithFixedImages = computed(() => {
  if (!categories.value || categories.value.length === 0) return []
  
  return categories.value.map(cat => {
    const cleanName = cat.name ? cat.name.toLowerCase().replace(/[^a-z0-9]/g, '') : ''
    const match = categoryMapping[cleanName]
    
    return {
      ...cat,
      displayImage: match ? match.image : (cat.image ? getImageUrl(cat.image) : '/images/demonslayer.jpg'),
      tag: match ? match.tag : null
    }
  })
})

const fetchWishlist = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return

    const response = await axios.get(`${apiUrl}/wishlist`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (response.data?.success) {
      wishlistIds.value = new Set(response.data.data.map(item => item.product_id || item.id))
    }
  } catch (error) {
    console.error('Lỗi lấy danh sách wishlist:', error)
  }
}

const toggleWishlist = async (productId) => {
  const token = localStorage.getItem('token')
  if (!token) {
    alert('Vui lòng đăng nhập để lưu sản phẩm yêu thích!')
    router.push({ name: 'login' })
    return
  }

  if (wishlistIds.value.has(productId)) {
    wishlistIds.value.delete(productId)
  } else {
    wishlistIds.value.add(productId)
  }
  wishlistIds.value = new Set(wishlistIds.value)

  try {
    const response = await axios.post(`${apiUrl}/wishlist/toggle`, 
      { product_id: productId },
      { headers: { 'Authorization': `Bearer ${token}` } }
    )
    if (!response.data?.success) {
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

const fetchCategories = async () => {
  isLoadingCategories.value = true
  try {
    const response = await axios.get(`${apiUrl}/categories`)
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

const fetchTopSellingProducts = async () => {
  isLoadingTopSelling.value = true
  try {
    const response = await axios.get(`${apiUrl}/products/top-selling`)
    let list = []
    if (response.data && response.data.success) {
      list = response.data.data
    } else if (Array.isArray(response.data)) {
      list = response.data
    }
    topSellingProducts.value = list.slice(0, 4).map(p => ({
      ...p,
      price: Number(p.price) || 0
    }))
  } catch (error) {
    console.error('Lỗi khi tải sản phẩm bán chạy:', error)
  } finally {
    isLoadingTopSelling.value = false
  }
}

const fetchTopFiveStarReviews = async () => {
  isLoadingReviews.value = true
  try {
    const response = await axios.get(`${apiUrl}/reviews/top-five-stars`)
    if (response.data && response.data.success) {
      topReviews.value = response.data.data.slice(0, 3)
    }
  } catch (error) {
    console.error('Lỗi khi tải đánh giá 5 sao:', error)
  } finally {
    isLoadingReviews.value = false
  }
}

const goToCollections = () => router.push({ name: 'collections' })
const goToCategory = (id) => router.push({ name: 'collections', query: { category: id } })

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

const getImageUrl = (imagePath) => {
  if (!imagePath) return '/images/demonslayer.jpg'
  if (imagePath.startsWith('http') || imagePath.startsWith('/images/')) return imagePath
  return `${baseUrl}/uploads/${imagePath}`
}

const handleImageError = (event, id) => {
  event.target.style.display = 'none'
  const placeholder = document.getElementById(`placeholder-${id}`)
  if (placeholder) {
    placeholder.classList.remove('hidden')
  }
}

const handleCategoryImageError = (e) => {
  e.target.src = '/images/demonslayer.jpg'
}

const getUserDisplayName = (review) => review.user_name || review.user_username || (review.user_id ? `Khách hàng #${review.user_id}` : 'Khách hàng')
const getAvatarText = (name) => name ? String(name).trim().charAt(0).toUpperCase() : 'K'
const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('vi-VN') : ''

onMounted(() => {
  fetchCategories()
  fetchTopSellingProducts()
  fetchTopFiveStarReviews()
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