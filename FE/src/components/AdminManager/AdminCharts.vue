<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 animate-fadeIn">
    <!-- Biểu đồ Doanh Thu -->
    <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700/60 shadow-xl">
      <div class="flex items-center gap-2 mb-4">
        <font-awesome-icon :icon="['fas', 'chart-line']" class="text-rose-400 text-lg" />
        <h3 class="text-lg font-bold text-white">Xu Hướng Doanh Thu</h3>
      </div>
      <div class="h-64 relative">
        <Line v-if="chartData.labels.length > 0" :data="chartData" :options="chartOptions" />
        <div v-else class="h-full flex items-center justify-center text-slate-400 text-xs">
          Chưa có dữ liệu hóa đơn để vẽ biểu đồ xu hướng
        </div>
      </div>
    </div>

    <!-- Biểu đồ Trạng Thái Đơn Hàng -->
    <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700/60 shadow-xl">
      <div class="flex items-center gap-2 mb-4">
        <font-awesome-icon :icon="['fas', 'chart-pie']" class="text-indigo-400 text-lg" />
        <h3 class="text-lg font-bold text-white">Phân Bổ Trạng Thái Đơn Hàng</h3>
      </div>
      <div class="h-64 relative flex justify-center">
        <Doughnut v-if="doughnutData.labels.length > 0" :data="doughnutData" :options="chartOptions" />
        <div v-else class="h-full flex items-center justify-center text-slate-400 text-xs">
          Chưa có dữ liệu trạng thái
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'
import { Line, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  ArcElement
} from 'chart.js'

// Đăng ký các thành phần bắt buộc của Chart.js
ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale, ArcElement)

const props = defineProps({
  orders: { type: Array, default: () => [] }
})

// 1. Xử lý dữ liệu cho biểu đồ đường (Doanh thu theo 7 đơn hàng gần nhất)
const chartData = computed(() => {
  const recentOrders = [...props.orders].slice(0, 7).reverse()
  
  return {
    labels: recentOrders.map(o => `#${o.id}`),
    datasets: [
      {
        label: 'Doanh thu (₫)',
        backgroundColor: '#ec4899',
        borderColor: '#f43f5e',
        borderWidth: 2,
        data: recentOrders.map(o => Number(o.total || o.total_price || 0)),
        tension: 0.3
      }
    ]
  }
})

// 2. Xử lý dữ liệu cho biểu đồ tròn (Tỷ lệ trạng thái đơn hàng)
const doughnutData = computed(() => {
  const statusCounts = { pending: 0, confirmed: 0, shipping: 0, completed: 0, cancelled: 0 }
  
  props.orders.forEach(o => {
    if (statusCounts[o.status] !== undefined) {
      statusCounts[o.status]++
    }
  })

  return {
    labels: ['Đang xử lý', 'Đã xác nhận', 'Đang giao', 'Hoàn thành', 'Đã hủy'],
    datasets: [
      {
        backgroundColor: ['#f59e0b', '#6366f1', '#0ea5e9', '#10b981', '#f43f5e'],
        borderWidth: 0,
        data: [
          statusCounts.pending,
          statusCounts.confirmed,
          statusCounts.shipping,
          statusCounts.completed,
          statusCounts.cancelled
        ]
      }
    ]
  }
})

// Cấu hình hiển thị Chart
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: '#94a3b8' }
    }
  }
}
</script>