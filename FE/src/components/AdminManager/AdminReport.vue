<template>
  <div class="space-y-8 animate-fadeIn">
    <!-- Tiêu đề & Cờ năm -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h2 class="text-3xl font-bold text-white">Báo cáo tổng quan</h2>
        <p class="text-slate-400 text-sm mt-1">Số liệu thống kê hoạt động kinh doanh thực tế từ CSDL.</p>
      </div>
      <div class="text-sm bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 text-slate-300">
         Hệ thống hoạt động: 2026
      </div>
    </div>

    <!-- 4 Khối Card Thống Kê Thống Kê Nhanh -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700/60 shadow-xl">
        <div class="flex justify-between items-start">
          <p class="text-sm font-semibold text-slate-400">Doanh thu hệ thống</p>
          <span class="p-2 bg-slate-700/50 rounded-lg text-xl"></span>
        </div>
        <p class="text-2xl font-bold text-emerald-400 mt-4">{{ totalRevenue.toLocaleString() }}₫</p>
        <p class="text-xs text-slate-500 font-medium mt-1">Tổng giá trị đơn hàng</p>
      </div>

      <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700/60 shadow-xl">
        <div class="flex justify-between items-start">
          <p class="text-sm font-semibold text-slate-400">Tổng số sản phẩm</p>
          <span class="p-2 bg-slate-700/50 rounded-lg text-xl"></span>
        </div>
        <p class="text-2xl font-bold text-white mt-4">{{ productCount }} mặt hàng</p>
        <p class="text-xs text-slate-500 font-medium mt-1">Trong bảng `products`</p>
      </div>

      <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700/60 shadow-xl">
        <div class="flex justify-between items-start">
          <p class="text-sm font-semibold text-slate-400">Tổng số đơn hàng</p>
          <span class="p-2 bg-slate-700/50 rounded-lg text-xl"></span>
        </div>
        <p class="text-2xl font-bold text-white mt-4">{{ orders.length }} hóa đơn</p>
        <p class="text-xs text-slate-500 font-medium mt-1">Trong bảng `orders`</p>
      </div>

      <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700/60 shadow-xl">
        <div class="flex justify-between items-start">
          <p class="text-sm font-semibold text-slate-400">Thành viên đăng ký</p>
          <span class="p-2 bg-slate-700/50 rounded-lg text-xl"></span>
        </div>
        <p class="text-2xl font-bold text-white mt-4">{{ users.length }} người dùng</p>
        <p class="text-xs text-slate-500 font-medium mt-1">Trong bảng `users`</p>
      </div>
    </div>

    <!-- Bảng Đơn Hàng Mới & Review Phụ Cận -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-slate-800 rounded-2xl border border-slate-700/60 p-6 shadow-xl">
        <h3 class="text-lg font-bold text-white mb-4"> Danh sách đơn hàng mới</h3>
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
        <h3 class="text-lg font-bold text-white mb-4"> Đánh giá gần đây (`reviews`)</h3>
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
    <AdminCharts :orders="orders" />
  </div>
  
</template>

<script setup>
import { defineProps, computed } from 'vue'
import AdminCharts from './AdminCharts.vue'

// Định nghĩa các props nhận từ component cha truyền xuống để render dữ liệu
const props = defineProps({
  orders: { type: Array, default: () => [] },
  users: { type: Array, default: () => [] },
  reviews: { type: Array, default: () => [] },
  productCount: { type: Number, default: 0 }
})

// Tính tổng doanh thu hệ thống dựa trên props orders
const totalRevenue = computed(() => {
  return props.orders.reduce((sum, order) => sum + Number(order.total || order.total_price || 0), 0)
})

const translateStatus = (status) => {
  const statusMap = {
    'pending': 'Đang xử lý ',
    'confirmed': 'Đã xác nhận ',
    'shipping': 'Đang giao ',
    'completed': 'Hoàn thành ',
    'cancelled': 'Đã hủy '
  };
  return statusMap[status] || status || 'Chờ xử lý';
}
</script>