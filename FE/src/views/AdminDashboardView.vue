<template>
  <div class="min-h-screen bg-slate-900 text-slate-100 flex font-sans">
    
    <!-- THANH SIDEBAR MENU -->
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
           Về trang chủ shop
        </button>
      </div>
    </aside>

    <!-- NỘI DUNG CHÍNH KHÔNG GIAN LÀM VIỆC -->
    <main class="flex-1 min-w-0 overflow-y-auto p-6 lg:p-8">
      
      <!-- ĐÃ CẬP NHẬT: Thay thế thẻ gọi thành AdminReport đồng bộ với script -->
      <div v-if="activeMenu === 'dashboard'">
        <AdminReport 
          :orders="orders"
          :users="users"
          :reviews="reviews"
          :productCount="productCount"
        />
      </div>

      <div v-if="activeMenu === 'products'" class="animate-fadeIn">
        <AdminProducts @refresh-data="handleRefresh" />
      </div>

      <div v-if="activeMenu === 'orders'" class="animate-fadeIn">
        <AdminOrders :initialOrders="orders" @refresh-data="handleRefresh" />
      </div>

      <div v-if="activeMenu === 'categories'" class="animate-fadeIn">
        <AdminCategories @refresh-data="handleRefresh" />
      </div>

      <div v-if="activeMenu === 'coupons'" class="animate-fadeIn">
        <AdminCoupons @refresh-data="handleRefresh" />
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
import { ref, onMounted } from 'vue'
// Đã cấu hình import chính xác tệp AdminReport.vue
import AdminReport from '../components/AdminManager/AdminReport.vue'
import AdminProducts from '../components/AdminManager/AdminProducts.vue' 
import AdminCategories from '../components/AdminManager/AdminCategories.vue'
import AdminOrders from '../components/AdminManager/AdminOrders.vue' 
import AdminCoupons from '../components/AdminManager/AdminCoupons.vue'

const activeMenu = ref('dashboard')
const orders = ref([])
const users = ref([])
const categories = ref([])
const brands = ref([])
const coupons = ref([])
const reviews = ref([])
const productCount = ref(0)

const menuItems = ref([
  { id: 'dashboard', name: 'Báo cáo tổng quan', icon: '📊' },
  { id: 'products', name: 'Quản lý Sản phẩm', icon: '📦' },
  { id: 'orders', name: 'Đơn hàng & Vận chuyển', icon: '📜' },
  { id: 'categories', name: 'Danh mục & Hãng', icon: '🏷️' },
  { id: 'coupons', name: 'Quản lý Khuyến mãi', icon: '🎟️' },
  { id: 'users', name: 'Người dùng hệ thống', icon: '👥' },
])

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

    const resOrders = await fetch('http://localhost:3000/api/orders/admin', authHeaders)
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

    const resCoupons = await fetch('http://localhost:3000/api/coupons', authHeaders)
    const dataCoupons = await resCoupons.json()
    if (dataCoupons.success) coupons.value = dataCoupons.data || []

  } catch (error) {
    console.error('Lỗi khi tải dữ liệu tổng quan:', error)
  }
}

const handleRefresh = (updatedData) => {
  if (updatedData && Array.isArray(updatedData)) {
    orders.value = updatedData
  } else {
    fetchAllData()
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