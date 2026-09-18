<template>
  <!-- Sửa min-h-screen -> h-screen overflow-hidden để khóa khung chính -->
  <div class="h-screen w-screen bg-slate-900 text-slate-100 flex font-sans overflow-hidden">
    
    <!-- THANH SIDEBAR MENU (Cố định 100% không bị cuộn theo) -->
    <aside class="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0 h-full">
      <div class="p-6 overflow-y-auto flex-1">
        <div class="flex items-center gap-3 mb-8">
          <div class="w-10 h-10 bg-gradient-to-tr from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/20 flex-shrink-0">
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
              'w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition duration-200 group',
              activeMenu === item.id 
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-rose-500/10' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            ]"
          >
            <!-- Ô chứa icon: khi active sẽ mang màu trắng, chưa active sẽ mang màu riêng của từng mục -->
            <span 
              :class="[
                'w-6 text-center text-base flex-shrink-0 transition-colors duration-200',
                activeMenu === item.id ? 'text-white' : item.color
              ]"
            >
              <font-awesome-icon :icon="item.icon" />
            </span>
            <span>{{ item.name }}</span>
          </button>
        </nav>
      </div>

      <div class="p-4 border-t border-slate-800 bg-slate-950/50 flex flex-col gap-2 flex-shrink-0">
        <div class="flex items-center gap-3 px-2 py-1">
          <div class="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center border border-pink-500/30 text-pink-400 font-bold flex-shrink-0">
            AD
          </div>
          <div class="min-w-0">
            <p class="text-sm font-semibold truncate text-white">Administrator</p>
            <p class="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Trực tuyến
            </p>
          </div>
        </div>
        <button @click="$router.push('/')" class="w-full mt-2 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition flex items-center justify-center gap-2">
          <font-awesome-icon :icon="['fas', 'arrow-left']" class="text-pink-400" />
          <span>Về trang chủ shop</span>
        </button>
      </div>
    </aside>

    <!-- NỘI DUNG CHÍNH KHÔNG GIAN LÀM VIỆC -->
    <main class="flex-1 min-w-0 h-full overflow-y-auto p-6 lg:p-8">
      
      <div v-if="activeMenu === 'dashboard'">
        <AdminReport 
          :orders="orders"
          :users="users"
          :reviews="reviews"
          :productCount="productCount"
        />
      </div>

      <!-- Khu vực Chat Admin -->
      <div v-if="activeMenu === 'chat'" class="animate-fadeIn h-full">
        <AdminChat />
      </div>

      <div v-if="activeMenu === 'products'" class="animate-fadeIn">
        <AdminProducts @refresh-data="handleRefresh" />
      </div>

      <div v-if="activeMenu === 'orders'" class="animate-fadeIn">
        <AdminOrders :initialOrders="orders" @refresh-data="handleRefresh" />
      </div>

      <div v-if="activeMenu === 'payments'" class="animate-fadeIn">
        <AdminPayments @refresh-data="handleRefresh" />
      </div>

      <div v-if="activeMenu === 'categories'" class="animate-fadeIn">
        <AdminCategories @refresh-data="handleRefresh" />
      </div>

      <div v-if="activeMenu === 'coupons'" class="animate-fadeIn">
        <AdminCoupons @refresh-data="handleRefresh" />
      </div>

      <div v-if="activeMenu === 'users'" class="animate-fadeIn">
        <AdminUsers :users="users" @refresh-data="handleRefresh" />
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminReport from '../components/AdminManager/AdminReport.vue'
import AdminProducts from '../components/AdminManager/AdminProducts.vue' 
import AdminCategories from '../components/AdminManager/AdminCategories.vue'
import AdminOrders from '../components/AdminManager/AdminOrders.vue' 
import AdminCoupons from '../components/AdminManager/AdminCoupons.vue'
import AdminUsers from '../components/AdminManager/AdminUsers.vue'
import AdminPayments from '../components/AdminManager/AdminPayments.vue'
import AdminChat from '../components/AdminManager/ChatAdmin.vue'

const activeMenu = ref('dashboard')
const orders = ref([])
const users = ref([])
const categories = ref([])
const brands = ref([])
const coupons = ref([])
const reviews = ref([])
const payments = ref([])
const productCount = ref(0)

// Thêm thuộc tính `color` chứa class màu Tailwind cho từng icon
const menuItems = ref([
  { 
    id: 'dashboard', 
    name: 'Báo cáo tổng quan', 
    icon: ['fas', 'chart-pie'], 
    color: 'text-indigo-400 group-hover:text-indigo-300' 
  },
  { 
    id: 'chat', 
    name: 'Hỗ trợ khách hàng', 
    icon: ['fas', 'comments'], 
    color: 'text-sky-400 group-hover:text-sky-300' 
  },
  { 
    id: 'products', 
    name: 'Quản lý Sản phẩm', 
    icon: ['fas', 'box-archive'], 
    color: 'text-amber-400 group-hover:text-amber-300' 
  },
  { 
    id: 'orders', 
    name: 'Đơn hàng & Vận chuyển', 
    icon: ['fas', 'file-invoice-dollar'], 
    color: 'text-emerald-400 group-hover:text-emerald-300' 
  },
  { 
    id: 'payments', 
    name: 'Quản lý Thanh toán', 
    icon: ['fas', 'credit-card'], 
    color: 'text-violet-400 group-hover:text-violet-300' 
  },
  { 
    id: 'categories', 
    name: 'Danh mục & Hãng', 
    icon: ['fas', 'tags'], 
    color: 'text-teal-400 group-hover:text-teal-300' 
  },
  { 
    id: 'coupons', 
    name: 'Quản lý Khuyến mãi', 
    icon: ['fas', 'ticket'], 
    color: 'text-rose-400 group-hover:text-rose-300' 
  },
  { 
    id: 'users', 
    name: 'Người dùng hệ thống', 
    icon: ['fas', 'users-gear'], 
    color: 'text-cyan-400 group-hover:text-cyan-300' 
  },
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

    const resUsers = await fetch('http://localhost:3000/api/auth/users', authHeaders)
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

    const resPayments = await fetch('http://localhost:3000/api/payments', authHeaders)
    const dataPayments = await resPayments.json()
    if (dataPayments.success) payments.value = dataPayments.data || []

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
  if (menuId !== 'chat') {
    fetchAllData()
  }
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