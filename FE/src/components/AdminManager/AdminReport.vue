<template>
  <div class="space-y-8 animate-fadeIn">
    <!-- Tiêu đề & Cờ năm -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h2 class="text-3xl font-bold text-white">Báo cáo tổng quan</h2>
        <p class="text-slate-400 text-sm mt-1">Số liệu thống kê hoạt động kinh doanh thực tế từ CSDL.</p>
      </div>
      <div class="text-sm bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 text-slate-300 flex items-center gap-2">
        <font-awesome-icon :icon="['fas', 'calendar-days']" class="text-slate-400" />
        <span>Hệ thống hoạt động: 2026</span>
      </div>
    </div>

    <!-- 4 Khối Card Thống Kê Nhanh -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <!-- Doanh thu -->
      <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700/60 shadow-xl">
        <div class="flex justify-between items-start">
          <p class="text-sm font-semibold text-slate-400">Doanh thu hệ thống</p>
          <span class="w-10 h-10 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl flex items-center justify-center text-lg">
            <font-awesome-icon :icon="['fas', 'sack-dollar']" />
          </span>
        </div>
        <p class="text-2xl font-bold text-emerald-400 mt-4">{{ totalRevenue.toLocaleString() }}₫</p>
        <p class="text-xs text-slate-500 font-medium mt-1">Tổng giá trị đơn hàng</p>
      </div>

      <!-- Tổng sản phẩm -->
      <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700/60 shadow-xl">
        <div class="flex justify-between items-start">
          <p class="text-sm font-semibold text-slate-400">Tổng số sản phẩm</p>
          <span class="w-10 h-10 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl flex items-center justify-center text-lg">
            <font-awesome-icon :icon="['fas', 'box-archive']" />
          </span>
        </div>
        <p class="text-2xl font-bold text-white mt-4">{{ productCount }} mặt hàng</p>
        <p class="text-xs text-slate-500 font-medium mt-1">Trong bảng `products`</p>
      </div>

      <!-- Tổng đơn hàng -->
      <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700/60 shadow-xl">
        <div class="flex justify-between items-start">
          <p class="text-sm font-semibold text-slate-400">Tổng số đơn hàng</p>
          <span class="w-10 h-10 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-xl flex items-center justify-center text-lg">
            <font-awesome-icon :icon="['fas', 'cart-shopping']" />
          </span>
        </div>
        <p class="text-2xl font-bold text-white mt-4">{{ orders.length }} hóa đơn</p>
        <p class="text-xs text-slate-500 font-medium mt-1">Trong bảng `orders`</p>
      </div>

      <!-- Người dùng -->
      <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700/60 shadow-xl">
        <div class="flex justify-between items-start">
          <p class="text-sm font-semibold text-slate-400">Thành viên đăng ký</p>
          <span class="w-10 h-10 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl flex items-center justify-center text-lg">
            <font-awesome-icon :icon="['fas', 'users']" />
          </span>
        </div>
        <p class="text-2xl font-bold text-white mt-4">{{ users.length }} người dùng</p>
        <p class="text-xs text-slate-500 font-medium mt-1">Trong bảng `users`</p>
      </div>
    </div>

    <!-- Bảng Đơn Hàng Mới & Review Phụ Cận -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-slate-800 rounded-2xl border border-slate-700/60 p-6 shadow-xl">
        <div class="flex items-center gap-2 mb-4">
          <font-awesome-icon :icon="['fas', 'file-invoice-dollar']" class="text-rose-400" />
          <h3 class="text-lg font-bold text-white">Danh sách đơn hàng mới</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="text-slate-400 border-b border-slate-700">
                <th class="pb-3 font-semibold">Mã ĐH</th>
                <th class="pb-3 font-semibold">Tổng tiền</th>
                <th class="pb-3 font-semibold">Trạng thái</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-700/40">
              <tr v-for="order in orders.slice(0, 5)" :key="order.id" class="text-slate-300 hover:bg-slate-700/20 transition">
                <td class="py-3.5 font-mono font-bold text-pink-400">#{{ order.id }}</td>
                <td class="py-3.5 font-semibold text-rose-400">{{ Number(order.total || 0).toLocaleString() }}₫</td>
                <td class="py-3.5">
                  <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {{ translateStatus(order.status) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="bg-slate-800 rounded-2xl border border-slate-700/60 p-6 shadow-xl">
        <div class="flex items-center gap-2 mb-4">
          <font-awesome-icon :icon="['fas', 'comments']" class="text-amber-400" />
          <h3 class="text-lg font-bold text-white">Đánh giá gần đây (`reviews`)</h3>
        </div>
        <div class="space-y-4 max-h-[300px] overflow-y-auto pr-1">
          <div v-for="review in reviews" :key="review.id" class="bg-slate-900/50 p-4 rounded-xl border border-slate-700/30">
            <div class="flex justify-between items-center mb-1">
              <span class="font-bold text-sm text-white">User: #{{ review.user_id }}</span>
              <span class="text-yellow-400 text-xs flex items-center gap-1">
                <font-awesome-icon :icon="['fas', 'star']" />
                <span>{{ review.rating }}/5</span>
              </span>
            </div>
            <p class="text-xs text-slate-400">"{{ review.comment || 'Không có bình luận' }}"</p>
          </div>
        </div>
      </div>
    </div>

    <!-- BẢNG THỐNG KÊ TOP SẢN PHẨM ĐƯỢC YÊU THÍCH NHẤT (WISHLIST) -->
    <div class="bg-slate-800 rounded-2xl border border-slate-700/60 p-6 shadow-xl">
      <div class="flex justify-between items-center mb-4">
        <div>
          <h3 class="text-lg font-bold text-white flex items-center gap-2">
            <font-awesome-icon :icon="['fas', 'heart']" class="text-rose-500" />
            <span>Top Sản Phẩm Được Quan Tâm Nhất (Wishlist)</span>
          </h3>
          <p class="text-slate-400 text-xs mt-0.5">Thống kê các mô hình có lượt thả tim cao nhất từ người dùng</p>
        </div>
        <span class="text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
          <font-awesome-icon :icon="['fas', 'heart']" class="text-xs" />
          Top {{ topWishlist.length }} sản phẩm
        </span>
      </div>

      <!-- Loading State -->
      <div v-if="loadingWishlist" class="text-center py-8 text-slate-400 text-sm">
        Đang tải dữ liệu thống kê yêu thích...
      </div>

      <!-- Empty State -->
      <div v-else-if="topWishlist.length === 0" class="text-center py-8 text-slate-500 text-sm">
        Chưa có lượt yêu thích nào được ghi nhận.
      </div>

      <!-- Data Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="text-slate-400 border-b border-slate-700 text-xs uppercase tracking-wider">
              <th class="pb-3 font-semibold">Mô hình</th>
              <th class="pb-3 font-semibold">Danh mục</th>
              <th class="pb-3 font-semibold">Đơn giá</th>
              <th class="pb-3 font-semibold">Tồn kho</th>
              <th class="pb-3 font-semibold text-right">Lượt yêu thích</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-700/40">
            <tr v-for="item in topWishlist" :key="item.product_id" class="text-slate-300 hover:bg-slate-700/20 transition">
              <td class="py-3 flex items-center gap-3">
                <img 
                  v-if="item.image" 
                  :src="buildImageUrl(item.image)" 
                  :alt="item.product_name"
                  class="w-10 h-10 rounded-lg object-cover bg-slate-900 border border-slate-700" 
                />
                <div v-else class="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-500">
                  <font-awesome-icon :icon="['fas', 'image']" class="text-xs" />
                </div>
                <div>
                  <span class="font-bold text-white hover:text-rose-400 transition">{{ item.product_name }}</span>
                  <p class="text-[11px] text-slate-500">ID: #{{ item.product_id }}</p>
                </div>
              </td>
              <td class="py-3">
                <span class="px-2 py-0.5 rounded text-xs bg-slate-700/60 text-slate-300">
                  {{ item.category_name || 'Anime' }}
                </span>
              </td>
              <td class="py-3 font-semibold text-emerald-400">
                {{ Number(item.price || 0).toLocaleString() }}₫
              </td>
              <td class="py-3">
                <span 
                  class="px-2 py-0.5 rounded-full text-xs font-bold"
                  :class="item.stock > 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'"
                >
                  {{ item.stock > 0 ? `Còn ${item.stock}` : 'Hết hàng' }}
                </span>
              </td>
              <td class="py-3 text-right">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  <font-awesome-icon :icon="['fas', 'heart']" />
                  <span>{{ item.total_wishlist }} lượt</span>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Biểu đồ thống kê -->
    <AdminCharts :orders="orders" />
  </div>
</template>

<script setup>
import { defineProps, computed, ref, onMounted } from 'vue'
import AdminCharts from './AdminCharts.vue'

const props = defineProps({
  orders: { type: Array, default: () => [] },
  users: { type: Array, default: () => [] },
  reviews: { type: Array, default: () => [] },
  productCount: { type: Number, default: 0 }
})

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const baseUrl = apiUrl.replace('/api', '')

const topWishlist = ref([])
const loadingWishlist = ref(false)

const buildImageUrl = (imagePath) => {
  if (!imagePath) return null
  if (imagePath.startsWith('http')) return imagePath
  return `${baseUrl}/uploads/${imagePath}`
}

const fetchWishlistStats = async () => {
  loadingWishlist.value = true
  try {
    const res = await fetch(`${apiUrl}/stats/wishlist`)
    const data = await res.json()
    if (data.success) {
      topWishlist.value = data.data
    }
  } catch (error) {
    console.error('Lỗi fetchWishlistStats:', error)
  } finally {
    loadingWishlist.value = false
  }
}

const totalRevenue = computed(() => {
  return props.orders.reduce((sum, order) => sum + Number(order.total || order.total_price || 0), 0)
})

const translateStatus = (status) => {
  const statusMap = {
    'pending': 'Đang xử lý',
    'confirmed': 'Đã xác nhận',
    'shipping': 'Đang giao',
    'completed': 'Hoàn thành',
    'cancelled': 'Đã hủy'
  };
  return statusMap[status] || status || 'Chờ xử lý';
}

onMounted(() => {
  fetchWishlistStats()
})
</script>