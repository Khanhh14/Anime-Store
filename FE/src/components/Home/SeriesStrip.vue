<template>
  <div class="w-full bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950/20 min-h-screen">
    
    <!-- ================= HERO BANNER ================= -->
    <section class="relative overflow-hidden bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 dark:from-rose-800 dark:via-purple-800 dark:to-indigo-800">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-pink-400 rounded-full blur-3xl"></div>
      </div>
      
      <div class="max-w-[1376px] mx-auto px-4 py-16 md:py-20 relative">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="text-white space-y-6">
            <div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
              <span class="animate-pulse">🛒</span>
              SALE LỚN - GIẢM ĐẾN 50%
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
              <button class="group px-8 py-3 bg-white text-purple-600 font-bold rounded-full hover:scale-105 transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
                Mua Ngay
                <span class="group-hover:translate-x-1 transition-transform">→</span>
              </button>
              <button class="px-8 py-3 border-2 border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition-all backdrop-blur-sm">
                Xem Bộ Sưu Tập
              </button>
            </div>
            <div class="flex items-center gap-8 pt-4">
              <div>
                <p class="text-2xl font-bold">500+</p>
                <p class="text-sm text-white/60">Sản phẩm</p>
              </div>
              <div>
                <p class="text-2xl font-bold">50+</p>
                <p class="text-sm text-white/60">Thương hiệu</p>
              </div>
              <div>
                <p class="text-2xl font-bold">10K+</p>
                <p class="text-sm text-white/60">Khách hàng</p>
              </div>
            </div>
          </div>
          
          <div class="relative hidden lg:block">
            <div class="relative w-full aspect-square max-w-lg mx-auto">
              <div class="absolute inset-0 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
              
              <img 
                src="/images/hero.jpg" 
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

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
        <div 
          v-for="(cat, i) in categories" 
          :key="i"
          class="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-indigo-400 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 cursor-pointer"
        >
          <div class="aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            <img 
              :src="cat.image" 
              :alt="cat.name" 
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4">
            <div>
              <p class="text-white font-bold text-sm">{{ cat.name }}</p>
              <p class="text-white/60 text-xs">{{ cat.count }} sản phẩm</p>
            </div>
          </div>
          <div class="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-indigo-600">
            {{ cat.tag }}
          </div>
        </div>
      </div>
    </section>

    <!-- ================= SẢN PHẨM NỔI BẬT ================= -->
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
        <div class="flex gap-2">
          <button class="p-2 rounded-full border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <button class="p-2 rounded-full border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="(product, i) in featuredProducts" 
          :key="i"
          class="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-rose-400 transition-all duration-300 hover:shadow-2xl hover:shadow-rose-500/10 hover:-translate-y-2"
        >
          <div class="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            <img 
              :src="product.image" 
              :alt="product.name" 
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div v-if="product.discount" class="absolute top-3 left-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              -{{ product.discount }}%
            </div>
            <div class="absolute top-3 right-3 flex flex-col gap-2">
              <button class="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-md">
                ❤️
              </button>
              <button class="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-md">
                🔄
              </button>
            </div>
            <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <button class="w-full bg-white text-gray-900 font-bold py-2 rounded-xl hover:bg-rose-500 hover:text-white transition-all">
                Thêm vào giỏ
              </button>
            </div>
          </div>
          <div class="p-4 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{{ product.brand }}</span>
              <div class="flex items-center gap-1 text-yellow-400 text-sm">
                ⭐ {{ product.rating }}
                <span class="text-gray-400 text-xs">({{ product.reviews }})</span>
              </div>
            </div>
            <h3 class="font-bold text-gray-800 dark:text-gray-100 text-sm group-hover:text-rose-500 transition-colors line-clamp-2">
              {{ product.name }}
            </h3>
            <div class="flex items-center gap-2">
              <span class="text-lg font-bold text-rose-500">{{ product.price }}</span>
              <span v-if="product.oldPrice" class="text-sm text-gray-400 line-through">{{ product.oldPrice }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="text-center mt-10">
        <button class="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-full hover:scale-105 transition-all shadow-lg hover:shadow-indigo-500/30">
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

      <!-- Trạng thái Đang Tải -->
      <div v-if="isLoadingReviews" class="flex flex-col items-center justify-center py-12 text-slate-400 text-sm">
        <div class="w-8 h-8 border-3 border-pink-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p class="font-medium">Đang tải trải nghiệm từ người mua...</p>
      </div>

      <!-- Trạng thái Chưa Có Đánh Giá 5 Sao -->
      <div v-else-if="topReviews.length === 0" class="text-center py-12 px-4 bg-gradient-to-b from-slate-50/80 to-white dark:from-gray-900 dark:to-gray-800 rounded-3xl border border-dashed border-slate-200 dark:border-gray-800">
        <div class="w-16 h-16 bg-pink-50 dark:bg-pink-950/30 text-pink-500 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 shadow-sm">
          💬
        </div>
        <p class="text-slate-700 dark:text-gray-200 font-bold text-base mb-1">Chưa có đánh giá 5 sao nào</p>
      </div>

      <!-- Danh Sách 3 Đánh Giá 5 Sao -->
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          v-for="review in topReviews" 
          :key="review.id"
          class="group bg-white dark:bg-gray-900 p-5 sm:p-6 rounded-2xl border border-slate-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-pink-100 transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <div class="flex items-start justify-between gap-4">
              <!-- Thông tin User -->
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

                  <!-- Ngôi Sao Đánh Giá -->
                  <div class="flex items-center gap-1 text-amber-400 text-sm mt-1">
                    <span v-for="star in 5" :key="star">★</span>
                    <span class="text-xs font-bold text-slate-400 ml-1.5">(5/5)</span>
                  </div>
                </div>
              </div>

              <!-- Thời gian -->
              <span class="text-slate-400 text-xs font-medium bg-slate-50 dark:bg-gray-800 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-gray-700 flex-shrink-0">
                {{ formatDate(review.created_at) }}
              </span>
            </div>

            <!-- Lời Nhắn -->
            <div class="mt-4">
              <div class="bg-slate-50/80 dark:bg-gray-800/50 rounded-xl p-3.5 border border-slate-100/80 dark:border-gray-700/50 group-hover:bg-pink-50/20 group-hover:border-pink-100/50 transition-colors">
                <p class="text-slate-700 dark:text-gray-300 text-sm leading-relaxed font-normal">
                  {{ review.comment || 'Khách hàng không để lại bình luận chi tiết.' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Tên sản phẩm được đánh giá -->
          <div v-if="review.product_name" class="mt-4 pt-3 border-t border-slate-100 dark:border-gray-800 flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-bold truncate">
            <span>🛒 {{ review.product_name }}</span>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// ================= DATA SẢN PHẨM & DANH MỤC =================

const categories = [
  { name: 'One Piece', image: '/images/onepiece.jpg', count: 120, tag: 'Hot' },
  { name: 'Dragon Ball', image: '/images/dragonball.jpg', count: 95, tag: 'Best' },
  { name: 'Naruto', image: '/images/naruto.jpg', count: 88, tag: 'New' },
  { name: 'Demon Slayer', image: '/images/demonslayer.jpg', count: 76, tag: 'Trend' },
  { name: 'Attack on Titan', image: '/images/aot.jpg', count: 64, tag: 'Sale' },
  { name: 'Others', image: '/images/hero.jpg', count: 157, tag: 'View' }
]

const featuredProducts = [
  {
    name: 'Gear 5 Luffy - One Piece',
    brand: 'Bandai',
    image: '/images/onepiece.jpg',
    price: '₫2,499,000',
    oldPrice: '₫3,499,000',
    discount: 28,
    rating: 4.8,
    reviews: 234
  },
  {
    name: 'Goku Ultra Instinct - Dragon Ball Super',
    brand: 'Banpresto',
    image: '/images/dragonball.jpg',
    price: '₫1,899,000',
    oldPrice: null,
    discount: 0,
    rating: 4.9,
    reviews: 189
  },
  {
    name: 'Naruto Six Paths - Naruto Shippuden',
    brand: 'MegaHouse',
    image: '/images/naruto.jpg',
    price: '₫3,199,000',
    oldPrice: '₫4,299,000',
    discount: 25,
    rating: 4.7,
    reviews: 156
  },
  {
    name: 'Tanjiro Hinokami Kagura - Demon Slayer',
    brand: 'Aniplex',
    image: '/images/demonslayer.jpg',
    price: '₫2,799,000',
    oldPrice: '₫3,299,000',
    discount: 15,
    rating: 4.9,
    reviews: 203
  }
]

// ================= LOGIC KẾT NỐI API ĐÁNH GIÁ =================

const topReviews = ref([])
const isLoadingReviews = ref(false)

const fetchTopFiveStarReviews = async () => {
  isLoadingReviews.value = true
  try {
    const response = await axios.get('http://localhost:3000/api/reviews/top-five-stars')
    if (response.data && response.data.success) {
      topReviews.value = response.data.data
    }
  } catch (error) {
    console.error("Lỗi khi tải đánh giá 5 sao:", error)
  } finally {
    isLoadingReviews.value = false
  }
}

// Xử lý lấy tên người dùng
const getUserDisplayName = (review) => {
  if (review.user_name) return review.user_name
  if (review.user_username) return review.user_username
  return review.user_id ? `Khách hàng #${review.user_id}` : 'Khách hàng'
}

// Lấy avatar chữ cái đầu
const getAvatarText = (name) => {
  if (!name) return 'K'
  return String(name).trim().charAt(0).toUpperCase()
}

// Format ngày tháng định dạng VN
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

onMounted(() => {
  fetchTopFiveStarReviews()
})
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

.animate-spin {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>