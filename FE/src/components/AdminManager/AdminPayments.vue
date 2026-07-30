<template>
  <div class="space-y-6">
    <!-- Header (Đã bỏ nút Tạo giao dịch mới) -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold text-white">Quản lý thanh toán</h2>
        <p class="text-slate-400 text-sm">Xem và duyệt trạng thái các giao dịch thanh toán từ khách hàng.</p>
      </div>
    </div>

    <!-- Table Danh Sách Payments -->
    <div class="bg-slate-800 rounded-2xl border border-slate-700/60 shadow-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-900/40 text-slate-400 border-b border-slate-700">
            <tr>
              <th class="p-4 font-semibold">ID</th>
              <th class="p-4 font-semibold">Mã đơn hàng (Order ID)</th>
              <th class="p-4 font-semibold">Phương thức</th>
              <th class="p-4 font-semibold">Số tiền</th>
              <th class="p-4 font-semibold">Nội dung chuyển khoản</th>
              <th class="p-4 font-semibold">Thời gian tạo</th>
              <th class="p-4 font-semibold">Cập nhật</th>
              <th class="p-4 font-semibold">Trạng thái</th>
              <th class="p-4 font-semibold text-center">Hành động</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-700/40">
            <tr v-for="item in payments" :key="item.id" class="text-slate-300 hover:bg-slate-700/20 transition">
              <td class="p-4 font-mono text-slate-400">#{{ item.id }}</td>
              <td class="p-4">
                <span class="font-bold text-white">Đơn hàng #{{ item.order_id }}</span>
              </td>
              <td class="p-4 uppercase font-semibold text-pink-400">
                {{ formatPaymentMethod(item.payment_method) }}
              </td>
              <td class="p-4 font-bold text-emerald-400 text-base">
                {{ Number(item.amount).toLocaleString() }}₫
              </td>
              <td class="p-4 font-mono text-xs text-slate-300">
                {{ item.content || '—' }}
              </td>
              <td class="p-4 text-xs text-slate-300">
                {{ formatDate(item.created_at) }}
              </td>
              <td class="p-4 text-xs text-slate-300">
                {{ formatDate(item.updated_at) }}
              </td>
              <td class="p-4 align-middle text-center whitespace-nowrap">
                <span :class="['px-2.5 py-1 rounded-md text-xs font-bold border inline-flex items-center justify-center', getStatusBadgeClass(item.status)]">
                  {{ formatStatusText(item.status) }}
                </span>
              </td>
              <!-- Cột Hành động với 2 nút Duyệt trực tiếp -->
              <td class="p-4 text-center align-middle whitespace-nowrap">
                <div class="flex items-center justify-center gap-2">
                  <button 
                    @click="updateStatus(item.id, 'completed')"
                    :disabled="item.status === 'completed' || loadingId === item.id"
                    :class="[
                      'px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1',
                      item.status === 'completed' 
                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                    ]"
                  >
                    ✓ Hoàn thành
                  </button>

                  <button 
                    @click="updateStatus(item.id, 'failed')"
                    :disabled="item.status === 'failed' || loadingId === item.id"
                    :class="[
                      'px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1',
                      item.status === 'failed' 
                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                        : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20'
                    ]"
                  >
                    ✕ Thất bại
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="payments.length === 0">
              <td colspan="9" class="text-center py-10 text-slate-500">
                Không có giao dịch thanh toán nào trong CSDL.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const payments = ref([])
const loadingId = ref(null)

const emit = defineEmits(['refresh-data'])

const getAuthHeadersSafe = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  }
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` 
  }
}

// 1. Tải danh sách giao dịch thanh toán
const fetchPayments = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/payments', {
          headers: getAuthHeadersSafe()
    })
    const data = await res.json()
    if (data.success) {
      payments.value = data.data
    }
  } catch (error) {
    console.error('Lỗi khi tải danh sách thanh toán:', error)
  }
}

// 2. Hàm chuyển đổi trạng thái khi ấn nút Hoàn thành / Thất bại
const updateStatus = async (paymentId, newStatus) => {
  const statusText = newStatus === 'completed' ? 'HOÀN THÀNH' : 'THẤT BẠI'
  
  if (!confirm(`Bạn có chắc chắn muốn chuyển trạng thái giao dịch #${paymentId} thành "${statusText}"?`)) {
    return
  }

  loadingId.value = paymentId
  try {
    const response = await fetch(`http://localhost:3000/api/payments/${paymentId}`, {
      method: 'PUT',
          headers: getAuthHeadersSafe(),
      body: JSON.stringify({ status: newStatus })
    })

    const data = await response.json()
    if (data.success) {
      // Cập nhật lại UI dựa trên dữ liệu server trả về (bao gồm updated_at)
      const found = payments.value.find(p => p.id === paymentId)
      if (found) {
        found.status = data.data?.status || newStatus
        found.updated_at = data.data?.updated_at || found.updated_at
        found.created_at = data.data?.created_at || found.created_at
        found.payment_method = data.data?.payment_method || found.payment_method
      }

      emit('refresh-data')
    } else {
      alert('Không thể cập nhật: ' + data.message)
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái:', error)
    alert('Đã xảy ra lỗi khi kết nối tới Server')
  } finally {
    loadingId.value = null
  }
}

// Helper định dạng màu Badge
const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'completed':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    case 'pending':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    case 'failed':
      return 'bg-red-500/10 text-red-400 border-red-500/20'
    default:
      return 'bg-slate-900 text-slate-400 border-slate-700'
  }
}

// Helper định dạng chữ hiển thị
const formatStatusText = (status) => {
  const map = {
    pending: 'Đang chờ',
    completed: 'Đã hoàn thành',
    failed: 'Thất bại',
    refunded: 'Đã hoàn tiền'
  }
  return map[status] || status
}

// Helper định dạng ngày giờ (hiển thị theo locale Việt Nam)
const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  try {
    return new Date(dateStr).toLocaleString('vi-VN')
  } catch (e) {
    return dateStr
  }
}

// Helper chuyển tên phương thức thanh toán sang chuỗi hiển thị
const formatPaymentMethod = (method) => {
  if (!method) return '—'
  const m = method.toString().toLowerCase()
  const map = {
    cod: 'COD',
    cash: 'Tiền mặt',
    momo: 'MoMo',
    bank: 'Ngân hàng',
    credit_cash: 'Ngân hàng',
    'credit-cash': 'Ngân hàng',
    vnpay: 'VNPay'
  }
  return map[m] || method
}

onMounted(() => {
  fetchPayments()
})
</script>