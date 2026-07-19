<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold text-white">Quản lý mã khuyến mãi</h2>
        <p class="text-slate-400 text-sm">Xem, thêm, sửa đổi dữ liệu kết nối trực tiếp bảng `coupons`.</p>
      </div>
      <button @click="openCouponModal(null)" class="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-bold rounded-xl shadow-lg transition duration-200 hover:opacity-90">
        ＋ Thêm mã khuyến mãi mới
      </button>
    </div>

    <div class="bg-slate-800 rounded-2xl border border-slate-700/60 shadow-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-900/40 text-slate-400 border-b border-slate-700">
            <tr>
              <th class="p-4 font-semibold">Mã code</th>
              <th class="p-4 font-semibold">Loại mã</th>
              <th class="p-4 font-semibold">Mức giảm giá</th>
              <th class="p-4 font-semibold">Điều kiện áp dụng</th>
              <th class="p-4 font-semibold">Số lượng còn lại</th>
              <th class="p-4 font-semibold">Ngày hết hạn</th>
              <th class="p-4 font-semibold text-center">Hành động</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-700/40">
            <tr v-for="coupon in coupons" :key="coupon.id" class="text-slate-300 hover:bg-slate-700/20 transition">
              <td class="p-4">
                <span class="font-mono font-bold text-white bg-slate-900 px-2.5 py-1 rounded border border-slate-700 text-sm">
                  {{ coupon.code }}
                </span>
              </td>
              <td class="p-4">
                <span v-if="coupon.type === 'freeship'" class="px-2 py-0.5 text-xs font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                   Free Ship
                </span>
                <span v-else-if="coupon.min_order_value > 0" class="px-2 py-0.5 text-xs font-bold rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                   Giảm giá có điều kiện
                </span>
                <span v-else class="px-2 py-0.5 text-xs font-bold rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                   Giảm giá không điều kiện
                </span>
              </td>
              <td class="p-4 font-semibold text-pink-400">
                <span v-if="coupon.type === 'freeship'">Miễn phí vận chuyển</span>
                <span v-else-if="coupon.type === 'percentage'">{{ coupon.discount_value }}%</span>
                <span v-else>{{ Number(coupon.discount_value).toLocaleString() }}₫</span>
              </td>
              <td class="p-4">
                <span v-if="coupon.min_order_value > 0">
                  Đơn tối thiểu <strong class="text-white">{{ Number(coupon.min_order_value).toLocaleString() }}₫</strong>
                </span>
                <span v-else class="text-slate-500">Không có điều kiện</span>
              </td>
              <td class="p-4">
                <span v-if="coupon.quantity === null || coupon.quantity === -1" class="text-slate-400 italic">
                  Vô hạn
                </span>
                <span v-else-if="coupon.quantity === 0" class="text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded border border-red-500/25">
                  Hết mã
                </span>
                <span v-else class="text-slate-300 font-medium">
                  {{ coupon.quantity }} lượt
                </span>
              </td>
              <td class="p-4 text-slate-400">{{ formatDate(coupon.expiry_date) }}</td>
              <td class="p-4 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button @click="openCouponModal(coupon)" class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold rounded-md transition">Sửa</button>
                  <button @click="handleDeleteCoupon(coupon.id)" class="px-3 py-1.5 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 text-xs font-semibold rounded-md transition">Xóa</button>
                </div>
              </td>
            </tr>
            <tr v-if="coupons.length === 0">
              <td colspan="7" class="text-center py-10 text-slate-500">Không có mã giảm giá nào trong CSDL.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="isCouponModalOpen" class="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[9999] animate-fadeIn">
        <div class="bg-slate-800 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          <div class="bg-slate-950 p-5 border-b border-slate-700 flex justify-between items-center shrink-0">
            <h3 class="text-xl font-bold text-white">{{ isCouponEditMode ? 'Cập nhật mã khuyến mãi' : 'Thêm mã khuyến mãi mới' }}</h3>
            <button type="button" @click="isCouponModalOpen = false" class="text-slate-400 hover:text-white text-xl">✕</button>
          </div>

          <form @submit.prevent="handleSubmitCoupon" class="p-6 space-y-4 text-sm text-slate-300 overflow-y-auto custom-input-form">
            <div>
              <label class="block text-xs font-bold text-slate-400 mb-1">Mã giảm giá (Code) *</label>
              <input v-model="couponForm.code" type="text" required placeholder="Ví dụ: FREESHIP50, GIAM20K" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white uppercase focus:outline-none focus:border-pink-500 font-mono font-bold"/>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-400 mb-1">Phân loại mã giảm giá *</label>
              <select v-model="couponForm.type" required class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-pink-500">
                <option value="fixed">Giảm theo số tiền cố định (₫)</option>
                <option value="percentage">Giảm theo phần trăm (%)</option>
                <option value="freeship">Mã miễn phí vận chuyển (Free ship)</option>
              </select>
            </div>

            <div v-if="couponForm.type !== 'freeship'">
              <label class="block text-xs font-bold text-slate-400 mb-1">
                Giá trị giảm giá ({{ couponForm.type === 'percentage' ? '%' : '₫' }}) *
              </label>
              <input v-model.number="couponForm.discount_value" type="number" required min="1" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-pink-500 no-spinners"/>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-400 mb-1">Giá trị đơn hàng tối thiểu áp dụng (₫)</label>
              <input v-model.number="couponForm.min_order_value" type="number" min="0" placeholder="Để trống hoặc điền 0 nếu không yêu cầu điều kiện" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-pink-500 no-spinners"/>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-400 mb-1">Số lượng mã được phát hành</label>
              <input v-model.number="couponForm.quantity" type="number" min="-1" placeholder="-1 nếu muốn cấp vô hạn số lượng" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-pink-500 no-spinners"/>
              <p class="text-[11px] text-slate-500 mt-1">Nhập <code class="text-pink-400">-1</code> để đặt số lượng không giới hạn.</p>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-400 mb-1">Ngày hết hạn *</label>
              <input v-model="couponForm.expiry_date" type="date" required class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-pink-500"/>
            </div>

            <div class="pt-4 flex justify-end gap-3 border-t border-slate-700 sticky bottom-0 bg-slate-800 pt-4">
              <button type="button" @click="isCouponModalOpen = false" class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition">Hủy</button>
              <button type="submit" :disabled="isSubmitting" class="px-5 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-bold transition flex items-center gap-2">
                <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                Lưu lại
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const coupons = ref([])
const isCouponModalOpen = ref(false)
const isCouponEditMode = ref(false)
const isSubmitting = ref(false)
const currentCouponId = ref(null)

const couponForm = ref({
  code: '',
  type: 'fixed',
  discount_value: 0,
  min_order_value: 0,
  quantity: -1,
  expiry_date: ''
})

const emit = defineEmits(['refresh-data'])

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('vi-VN')
}

const formatDateForInput = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toISOString().split('T')[0]
}

const fetchCoupons = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/coupons')
    const data = await res.json()
    if (data.success) coupons.value = data.data
  } catch (error) {
    console.error('Lỗi khi tải danh sách coupons:', error)
  }
}

const openCouponModal = (coupon = null) => {
  if (coupon) {
    isCouponEditMode.value = true
    currentCouponId.value = coupon.id
    couponForm.value = { 
      ...coupon,
      // Đảm bảo ép kiểu dạng số hoàn chỉnh, tránh nhầm lẫn giữa chuỗi và số khi truyền xuống input
      quantity: (coupon.quantity === null || coupon.quantity === '') ? -1 : Number(coupon.quantity),
      discount_value: Number(coupon.discount_value || 0),
      min_order_value: Number(coupon.min_order_value || 0),
      expiry_date: formatDateForInput(coupon.expiry_date)
    }
  } else {
    isCouponEditMode.value = false
    currentCouponId.value = null
    couponForm.value = { code: '', type: 'fixed', discount_value: 0, min_order_value: 0, quantity: -1, expiry_date: '' }
  }
  isCouponModalOpen.value = true
}

const handleSubmitCoupon = async () => {
  isSubmitting.value = true
  const url = isCouponEditMode.value 
    ? `http://localhost:3000/api/coupons/${currentCouponId.value}`
    : 'http://localhost:3000/api/coupons'
  
  const method = isCouponEditMode.value ? 'PUT' : 'POST'

  if (couponForm.value.type === 'freeship') {
    couponForm.value.discount_value = 0
  }

  // Khởi tạo bản sao payload để gửi đi bảo đảm dữ liệu thuần số
  const payload = {
    code: couponForm.value.code,
    type: couponForm.value.type,
    discount_value: Number(couponForm.value.discount_value || 0),
    min_order_value: Number(couponForm.value.min_order_value || 0),
    expiry_date: couponForm.value.expiry_date,
    quantity: null
  }

  // Xử lý biến số lượng một cách nghiêm ngặt trước khi đóng gói JSON
  const rawQty = couponForm.value.quantity;
  if (rawQty === '' || rawQty === null || Number(rawQty) === -1) {
    payload.quantity = null; // Chuyển thành NULL để đẩy vào CSDL là vô hạn
  } else {
    payload.quantity = Number(rawQty); // Số lượng hợp lệ
  }

  try {
    const response = await fetch(url, {
      method: method,
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    })
    const data = await response.json()
    if (data.success) {
      alert(data.message)
      isCouponModalOpen.value = false
      fetchCoupons()
      emit('refresh-data') 
    } else {
      alert(data.message)
    }
  } catch (error) {
    console.error('Lỗi lưu mã khuyến mãi:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleDeleteCoupon = async (id) => {
  if (!confirm('Bạn có chắc chắn muốn xóa mã giảm giá này?')) return
  try {
    const response = await fetch(`http://localhost:3000/api/coupons/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    const data = await response.json()
    if (data.success) {
      alert(data.message)
      fetchCoupons()
      emit('refresh-data')
    } else {
      alert(data.message)
    }
  } catch (error) {
    console.error('Lỗi khi xóa mã giảm giá:', error)
  }
}

onMounted(() => {
  fetchCoupons()
})
</script>

<style scoped>
/* Ẩn mũi tên tăng giảm trên trình duyệt Chrome, Safari, Edge, Opera */
.no-spinners::-webkit-outer-spin-button,
.no-spinners::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Ẩn mũi tên tăng giảm trên trình duyệt Firefox */
.no-spinners {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>