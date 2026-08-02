<template>
  <div class="p-0 text-slate-100 font-sans">
    <!-- Header trang quản lý -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white tracking-wide">Đơn Hàng & Vận Chuyển</h1>
        <p class="text-slate-400 text-sm mt-1">Quản lý, hiển thị hình ảnh và cập nhật kho tự động khi xác nhận</p>
      </div>
      <button 
        @click="fetchAdminOrders" 
        class="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-sm font-semibold transition flex items-center gap-2 shadow-lg"
      >
        <span>🔄</span> Làm mới dữ liệu
      </button>
    </div>

    <!-- BẢNG DANH SÁCH ĐƠN HÀNG -->
    <div class="bg-gradient-to-b from-[#1e293b] to-[#1e293b]/90 rounded-2xl border border-slate-700/60 shadow-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-sm">
          <thead>
            <tr class="border-b border-slate-700 bg-slate-950/40 text-slate-400 font-semibold">
              <th class="p-4 md:p-5 w-24">Mã đơn</th>
              <th class="p-4 md:p-5 w-28">User ID</th>
              <th class="p-4 md:p-5 min-w-[200px]">Sản phẩm</th>
              <th class="p-4 md:p-5">Địa chỉ giao hàng</th>
              <th class="p-4 md:p-5 w-36">Phương thức TT</th>
              <th class="p-4 md:p-5 w-40">Tổng hóa đơn</th>
              <th class="p-4 md:p-5 w-48 text-center">Trạng thái đơn</th>
            </tr>
          </thead>
          
          <tbody class="divide-y divide-slate-700/40 text-slate-300">
            <tr v-if="loading">
              <td colspan="7" class="text-center py-12 text-slate-400">
                <div class="inline-block w-6 h-6 border-2 border-slate-400 border-t-pink-500 rounded-full animate-spin mb-2"></div>
                <p class="text-xs">Đang đồng bộ dữ liệu từ hệ thống...</p>
              </td>
            </tr>

            <tr v-else-if="orders.length === 0">
              <td colspan="7" class="text-center py-16 text-slate-400">
                <div class="text-4xl mb-3">📦</div>
                <p class="text-base font-bold">Chưa có đơn hàng nào tồn tại</p>
              </td>
            </tr>

            <!-- Dòng đơn hàng: Nhấp vào sẽ bật Modal -->
            <tr 
              v-else 
              v-for="order in orders" 
              :key="order.id" 
              @click="openModal(order)"
              class="hover:bg-slate-700/30 transition duration-150 cursor-pointer group"
            >
              <td class="p-4 md:p-5 font-mono font-bold text-pink-400 group-hover:underline">#{{ order.id }}</td>
              <td class="p-4 md:p-5 font-medium text-white">#{{ order.user_id }}</td>
              
              <!-- Hiển thị sản phẩm gọn trên dòng -->
              <td class="p-4 md:p-5">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden flex-shrink-0">
                    <img 
                      v-if="order.items?.[0]?.image" 
                      :src="`http://localhost:3000/uploads/${order.items[0].image}`" 
                      class="w-full h-full object-cover"
                      @error="(e) => e.target.src='https://placehold.co/100x100?text=Anime'"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center text-xs bg-slate-700">🧸</div>
                  </div>
                  <span class="text-xs font-semibold text-white truncate max-w-[160px]">
                    {{ order.items?.[0]?.name || 'Sản phẩm Anime' }}
                  </span>
                </div>
              </td>
              
              <td class="p-4 md:p-5">
                <p class="truncate max-w-xs text-slate-300" :title="order.shipping_address">
                  {{ order.shipping_address || 'Chưa cung cấp địa chỉ' }}
                </p>
              </td>

              <td class="p-4 md:p-5 whitespace-nowrap">
                <span 
                  :class="[
                    'px-2.5 py-1 rounded-lg text-xs font-bold tracking-wider inline-flex items-center gap-1.5 border shadow-sm',
                    getPaymentBadgeStyle(order.payment_method)
                  ]"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                  {{ formatPaymentMethod(order.payment_method) }}
                </span>
              </td>

              <!-- Hiển thị Tổng Tiền tại Bảng Quản Lý -->
              <td class="p-4 md:p-5 font-bold text-rose-400 text-base whitespace-nowrap">
                {{ formatCurrency(calculateOrderTotal(order)) }}
              </td>

              <td class="p-4 md:p-5 text-center" @click.stop>
                <div class="flex items-center justify-center">
                  <div class="relative w-full max-w-[160px]">
                    <select 
                      v-model="order.status" 
                      @change="updateStatus(order.id, order.status)"
                      :class="[
                        'w-full appearance-none px-4 py-1.5 rounded-xl text-xs font-bold border cursor-pointer focus:outline-none transition-all duration-200 text-center shadow-sm',
                        order.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                        order.status === 'shipping' ? 'bg-sky-500/10 border-sky-500/30 text-sky-400' :
                        order.status === 'confirmed' ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' :
                        order.status === 'pending' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                        'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      ]"
                    >
                      <option value="pending" class="bg-slate-900 text-amber-400 font-semibold">Đang xử lý</option>
                      <option value="confirmed" class="bg-slate-900 text-indigo-400 font-semibold">Xác nhận đơn</option>
                      <option value="shipping" class="bg-slate-900 text-sky-400 font-semibold">Đang giao hàng</option>
                      <option value="completed" class="bg-slate-900 text-emerald-400 font-semibold">Hoàn thành</option>
                      <option value="cancelled" class="bg-slate-900 text-rose-400 font-semibold">Đã hủy đơn</option>
                    </select>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ================= MODAL HIỂN THỊ CHI TIẾT ================= -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div class="bg-[#111827] text-slate-100 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-700/80 animate-fadeIn flex flex-col max-h-[90vh]">
        
        <!-- Header Modal -->
        <div class="flex justify-between items-center pb-4 border-b border-slate-800">
          <div class="flex items-center gap-3">
            <h3 class="text-xl font-bold text-white">Chi Tiết Đơn Hàng #{{ selectedOrder?.id }}</h3>
            <span :class="getStatusBadgeClass(selectedOrder?.status)" class="px-3 py-1 text-xs font-bold rounded-full border">
              {{ formatStatusText(selectedOrder?.status) }}
            </span>
          </div>
          <button @click="closeModal" class="text-slate-400 hover:text-white text-2xl font-bold transition-colors leading-none">&times;</button>
        </div>

        <!-- Body Modal -->
        <div v-if="selectedOrder" class="space-y-5 py-4 overflow-y-auto pr-1">
          
          <!-- Thông tin tổng quan (Grid 4 cột) -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs">
            <div>
              <p class="text-slate-400 uppercase font-semibold">User ID</p>
              <p class="font-bold text-slate-200 mt-1 text-sm">#{{ selectedOrder.user_id }}</p>
            </div>

            <div>
              <p class="text-slate-400 uppercase font-semibold">Phương thức TT</p>
              <p class="font-bold text-pink-400 mt-1 text-sm">{{ formatPaymentMethod(selectedOrder.payment_method) }}</p>
            </div>

            <div>
              <p class="text-slate-400 uppercase font-semibold">Trạng thái TT</p>
              <span :class="getPaymentStatusBadge(selectedOrder.payment_status)" class="inline-block px-2 py-0.5 text-[10px] font-bold rounded border mt-1">
                {{ selectedOrder.payment_status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán' }}
              </span>
            </div>

            <div>
              <p class="text-slate-400 uppercase font-semibold">Ngày đặt hàng</p>
              <p class="font-bold text-slate-300 mt-1">{{ formatDate(selectedOrder.created_at) }}</p>
            </div>
          </div>

          <!-- Thông tin giao hàng -->
          <div class="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <h4 class="text-xs uppercase font-bold text-slate-400 mb-1 tracking-wider">Địa chỉ giao hàng</h4>
            <p class="text-sm text-slate-200 font-medium">
              {{ selectedOrder.shipping_address || 'Chưa cung cấp địa chỉ' }}
            </p>
          </div>

          <!-- Danh sách mặt hàng từ order_items -->
          <div>
            <div class="flex justify-between items-center mb-3">
              <h4 class="text-xs uppercase font-bold text-slate-400 tracking-wider">Mặt hàng mua</h4>
              <span class="text-xs text-slate-400">Tổng {{ selectedOrder.items?.length || 0 }} món</span>
            </div>

            <div class="space-y-3">
              <div 
                v-for="(item, idx) in (selectedOrder.items || [])" 
                :key="item.id || idx" 
                class="flex items-center justify-between gap-4 bg-slate-900/90 p-3.5 rounded-xl border border-slate-800"
              >
                <div class="flex items-center gap-3">
                  <div class="w-14 h-14 bg-slate-950 rounded-lg overflow-hidden border border-slate-800 flex-shrink-0">
                    <img 
                      :src="item.image ? `http://localhost:3000/uploads/${item.image}` : 'https://placehold.co/100x100?text=Anime'" 
                      class="w-full h-full object-cover" 
                      alt="Product"
                    />
                  </div>
                  <div>
                    <p class="text-sm font-bold text-slate-100 line-clamp-1">{{ item.name || `Sản phẩm #${item.product_id}` }}</p>
                    <div class="flex items-center gap-3 mt-1 text-xs text-slate-400">
                      <span v-if="item.product_id">Mã SP: <strong class="text-slate-300">#{{ item.product_id }}</strong></span>
                      <span>Số lượng: <strong class="text-pink-400">x{{ item.quantity || 1 }}</strong></span>
                    </div>
                  </div>
                </div>

                <div class="text-right flex-shrink-0">
                  <p class="text-xs text-slate-400">Đơn giá</p>
                  <p class="text-sm font-bold text-rose-400">{{ formatCurrency(item.price) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Tổng tiền chi tiết trong Modal -->
          <div class="pt-3 border-t border-slate-800 space-y-1.5">
            <!-- 1. Tiền hàng -->
            <div class="flex justify-between text-xs text-slate-400">
              <span>Tiền hàng:</span>
              <span class="text-slate-200 font-semibold">
                {{ formatCurrency(calculateSubtotal(selectedOrder)) }}
              </span>
            </div>

            <!-- 2. Phí vận chuyển động -->
            <div class="flex justify-between text-xs text-slate-400">
              <span>Phí vận chuyển:</span>
              <span :class="calculateShippingFee(selectedOrder) === 0 ? 'text-emerald-400 font-semibold' : 'text-slate-200 font-semibold'">
                {{ calculateShippingFee(selectedOrder) === 0 ? 'Miễn phí' : formatCurrency(calculateShippingFee(selectedOrder)) }}
              </span>
            </div>

            <!-- 3. Tổng thanh toán -->
            <div class="flex justify-between items-center pt-2 border-t border-slate-800/80">
              <span class="text-sm font-bold text-slate-200">Tổng thanh toán:</span>
              <span class="text-2xl font-black text-rose-400">
                {{ formatCurrency(calculateOrderTotal(selectedOrder)) }}
              </span>
            </div>
          </div>

        </div>

        <!-- Footer Modal -->
        <div class="flex justify-end pt-4 border-t border-slate-800">
          <button 
            @click="closeModal"
            class="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-sm border border-slate-700 transition"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AdminOrders',
  props: {
    initialOrders: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      orders: [],
      loading: false,
      isInternalFetching: false,
      
      // Modal State
      isModalOpen: false,
      selectedOrder: null
    };
  },
  watch: {
    initialOrders: {
      immediate: true,
      handler(newVal) {
        if (!this.isInternalFetching && Array.isArray(newVal)) {
          this.orders = [...newVal];
        }
      }
    }
  },
  methods: {
    openModal(order) {
      this.selectedOrder = order;
      this.isModalOpen = true;
    },

    closeModal() {
      this.isModalOpen = false;
      this.selectedOrder = null;
    },

    // 1. Format định dạng tiền tệ VNĐ
    formatCurrency(val) {
      const num = Number(val);
      if (isNaN(num)) return '0₫';
      return num.toLocaleString('vi-VN') + '₫';
    },

    // 2. Tính TỔNG TIỀN HÀNG (Giá x Số lượng của tất cả mặt hàng)
    calculateSubtotal(order) {
      if (!order || !Array.isArray(order.items) || order.items.length === 0) return 0;
      return order.items.reduce((sum, item) => {
        const price = Number(item.price || 0);
        const qty = Number(item.quantity || 1);
        return sum + (price * qty);
      }, 0);
    },

    // 3. Tính PHÍ VẬN CHUYỂN
    calculateShippingFee(order) {
      if (!order) return 0;

      // Ưu tiên đọc trường phí vận chuyển trực tiếp từ API nếu có
      const directFee = order.shipping_fee ?? order.shipping_cost ?? order.shippingFee;
      if (directFee !== undefined && directFee !== null) {
        return Number(directFee);
      }

      // Tự động suy ra: [Tổng hóa đơn] - [Tổng tiền hàng]
      const total = this.calculateOrderTotal(order);
      const subtotal = this.calculateSubtotal(order);
      const diff = total - subtotal;

      return diff > 0 ? diff : 0;
    },

    // 4. Tính TỔNG THANH TOÁN cuối cùng
    calculateOrderTotal(order) {
      if (!order) return 0;

      const directTotal = order.total_price ?? order.total ?? order.total_amount;
      if (directTotal !== undefined && directTotal !== null && Number(directTotal) > 0) {
        return Number(directTotal);
      }

      return this.calculateSubtotal(order);
    },

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

    formatPaymentMethod(method) {
      if (!method) return 'Tiền mặt';
      const key = method.toLowerCase().trim();
      
      const map = {
        'credit_cash': 'Ngân hàng',
        'cod': 'Tiền mặt',
        'momo': 'MoMo',
        'vnpay': 'VNPay',
        'banking': 'Ngân hàng'
      };

      return map[key] || method;
    },

    getPaymentBadgeStyle(method) {
      if (!method) return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      const key = method.toLowerCase().trim();

      switch (key) {
        case 'momo':
          return 'bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-400';
        case 'vnpay':
          return 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400';
        case 'credit_cash':
        case 'banking':
          return 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400';
        case 'cod':
          return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
        default:
          return 'bg-slate-800 border-slate-700 text-slate-300';
      }
    },

    getPaymentStatusBadge(status) {
      if (status === 'paid') {
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      }
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    },

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
    },

    async fetchAdminOrders() {
      this.loading = true;
      this.isInternalFetching = true;
      
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/orders/admin', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data && response.data.success) {
          this.orders = response.data.data || [];
          this.$emit('refresh-data', this.orders);
        }
      } catch (error) {
        console.error('Lỗi khi tải danh sách đơn hàng quản trị:', error);
      } finally {
        this.loading = false;
        setTimeout(() => {
          this.isInternalFetching = false;
        }, 300);
      }
    },

    async updateStatus(orderId, newStatus) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`http://localhost:3000/api/orders/${orderId}`, 
          { status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data && response.data.success) {
          this.fetchAdminOrders();
        }
      } catch (error) {
        console.error('Lỗi cập nhật trạng thái đơn hàng:', error);
      }
    }
  },
  mounted() {
    if (!this.initialOrders || this.initialOrders.length === 0) {
      this.fetchAdminOrders();
    }
  }
};
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
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
  animation: fadeIn 0.25s ease-out forwards;
}
select option {
  padding: 10px;
  background-color: #0f172a !important;
}
</style>