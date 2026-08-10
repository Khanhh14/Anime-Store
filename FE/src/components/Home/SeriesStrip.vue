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
              
              <!-- Hero image -->
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

    <!-- ================= BANNER KHUYẾN MÃI ================= -->
    <section class="max-w-[1376px] mx-auto px-4">
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 md:p-12">
        <div class="absolute inset-0 opacity-10">
          <div class="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div class="absolute bottom-0 left-0 w-64 h-64 bg-pink-400 rounded-full blur-3xl"></div>
        </div>
        <div class="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div class="text-white space-y-4">
            <span class="inline-block bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium">
              🎉 Flash Sale
            </span>
            <h3 class="text-3xl md:text-4xl font-extrabold">
              Giảm Giá Sốc
              <span class="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                Lên Đến 70%
              </span>
            </h3>
            <p class="text-white/80">Đừng bỏ lỡ cơ hội sở hữu mô hình anime yêu thích với giá cực tốt</p>
            <div class="flex items-center gap-4">
              <div class="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-center">
                <p class="text-2xl font-bold">24</p>
                <p class="text-xs text-white/60">Giờ</p>
              </div>
              <div class="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-center">
                <p class="text-2xl font-bold">18</p>
                <p class="text-xs text-white/60">Phút</p>
              </div>
              <div class="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-center">
                <p class="text-2xl font-bold">45</p>
                <p class="text-xs text-white/60">Giây</p>
              </div>
            </div>
          </div>
          <div class="flex justify-center md:justify-end">
            <button class="px-10 py-4 bg-white text-purple-700 font-bold rounded-full hover:scale-105 transition-all shadow-xl hover:shadow-2xl">
              Mua Ngay
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= ĐÁNH GIÁ KHÁCH HÀNG ================= -->
    <section class="max-w-[1376px] mx-auto px-4 py-16">
      <div class="text-center mb-12">
        <span class="text-sm font-medium text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30 px-4 py-1.5 rounded-full inline-block mb-3">
          ⭐ Khách Hàng Nói Gì
        </span>
        <h2 class="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
          Đánh Giá
          <span class="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
            Từ Cộng Đồng
          </span>
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          v-for="(review, i) in reviews" 
          :key="i"
          class="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-yellow-400 transition-all hover:shadow-xl"
        >
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-white font-bold text-lg">
              {{ review.name[0] }}
            </div>
            <div>
              <p class="font-bold text-gray-900 dark:text-white">{{ review.name }}</p>
              <div class="flex items-center gap-1 text-yellow-400 text-sm">
                {{ '⭐'.repeat(review.rating) }}
                <span class="text-gray-400 text-xs ml-1">{{ review.date }}</span>
              </div>
            </div>
          </div>
          <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{{ review.comment }}</p>
          <div class="mt-3 flex items-center gap-2 text-xs text-gray-400">
            <span>🛒 {{ review.product }}</span>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref } from 'vue'

// ================= DATA =================

// Danh mục sản phẩm - sử dụng ảnh từ thư mục images
const categories = [
  { name: 'One Piece', image: '/images/onepiece.jpg', count: 120, tag: 'Hot' },
  { name: 'Dragon Ball', image: '/images/dragonball.jpg', count: 95, tag: 'Best' },
  { name: 'Naruto', image: '/images/naruto.jpg', count: 88, tag: 'New' },
  { name: 'Demon Slayer', image: '/images/demonslayer.jpg', count: 76, tag: 'Trend' },
  { name: 'Attack on Titan', image: '/images/aot.jpg', count: 64, tag: 'Sale' },
  { name: 'Others', image: '/images/hero.jpg', count: 157, tag: 'View' }
]

// Sản phẩm nổi bật - sử dụng ảnh từ thư mục images
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

// Đánh giá khách hàng
const reviews = [
  {
    name: 'Minh Anh',
    rating: 5,
    date: '2 ngày trước',
    comment: 'Mô hình chất lượng tuyệt vời, đóng gói cẩn thận. Rất hài lòng với sản phẩm!',
    product: 'Gear 5 Luffy'
  },
  {
    name: 'Hoàng Nam',
    rating: 5,
    date: '5 ngày trước',
    comment: 'Giao hàng nhanh, sản phẩm đúng như mô tả. Sẽ ủng hộ shop dài dài!',
    product: 'Goku Ultra Instinct'
  },
  {
    name: 'Thanh Trúc',
    rating: 4,
    date: '1 tuần trước',
    comment: 'Sản phẩm đẹp, chi tiết tinh xảo. Giá cả hợp lý so với chất lượng.',
    product: 'Tanjiro Hinokami Kagura'
  }
]
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