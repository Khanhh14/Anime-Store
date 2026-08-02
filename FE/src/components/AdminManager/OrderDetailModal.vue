<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
    <div class="bg-[#1e293b] text-slate-100 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-700/60 animate-fadeIn flex flex-col max-h-[90vh]">
      
      <!-- Modal Header -->
      <div class="flex justify-between items-center pb-4 border-b border-slate-700/60">
        <div class="flex items-center gap-3">
          <h3 class="text-xl font-bold text-white">Chi Tiết Đơn Hàng #{{ order?.id }}</h3>
          <!-- Trạng thái đơn hàng -->
          <span :class="getStatusBadgeClass(order?.status)" class="px-2.5 py-0.5 text-xs font-bold rounded-full border">
            {{ formatStatusText(order?.status) }}
          </span>
        </div>
        <button @click="close" class="text-slate-400 hover:text-white text-2xl font-bold transition-colors leading-none">&times;</button>
      </div>

      <!-- Modal Body (Scrollable) -->
      <div v-if="order" class="space-y-5 py-4 overflow-y-auto pr-1">
        
        <!-- Khối 1: Thông tin chung & Thanh toán -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-800/40 p-4 rounded-xl border border-slate-700/40 text-sm">
          <div>
            <p class="text-[11px] text-slate-400 uppercase font-semibold">User ID</p>
            <p class="font-bold text-slate-200 mt-1">#{{ order.user_id }}</p>
          </div>

          <div>
            <p class="text-[11px] text-slate-400 uppercase font-semibold">Phương thức TT</p>
            <p class="font-bold text-pink-400 mt-1">{{ formatPaymentMethod(order.payment_method) }}</p>
          </div>

          <div>
            <p class="text-[11px] text-slate-400 uppercase font-semibold">Trạng thái TT</p>
            <span :class="getPaymentStatusBadge(order.payment_status)" class="inline-block px-2 py-0.5 text-[10px] font-bold rounded-md border mt-1">
              {{ formatPaymentStatus(order.payment_status) }}
            </span>
          </div>

          <div>
            <p class="text-[11px] text-slate-400 uppercase font-semibold">Thời gian tạo</p>
            <p class="font-bold text-slate-300 text-xs mt-1">{{ formatDate(order.created_at) }}</p>
          </div>
        </div>

        <!-- Khối 2: Địa chỉ giao hàng -->
        <div class="bg-slate-800/40 p-4 rounded-xl border border-slate-700/40">
          <h4 class="text-[11px] uppercase font-bold text-slate-400 mb-1.5 tracking-wider">Địa chỉ nhận hàng (shipping_address)</h4>
          <p class="text-sm text-slate-200 font-medium leading-relaxed">
            {{ order.shipping_address || 'Chưa cung cấp địa chỉ' }}
          </p>
        </div>

        <!-- Khối 3: Danh sách sản phẩm từ bảng order_items -->
        <div>
          <h4 class="text-[11px] uppercase font-bold text-slate-400 mb-3 tracking-wider">
            Danh sách sản phẩm ({{ order.items?.length || 0 }})
          </h4>

          <div class="space-y-2.5">
            <div 
              v-for="(item, idx) in (order.items || [])" 
              :key="item.id || idx" 
              class="flex items-center justify-between gap-4 bg-slate-800/80 p-3 rounded-xl border border-slate-700/50 hover:border-slate-600 transition"
            >
              <div class="flex items-center gap-3">
                <!-- Ảnh sản phẩm -->
                <div class="w-12 h-12 bg-slate-900 rounded-lg overflow-hidden border border-slate-700 flex-shrink-0">
                  <img 
                    :src="item.image ? `http://localhost:3000/uploads/${item.image}` : 'https://placehold.co/100x100?text=Anime'" 
                    class="w-full h-full object-cover" 
                    alt="Product"
                  />
                </div>
                <!-- Tên & Số lượng -->
                <div>
                  <p class="text-sm font-bold text-slate-100 line-clamp-1">{{ item.name || `Sản phẩm #${item.product_id}` }}</p>
                  <div class="flex items-center gap-3 mt-1 text-xs text-slate-400">
                    <span v-if="item.product_id">Mã SP: <strong class="text-slate-300">#{{ item.product_id }}</strong></span>
                    <span>Số lượng: <strong class="text-pink-400">x{{ item.quantity || 1 }}</strong></span>
                  </div>
                </div>
              </div>

              <!-- Đơn giá sản phẩm -->
              <div class="text-right flex-shrink-0">
                <p class="text-xs text-slate-400">Đơn giá</p>
                <p class="text-sm font-bold text-slate-200">{{ formatCurrency(item.price) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Khối 4: Bảng tính tổng tiền (Đã sửa lỗi hiển thị 0đ) -->
        <div class="pt-3 border-t border-slate-700/60 space-y-2">
          <div class="flex justify-between text-xs text-slate-400">
            <span>Tiền hàng:</span>
            <span class="text-slate-200 font-semibold">{{ formatCurrency(calculateTotal(order)) }}</span>
          </div>
          <div class="flex justify-between text-xs text-slate-400">
            <span>Phí vận chuyển:</span>
            <span class="text-emerald-400 font-semibold">Miễn phí</span>
          </div>
          <div class="flex justify-between items-center pt-2 border-t border-slate-700/40">
            <span class="text-sm font-bold text-slate-300">Tổng thanh toán:</span>
            <span class="text-2xl font-black text-rose-400">
              {{ formatCurrency(calculateTotal(order)) }}
            </span>
          </div>
        </div>

      </div>

      <!-- Modal Footer -->
      <div class="flex justify-end pt-4 border-t border-slate-700/60">
        <button 
          @click="close"
          class="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-sm border border-slate-700 transition"
        >
          Đóng
        </button>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderDetailModal',
  props: {
    isOpen: { type: Boolean, default: false },
    order: { type: Object, default: null }
  },
  methods: {
    close() {
      this.$emit('close');
    },

    // Hàm format định dạng tiền VNĐ an toàn
    formatCurrency(val) {
      const num = Number(val);
      if (isNaN(num) || num === 0) return '0₫';
      return num.toLocaleString('vi-VN') + '₫';
    },

    // Hàm tự động tính tổng tiền thông minh (khắc phục lỗi 0đ)
    calculateTotal(orderObj) {
      if (!orderObj) return 0;

      // 1. Kiểm tra trực tiếp các tên trường phổ biến từ API Backend
      const rawTotal = orderObj.total_price ?? orderObj.total ?? orderObj.total_amount;
      if (rawTotal !== undefined && rawTotal !== null && Number(rawTotal) > 0) {
        return Number(rawTotal);
      }

      // 2. Nếu trường tổng tiền từ API bị null/0, tự động cộng tổng giá từng sản phẩm trong order_items
      if (Array.isArray(orderObj.items) && orderObj.items.length > 0) {
        return orderObj.items.reduce((sum, item) => {
          const itemPrice = Number(item.price || 0);
          const itemQty = Number(item.quantity || 1);
          return sum + (itemPrice * itemQty);
        }, 0);
      }

      return 0;
    },

    // Format Ngày giờ
    formatDate(dateStr) {
      if (!dateStr) return 'Mới đây';
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    // Mapping phương thức thanh toán
    formatPaymentMethod(method) {
      if (!method) return 'N/A';
      const map = {
        'cod': 'Tiền mặt (COD)',
        'credit_cash': 'Ngân hàng',
        'banking': 'Ngân hàng',
        'momo': 'Ví MoMo',
        'vnpay': 'VNPay'
      };
      return map[method.toLowerCase()] || method;
    },

    // Format trạng thái thanh toán (payment_status)
    formatPaymentStatus(status) {
      if (status === 'paid') return 'Đã thanh toán';
      return 'Chưa thanh toán';
    },

    // Màu sắc cho Trạng thái thanh toán
    getPaymentStatusBadge(status) {
      if (status === 'paid') {
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      }
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    },

    // Format trạng thái đơn hàng (status)
    formatStatusText(status) {
      const map = {
        'pending': 'Đang xử lý',
        'confirmed': 'Xác nhận đơn',
        'shipping': 'Đang giao hàng',
        'completed': 'Hoàn thành',
        'cancelled': 'Đã hủy đơn'
      };
      return map[status] || status;
    },

    // Màu sắc cho Trạng thái đơn hàng
    getStatusBadgeClass(status) {
      switch (status) {
        case 'completed':
          return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
        case 'shipping':
          return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
        case 'confirmed':
          return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
        case 'pending':
          return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
        case 'cancelled':
          return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
        default:
          return 'bg-slate-800 text-slate-300 border-slate-700';
      }
    }
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.2s ease-out forwards;
}
</style>