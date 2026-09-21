<template>
  <div class="animate-fadeIn p-2">
    <!-- Tiêu đề chính -->
    <div class="flex items-center gap-3 border-b border-slate-200 pb-4 mb-6">
      <span class="inline-block w-1.5 h-6 bg-pink-500 rounded-full"></span>
      <h2 class="text-xl font-bold text-slate-800 tracking-wide flex items-center gap-2">
        <font-awesome-icon :icon="['fas', 'receipt']" class="text-pink-500 text-lg" />
        <span>Chi Tiết Đơn Hàng</span>
      </h2>
    </div>

    <div v-if="selectedOrder" class="space-y-6">
      <!-- Grid Thông Tin Tổng Quan -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <p class="text-slate-400 text-xs font-bold mb-1 tracking-wider flex items-center gap-1.5">
            <font-awesome-icon :icon="['fas', 'receipt']" class="text-[11px]" />
            MÃ ĐƠN HÀNG
          </p>
          <p class="text-slate-800 font-extrabold text-lg">#{{ selectedOrder.id }}</p>
        </div>
        
        <div class="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <p class="text-slate-400 text-xs font-bold mb-1 tracking-wider flex items-center gap-1.5">
            <font-awesome-icon :icon="['fas', 'calendar-days']" class="text-[11px]" />
            NGÀY ĐẶT
          </p>
          <p class="text-slate-800 font-bold text-base">{{ formatDate(selectedOrder.created_at || selectedOrder.date) }}</p>
        </div>
        
        <div class="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col justify-center">
          <p class="text-slate-400 text-xs font-bold mb-1.5 tracking-wider flex items-center gap-1.5">
            <font-awesome-icon :icon="['fas', 'clock']" class="text-[11px]" />
            TRẠNG THÁI ĐƠN
          </p>
          <div>
            <span :class="[
              'px-2.5 py-1 rounded-lg text-xs font-bold inline-block border',
              selectedOrder.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
              selectedOrder.status === 'shipping' ? 'bg-blue-50 text-blue-600 border-blue-200' :
              selectedOrder.status === 'confirmed' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' :
              selectedOrder.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-200' :
              'bg-rose-50 text-rose-600 border-rose-200'
            ]">
              {{ translateStatus(selectedOrder.status) }}
            </span>
          </div>
        </div>
        
        <div class="bg-pink-50/40 rounded-xl p-4 border border-pink-200 shadow-sm">
          <p class="text-pink-500 text-xs font-bold mb-1 tracking-wider flex items-center gap-1.5">
            <font-awesome-icon :icon="['fas', 'sack-dollar']" class="text-[11px]" />
            TỔNG TIỀN
          </p>
          <p class="text-pink-500 font-black text-xl">{{ (selectedOrder.total || selectedOrder.total_amount || 0).toLocaleString() }}<span class="text-sm ml-0.5">₫</span></p>
        </div>
      </div>

      <!-- Khối Thông Tin Thanh Toán -->
      <div class="bg-white rounded-xl p-5 md:p-6 border border-slate-200 shadow-sm">
        <h3 class="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
          <font-awesome-icon :icon="['fas', 'credit-card']" class="text-violet-500" />
          <span>Thông Tin Thanh Toán</span>
        </h3>
        
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <!-- Phương thức thanh toán -->
          <div>
            <p class="text-slate-400 text-xs font-bold mb-1 tracking-wider uppercase">Phương thức thanh toán</p>
            <p class="text-slate-800 font-bold text-sm">
              {{ translatePaymentMethod(paymentMethod) }}
            </p>
          </div>

          <!-- Trạng thái thanh toán & Mốc thời gian -->
          <div v-if="isOnlinePayment(paymentMethod)" class="flex flex-col sm:items-end">
            <p class="text-slate-400 text-xs font-bold mb-1.5 tracking-wider uppercase">Trạng thái thanh toán</p>
            
            <div class="flex flex-col sm:items-end gap-2">
              <!-- Badge Trạng thái -->
              <div>
                <span :class="[
                  'px-2.5 py-1 rounded-lg text-xs font-bold border inline-block uppercase tracking-wide shadow-sm',
                  getPaymentStatusClass(paymentStatus)
                ]">
                  {{ translatePaymentStatus(paymentStatus) }}
                </span>
              </div>

              <!-- Thời gian tạo & Cập nhật thanh toán -->
              <div v-if="paymentCreatedAt" class="text-xs text-slate-500 space-y-1 sm:text-right mt-1">
                <!-- Hàng 1: Thời gian tạo thanh toán -->
                <div class="flex items-center gap-1.5 justify-start sm:justify-end">
                  <span class="text-slate-400 font-medium">Tạo lúc:</span>
                  <span class="font-mono font-bold text-slate-700 bg-slate-200/60 px-1.5 py-0.5 rounded">{{ formatTime(paymentCreatedAt) }}</span>
                  <span class="text-slate-400">•</span>
                  <span class="font-medium text-slate-600">{{ formatDateShort(paymentCreatedAt) }}</span>
                </div>

                <!-- Hàng 2: Thời gian cập nhật thanh toán -->
                <div v-if="paymentUpdatedAt && paymentUpdatedAt !== paymentCreatedAt" class="flex items-center gap-1.5 justify-start sm:justify-end text-slate-400">
                  <span>Cập nhật:</span>
                  <span class="font-mono font-semibold text-slate-600 bg-slate-200/40 px-1.5 py-0.5 rounded">{{ formatTime(paymentUpdatedAt) }}</span>
                  <span>•</span>
                  <span class="text-slate-500">{{ formatDateShort(paymentUpdatedAt) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Danh Sách Sản Phẩm Đặt Hàng -->
      <div class="bg-white rounded-xl p-5 md:p-6 border border-slate-200 shadow-sm">
        <h3 class="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
          <font-awesome-icon :icon="['fas', 'boxes-stacked']" class="text-amber-500" />
          <span>Sản Phẩm Đặt Hàng</span>
        </h3>
        <div class="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-[#fcfbfc]">
          <div 
            v-for="item in selectedOrder.items" 
            :key="item.id"
            class="flex items-center justify-between p-4 hover:bg-white transition duration-200"
          >
            <div class="flex items-center gap-4 flex-1 min-w-0">
              <!-- Ảnh sản phẩm -->
              <div class="w-14 h-14 bg-white rounded-lg flex items-center justify-center text-2xl flex-shrink-0 border border-slate-200 overflow-hidden shadow-sm">
                <img v-if="item.image" :src="item.image.startsWith('http') ? item.image : `http://localhost:3000/uploads/${item.image}`" :alt="item.name" class="w-full h-full object-cover" />
                <span v-else>{{ getProductIcon(item.category_name) }}</span>
              </div>
              <!-- Tên và số lượng -->
              <div class="min-w-0">
                <p class="text-slate-800 font-bold text-sm truncate">{{ item.name }}</p>
                <p class="text-slate-400 text-xs mt-0.5 font-medium">Số lượng: <span class="text-slate-700 font-bold">x{{ item.quantity }}</span></p>
              </div>
            </div>

            <!-- Giá thành -->
            <div class="text-right flex-shrink-0 pl-4">
              <p class="text-slate-400 text-xs font-medium">{{ (item.price || 0).toLocaleString() }}₫</p>
              <p class="text-pink-500 font-bold text-sm mt-0.5">{{ ((item.price || 0) * (item.quantity || 1)).toLocaleString() }}₫</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Khối Địa Chỉ Giao Hàng -->
      <div class="bg-white rounded-xl p-5 md:p-6 border border-slate-200 shadow-sm">
        <h3 class="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
          <font-awesome-icon :icon="['fas', 'location-dot']" class="text-rose-500" />
          <span>Địa Chỉ Giao Hàng</span>
        </h3>
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <p class="text-slate-700 text-sm font-semibold leading-relaxed">
            {{ selectedOrder.shipping_address || selectedOrder.address || 'Chưa cập nhật địa chỉ nhận hàng.' }}
          </p>
        </div>
      </div>

      <!-- Khu Vực Nút Điều Hướng -->
      <div class="flex items-center gap-3 pt-2">
        <button 
          @click="$emit('back-to-history')" 
          class="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 font-bold rounded-xl border border-slate-300 shadow-sm transition text-sm flex items-center gap-2"
        >
          <font-awesome-icon :icon="['fas', 'arrow-left']" />
          <span>Quay Lại</span>
        </button>
        
        <button 
          v-if="selectedOrder.status === 'pending'" 
          @click="handleCancelOrder" 
          :disabled="isCancelling"
          class="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white font-bold rounded-xl shadow-sm transition disabled:opacity-50 flex items-center gap-2 text-sm transform active:scale-[0.98]"
        >
          <span v-if="isCancelling" class="inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
          <font-awesome-icon v-else :icon="['fas', 'ban']" />
          <span>Hủy Đơn Hàng</span>
        </button>

        <button 
          v-if="selectedOrder.status === 'completed'"
          @click="openReviewModal(selectedOrder.items[0])"
          class="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-sm transition flex items-center gap-2 text-sm transform active:scale-[0.98]"
        >
          <font-awesome-icon :icon="['fas', 'star']" />
          <span>Đánh Giá Sản Phẩm</span>
        </button>
      </div>
    </div>
    
    <!-- Trường hợp chưa chọn đơn hàng -->
    <div v-else class="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-md mx-auto">
      <div class="text-5xl mb-4 text-slate-300">
        <font-awesome-icon :icon="['fas', 'clipboard-list']" />
      </div>
      <p class="text-lg text-slate-700 mb-5 font-bold">Vui lòng chọn một đơn hàng</p>
      <button 
        @click="$emit('go-to-history')" 
        class="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-xl shadow-sm text-sm tracking-wide transition duration-300 flex items-center gap-2 mx-auto"
      >
        <font-awesome-icon :icon="['fas', 'file-invoice-dollar']" />
        <span>Xem Lịch Sử Mua Hàng</span>
      </button>
    </div>

    <!-- Modal Đánh Giá -->
    <ReviewModal 
      :is-open="showReviewModal" 
      :product="selectedItemForReview"
      @close="showReviewModal = false"
      @success="handleReviewSuccess"
    />
  </div>
</template>

<script>
import axios from 'axios';
import ReviewModal from './ReviewsModal.vue';

export default {
  name: 'OrderDetailTab',
  components: {
    ReviewModal
  },
  props: {
    selectedOrder: { type: Object, default: null },
    formatDate: { type: Function, required: true },
    getProductIcon: { type: Function, required: true }
  },
  data() {
    return {
      isCancelling: false,
      showReviewModal: false,
      selectedItemForReview: null,
      paymentInfo: null
    };
  },

  watch: {
    selectedOrder: {
      immediate: true,
      handler(newVal) {
        if (newVal && newVal.id) {
          this.fetchPaymentForOrder(newVal.id);
        } else {
          this.paymentInfo = null;
        }
      }
    }
  },
  computed: {
    paymentMethod() {
      if (!this.selectedOrder) return '';
      return this.paymentInfo?.payment_method ||
             this.selectedOrder.payment_method || 
             this.selectedOrder.payment?.payment_method || 
             'momo';
    },
    paymentStatus() {
      if (!this.selectedOrder) return 'unpaid';
      return this.paymentInfo?.status ||
             this.selectedOrder.payment_status || 
             this.selectedOrder.payment?.status || 
             'unpaid';
    },
    paymentUpdatedAt() {
      if (!this.selectedOrder) return null;
      return this.paymentInfo?.updated_at ||
             this.selectedOrder.payment_updated_at || 
             this.selectedOrder.payment?.updated_at || 
             this.selectedOrder.updated_at ||
             null;
    },
    paymentCreatedAt() {
      if (!this.selectedOrder) return null;
      return this.paymentInfo?.created_at ||
             this.selectedOrder.payment_created_at ||
             this.selectedOrder.payment?.created_at ||
             null;
    }
  },
  methods: {
    translateStatus(status) {
      const statusMap = {
        'pending': 'Đang xử lý',
        'confirmed': 'Đã xác nhận',
        'shipping': 'Đang giao hàng',
        'completed': 'Đã hoàn thành',
        'cancelled': 'Đã hủy đơn'
      };
      return statusMap[status] || status;
    },

    translatePaymentMethod(method) {
      const methodMap = {
        'cod': 'Thanh toán khi nhận hàng (COD)',
        'cash': 'Tiền mặt',
        'momo': 'Ví MoMo',
        'bank': 'Chuyển khoản ngân hàng',
        'credit_cash': 'Ngân hàng',
        'credit-cash': 'Ngân hàng',
        'vnpay': 'VNPay'
      };
      return methodMap[method?.toLowerCase()] || method || 'Ví MoMo';
    },

    formatTime(dateStr) {
      if (!dateStr) return '—';
      try {
        return new Date(dateStr).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      } catch (e) {
        return dateStr;
      }
    },

    formatDateShort(dateStr) {
      if (!dateStr) return '—';
      try {
        return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
      } catch (e) {
        return dateStr;
      }
    },

    translatePaymentStatus(status) {
      const statusMap = {
        'pending': 'Chờ thanh toán',
        'unpaid': 'Chưa thanh toán',
        'paid': 'Đã thanh toán',
        'success': 'Đã thanh toán',
        'completed': 'Đã thanh toán',
        'failed': 'Thất bại',
        'cancelled': 'Đã hủy'
      };
      return statusMap[status?.toLowerCase()] || status;
    },

    getPaymentStatusClass(status) {
      switch (status?.toLowerCase()) {
        case 'success':
        case 'paid':
        case 'completed':
          return 'bg-emerald-50 text-emerald-600 border-emerald-200';
        case 'pending':
          return 'bg-amber-50 text-amber-600 border-amber-200';
        case 'unpaid':
        case 'failed':
        case 'cancelled':
        default:
          return 'bg-rose-50 text-rose-600 border-rose-200';
      }
    },

    isOnlinePayment(method) {
      const codMethods = ['cod', 'cash'];
      return !codMethods.includes(method?.toLowerCase());
    },

    async fetchPaymentForOrder(orderId) {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get(`http://localhost:3000/api/payments/order/${orderId}`, { headers });
        if (res.data && res.data.success) {
          this.paymentInfo = res.data.data;
        } else {
          this.paymentInfo = null;
        }
      } catch (err) {
        console.warn('Không lấy được thông tin payment cho order', orderId, err);
        this.paymentInfo = null;
      }
    },
    
    async handleCancelOrder() {
      if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác.")) {
        return;
      }

      this.isCancelling = true;
      try {
        const token = localStorage.getItem('token');
        
        const response = await axios.put(
          `http://localhost:3000/api/orders/${this.selectedOrder.id}`,
          { status: 'cancelled' },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data && response.data.success) {
          alert("Bạn đã hủy đơn hàng thành công!");
          this.selectedOrder.status = 'cancelled';
          this.$emit('refresh-orders');
        } else {
          alert("Không thể hủy đơn hàng: " + (response.data.message || "Lỗi chưa xác định"));
        }
      } catch (error) {
        console.error("Lỗi khi hủy đơn hàng phía Client:", error);
        alert(error.response?.data?.message || "Hệ thống gặp lỗi trong quá trình thực thi hủy đơn hàng!");
      } finally {
        this.isCancelling = false;
      }
    },

    openReviewModal(item) {
      this.selectedItemForReview = item || (this.selectedOrder.items && this.selectedOrder.items[0]);
      this.showReviewModal = true;
    },

    handleReviewSuccess() {
      // Logic xử lý sau khi gửi đánh giá thành công
    }
  }
}
</script>

<style scoped>
button {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.animate-spin {
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>