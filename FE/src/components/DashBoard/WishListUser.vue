<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50/30 font-sans selection:bg-rose-500 selection:text-white">
    <!-- Background Elements -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-1/4 -right-24 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl animate-pulse"></div>
    </div>

    <!-- Header -->
    <Header />

    <main class="min-h-screen relative z-10 pb-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        
        <!-- Title Section -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-gray-100 pb-6">
          <div>
            <h1 class="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-3">
              <span class="p-2 rounded-2xl bg-rose-50 text-rose-600 text-xl inline-flex items-center justify-center">
                <font-awesome-icon :icon="['fas', 'heart']" />
              </span>
              Danh Sách Yêu Thích
            </h1>
            <p class="text-gray-500 text-sm mt-1">Các mô hình và phụ kiện bạn đã lưu lại</p>
          </div>

          <div v-if="wishlistItems.length > 0" class="text-xs font-bold text-gray-600 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm self-start sm:self-auto">
            Tổng cộng: <span class="text-rose-600 font-extrabold">{{ wishlistItems.length }}</span> món đồ
          </div>
        </div>

        <!-- LOADING STATE -->
        <div v-if="loading" class="text-center py-28">
          <div class="inline-flex flex-col items-center">
            <div class="relative w-12 h-12">
              <div class="absolute inset-0 rounded-full border-4 border-rose-200 animate-ping"></div>
              <div class="rounded-full h-12 w-12 border-4 border-rose-600 border-t-transparent animate-spin"></div>
            </div>
            <p class="text-gray-500 font-bold text-sm mt-4">Đang tải danh sách yêu thích...</p>
          </div>
        </div>

        <!-- EMPTY STATE (Chưa có sản phẩm nào) -->
        <div v-else-if="wishlistItems.length === 0" class="text-center py-20">
          <div class="bg-white rounded-3xl shadow-xl p-10 max-w-md mx-auto border border-gray-100">
            <div class="w-16 h-16 bg-rose-50 text-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
              <font-awesome-icon :icon="['far', 'heart']" />
            </div>
            <h3 class="text-lg font-black text-gray-800">Danh sách mong muốn trống</h3>
            <p class="text-gray-500 text-xs mt-1.5 leading-relaxed">
              Bạn chưa thả tim sản phẩm nào. Hãy khám phá và lưu lại những món đồ Anime yêu thích nhé!
            </p>
            <router-link
              :to="{ name: 'collections' }"
              class="inline-block mt-6 px-6 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-500/20 hover:scale-105 transition-all"
            >
              Khám phá bộ sưu tập ngay
            </router-link>
          </div>
        </div>

        <!-- GRID DANH SÁCH SẢN PHẨM YÊU THÍCH -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            v-for="item in wishlistItems"
            :key="item.wishlist_id || item.product_id"
            class="group bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            <!-- Khung Ảnh -->
            <div class="relative h-60 bg-gray-50 overflow-hidden cursor-pointer" @click="goToDetail(item.product_id)">
              <img
                v-if="item.image"
                :src="buildImageUrl(item.image)"
                :alt="item.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div v-else class="w-full h-full flex items-center justify-center bg-gray-100">
                <span class="text-gray-300 text-xs">Không có ảnh</span>
              </div>

              <!-- Nút Xóa Khỏi Wishlist -->
              <button 
                @click.stop="removeItem(item.product_id)"
                class="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow text-gray-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-all"
                title="Xóa khỏi yêu thích"
              >
                ✕
              </button>

              <!-- Category Tag -->
              <div class="absolute top-3 left-3 z-10">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-md text-gray-800 shadow-sm">
                  {{ item.category_name || 'Anime' }}
                </span>
              </div>
            </div>

            <!-- Nội Dung -->
            <div class="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 
                  @click="goToDetail(item.product_id)"
                  class="text-sm font-bold text-gray-800 line-clamp-2 hover:text-rose-600 transition-colors cursor-pointer leading-snug"
                >
                  {{ item.name }}
                </h3>

                <div class="my-2">
                  <span class="text-lg font-black bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                    {{ formatPrice(item.price) }}
                  </span>
                </div>
              </div>

              <!-- Thao tác mua -->
              <div class="flex gap-2 pt-2.5 border-t border-gray-100">
                <button
                  @click="addToCart(item)"
                  class="flex-1 bg-gray-50 hover:bg-rose-50 text-gray-700 hover:text-rose-600 font-bold py-2 px-2 rounded-xl transition-all text-xs border border-gray-200"
                >
                  + Thêm vào giỏ
                </button>
                <button
                  @click="buyNow(item)"
                  class="flex-1 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold py-2 px-2 rounded-xl transition-all text-xs shadow-md shadow-rose-500/20"
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/Home/Header.vue'

const router = useRouter()
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const baseUrl = apiUrl.replace('/api', '')

const wishlistItems = ref([])
const loading = ref(false)

const buildImageUrl = (imagePath) => {
  if (!imagePath) return null
  if (imagePath.startsWith('http')) return imagePath
  return `${baseUrl}/uploads/${imagePath}`
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price || 0)
}

// 1. Tải danh sách yêu thích của người dùng
const fetchWishlist = async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    router.push({ name: 'login' })
    return
  }

  loading.value = true
  try {
    const res = await fetch(`${apiUrl}/wishlist`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await res.json()
    if (data.success) {
      wishlistItems.value = data.data
    }
  } catch (error) {
    console.error('Lỗi khi tải wishlist:', error)
  } finally {
    loading.value = false
  }
}

// 2. Xóa sản phẩm khỏi danh sách yêu thích
const removeItem = async (productId) => {
  const token = localStorage.getItem('token')
  if (!token) return

  wishlistItems.value = wishlistItems.value.filter(item => item.product_id !== productId)

  try {
    await fetch(`${apiUrl}/wishlist/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  } catch (error) {
    console.error('Lỗi xóa sản phẩm:', error)
    fetchWishlist()
  }
}

// 3. Thêm vào giỏ hàng
const addToCart = async (item) => {
  const token = localStorage.getItem('token')
  if (!token) {
    alert('Vui lòng đăng nhập!')
    router.push({ name: 'login' })
    return
  }

  try {
    const res = await fetch(`${apiUrl}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ product_id: item.product_id, quantity: 1 })
    })
    const data = await res.json()
    if (data.success) {
      alert('Đã thêm vào giỏ hàng thành công!')
    }
  } catch (error) {
    console.error('Lỗi thêm giỏ hàng:', error)
  }
}

// 4. Mua ngay
const buyNow = (item) => {
  localStorage.setItem('buy_now_product', JSON.stringify(item))
  localStorage.setItem('buy_now_quantity', '1')
  router.push({ name: 'checkout' })
}

const goToDetail = (productId) => {
  router.push({ name: 'DetailProducts', params: { id: productId } })
}

onMounted(() => {
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
</style>