<template>
  <div class="min-h-screen bg-slate-900 text-slate-100 flex font-sans">
    
    <aside class="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0">
      <div class="p-6">
        <div class="flex items-center gap-3 mb-8">
          <div class="w-10 h-10 bg-gradient-to-tr from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/20">
            <span class="text-white font-bold text-xl">A</span>
          </div>
          <div>
            <h1 class="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-rose-400">ANIME SHOP</h1>
            <p class="text-xs text-slate-500">Hệ thống quản trị</p>
          </div>
        </div>

        <nav class="space-y-1">
          <button 
            v-for="item in menuItems" :key="item.id"
            @click="navigateMenu(item.id)"
            :class="[
              'w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition duration-200',
              activeMenu === item.id 
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-rose-500/10' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            ]"
          >
            <span class="text-lg">{{ item.icon }}</span>
            {{ item.name }}
          </button>
        </nav>
      </div>

      <div class="p-4 border-t border-slate-800 bg-slate-950/50 flex flex-col gap-2">
        <div class="flex items-center gap-3 px-2 py-1">
          <div class="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center border border-pink-500/30 text-pink-400 font-bold">
            AD
          </div>
          <div class="min-w-0">
            <p class="text-sm font-semibold truncate text-white">Administrator</p>
            <p class="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Trực tuyến
            </p>
          </div>
        </div>
        <button @click="$router.push('/')" class="w-full mt-2 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition">
          🏠 Về trang chủ shop
        </button>
      </div>
    </aside>

    <main class="flex-1 min-w-0 overflow-y-auto p-6 lg:p-8">
      
      <div v-if="activeMenu === 'dashboard'" class="space-y-8 animate-fadeIn">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 class="text-3xl font-bold text-white">Báo cáo tổng quan</h2>
            <p class="text-slate-400 text-sm mt-1">Số liệu thống kê hoạt động kinh doanh thực tế từ CSDL.</p>
          </div>
          <div class="text-sm bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 text-slate-300">
            📅 Hệ thống hoạt động: 2026
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700/60 shadow-xl">
            <div class="flex justify-between items-start">
              <p class="text-sm font-semibold text-slate-400">Doanh thu hệ thống</p>
              <span class="p-2 bg-slate-700/50 rounded-lg text-xl">💰</span>
            </div>
            <p class="text-2xl font-bold text-emerald-400 mt-4">{{ totalRevenue.toLocaleString() }}₫</p>
            <p class="text-xs text-slate-500 font-medium mt-1">Tổng giá trị đơn hàng</p>
          </div>

          <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700/60 shadow-xl">
            <div class="flex justify-between items-start">
              <p class="text-sm font-semibold text-slate-400">Tổng số sản phẩm</p>
              <span class="p-2 bg-slate-700/50 rounded-lg text-xl">🧸</span>
            </div>
            <p class="text-2xl font-bold text-white mt-4">{{ productCount }} mặt hàng</p>
            <p class="text-xs text-slate-500 font-medium mt-1">Trong bảng `products`</p>
          </div>

          <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700/60 shadow-xl">
            <div class="flex justify-between items-start">
              <p class="text-sm font-semibold text-slate-400">Tổng số đơn hàng</p>
              <span class="p-2 bg-slate-700/50 rounded-lg text-xl">📦</span>
            </div>
            <p class="text-2xl font-bold text-white mt-4">{{ orders.length }} hóa đơn</p>
            <p class="text-xs text-slate-500 font-medium mt-1">Trong bảng `orders`</p>
          </div>

          <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700/60 shadow-xl">
            <div class="flex justify-between items-start">
              <p class="text-sm font-semibold text-slate-400">Thành viên đăng ký</p>
              <span class="p-2 bg-slate-700/50 rounded-lg text-xl">👥</span>
            </div>
            <p class="text-2xl font-bold text-white mt-4">{{ users.length }} người dùng</p>
            <p class="text-xs text-slate-500 font-medium mt-1">Trong bảng `users`</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 bg-slate-800 rounded-2xl border border-slate-700/60 p-6 shadow-xl">
            <h3 class="text-lg font-bold text-white mb-4">🛒 Danh sách đơn hàng mới</h3>
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
                      <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">{{ translateStatus(order.status) }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="bg-slate-800 rounded-2xl border border-slate-700/60 p-6 shadow-xl">
            <h3 class="text-lg font-bold text-white mb-4">💬 Đánh giá gần đây (`reviews`)</h3>
            <div class="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              <div v-for="review in reviews" :key="review.id" class="bg-slate-900/50 p-4 rounded-xl border border-slate-700/30">
                <div class="flex justify-between items-center mb-1">
                  <span class="font-bold text-sm text-white">User: #{{ review.user_id }}</span>
                  <span class="text-yellow-400 text-xs">⭐ {{ review.rating }}/5</span>
                </div>
                <p class="text-xs text-slate-400">"{{ review.comment || 'Không có bình luận' }}"</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeMenu === 'products'" class="animate-fadeIn">
        <AdminProducts @refresh-data="fetchAllData" />
      </div>

      <div v-if="activeMenu === 'orders'" class="animate-fadeIn">
        <AdminOrders :initialOrders="orders" @refresh-data="fetchAllData" />
      </div>

      <div v-if="activeMenu === 'categories'" class="animate-fadeIn">
        <AdminCategories @refresh-data="fetchAllData" />
      </div>

      <div v-if="activeMenu === 'coupons'" class="animate-fadeIn">
        <AdminCoupons @refresh-data="fetchAllData" />
      </div>

      <div v-if="activeMenu === 'users'" class="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
        <div class="lg:col-span-2 bg-slate-800 p-6 rounded-2xl border border-slate-700/60 shadow-xl">
          <h3 class="text-lg font-bold text-white mb-4">Danh sách thành viên (`users`)</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead>
                <tr class="text-slate-400 border-b border-slate-700">
                  <th class="pb-3 font-semibold">Tên tài khoản</th>
                  <th class="pb-3 font-semibold">Email liên hệ</th>
                  <th class="pb-3 font-semibold">Vai trò</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-700/40">
                <tr v-for="user in users" :key="user.email" class="text-slate-300">
                  <td class="py-3 font-semibold text-white">{{ user.fullName || user.full_name }}</td>
                  <td class="py-3 font-mono text-slate-400 text-xs">{{ user.email }}</td>
                  <td class="py-3">
                    <span :class="['px-2 py-0.5 rounded text-xs font-bold', user.role === 'admin' ? 'bg-pink-500/20 text-pink-400' : 'bg-slate-900 text-slate-400']">
                      {{ user.role }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminProducts from '../components/AdminManager/AdminProducts.vue' 
import AdminCategories from '../components/AdminManager/AdminCategories.vue'
import AdminOrders from '../components/AdminManager/AdminOrders.vue' 
import AdminCoupons from '../components/AdminManager/AdminCoupons.vue' // Đã đảm bảo import đúng file

const activeMenu = ref('dashboard')
const orders = ref([])
const users = ref([])
const categories = ref([])
const brands = ref([])
const coupons = ref([])
const reviews = ref([])
const productCount = ref(0)

// Thêm cấu trúc menu mới cho "coupons" vào vị trí hợp lý
const menuItems = ref([
  { id: 'dashboard', name: 'Báo cáo tổng quan', icon: '📊' },
  { id: 'products', name: 'Quản lý Sản phẩm', icon: '📦' },
  { id: 'orders', name: 'Đơn hàng & Vận chuyển', icon: '📜' },
  { id: 'categories', name: 'Danh mục & Hãng', icon: '🏷️' },
  { id: 'coupons', name: 'Quản lý Khuyến mãi', icon: '🎟️' }, // Menu chức năng quản lý mã khuyến mãi mới
  { id: 'users', name: 'Người dùng hệ thống', icon: '👥' },
])

const totalRevenue = computed(() => {
  return orders.value.reduce((sum, order) => sum + Number(order.total || order.total_price || 0), 0)
})

const translateStatus = (status) => {
  const statusMap = {
    'pending': 'Đang xử lý ⏳',
    'confirmed': 'Đã xác nhận 🤝',
    'shipping': 'Đang giao 🚚',
    'completed': 'Hoàn thành 🎉',
    'cancelled': 'Đã hủy ❌'
  };
  return statusMap[status] || status || 'Chờ xử lý';
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return { 'Authorization': `Bearer ${token}` }
}

const fetchAllData = async () => {
  try {
    const authHeaders = { headers: getAuthHeaders() }

    const resProd = await fetch('http://localhost:3000/api/products')
    const dataProd = await resProd.json()
    if (dataProd.success) productCount.value = dataProd.data.length

    const resOrders = await fetch('http://localhost:3000/api/orders', authHeaders)
    const dataOrders = await resOrders.json()
    if (dataOrders.success) orders.value = dataOrders.data || []

    const resUsers = await fetch('http://localhost:3000/api/users', authHeaders)
    const dataUsers = await resUsers.json()
    if (dataUsers.success) users.value = dataUsers.data || []

    const resCats = await fetch('http://localhost:3000/api/categories', authHeaders)
    const dataCats = await resCats.json()
    if (dataCats.success) categories.value = dataCats.data || []

    const resBrands = await fetch('http://localhost:3000/api/brands', authHeaders)
    const dataBrands = await resBrands.json()
    if (dataBrands.success) brands.value = dataBrands.data || []

    const resReviews = await fetch('http://localhost:3000/api/reviews', authHeaders)
    const dataReviews = await resReviews.json()
    if (dataReviews.success) reviews.value = dataReviews.data || []

    // Tải đồng bộ thêm danh sách mã khuyến mãi phục vụ hệ thống
    const resCoupons = await fetch('http://localhost:3000/api/coupons', authHeaders)
    const dataCoupons = await resCoupons.json()
    if (dataCoupons.success) coupons.value = dataCoupons.data || []

  } catch (error) {
    console.error('Lỗi khi tải dữ liệu tổng quan:', error)
  }
}

const navigateMenu = (menuId) => {
  activeMenu.value = menuId
  fetchAllData()
}

onMounted(() => {
  fetchAllData()
})
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.4s ease-out forwards;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #0f172a;
}
::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #475569;
}
</style>