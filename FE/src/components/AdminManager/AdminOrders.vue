<template>
  <div class="p-0 text-slate-100 font-sans">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white tracking-wide">Đơn Hàng & Vận Chuyển</h1>
        <p class="text-slate-400 text-sm mt-1">Quản lý, hiển thị hình ảnh và cập nhật kho tự động khi xác nhận</p>
      </div>
      <button 
        @click="fetchAdminOrders" 
        class="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-sm font-semibold transition flex items-center gap-2 shadow-lg"
      >
        <span></span> Làm mới dữ liệu
      </button>
    </div>

    <div class="bg-gradient-to-b from-[#1e293b] to-[#1e293b]/90 rounded-2xl border border-slate-700/60 shadow-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-sm">
          <thead>
            <tr class="border-b border-slate-700 bg-slate-950/40 text-slate-400 font-semibold">
              <th class="p-4 md:p-5 w-24">Mã đơn</th>
              <th class="p-4 md:p-5 w-28">User ID</th>
              <th class="p-4 md:p-5 min-w-[200px]">Sản phẩm</th>
              <th class="p-4 md:p-5">Địa chỉ giao hàng</th>
              <th class="p-4 md:p-5 w-40">Tổng hóa đơn</th>
              <th class="p-4 md:p-5 w-48 text-center">Trạng thái</th>
            </tr>
          </thead>
          
          <tbody class="divide-y divide-slate-700/40 text-slate-300">
            <tr v-if="loading">
              <td colspan="6" class="text-center py-12 text-slate-400">
                <div class="inline-block w-6 h-6 border-2 border-slate-400 border-t-pink-500 rounded-full animate-spin mb-2"></div>
                <p class="text-xs">Đang đồng bộ dữ liệu từ hệ thống...</p>
              </td>
            </tr>

            <tr v-else-if="orders.length === 0">
              <td colspan="6" class="text-center py-16 text-slate-400">
                <div class="text-4xl mb-3">📦</div>
                <p class="text-base font-bold">Chưa có đơn hàng nào tồn tại</p>
              </td>
            </tr>

            <tr 
              v-else 
              v-for="order in orders" 
              :key="order.id" 
              class="hover:bg-slate-700/20 transition duration-150"
            >
              <td class="p-4 md:p-5 font-mono font-bold text-pink-400">#{{ order.id }}</td>
              
              <td class="p-4 md:p-5 font-medium text-white">#{{ order.user_id }}</td>
              
              <td class="p-4 md:p-5">
                <div class="flex items-center gap-3">
                  <div class="flex -space-x-3 overflow-hidden flex-shrink-0">
                    <div 
                      v-for="(item, idx) in order.items?.slice(0, 3)" 
                      :key="idx" 
                      class="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden shadow"
                    >
                      <img 
                        v-if="item.image" 
                        :src="`http://localhost:3000/uploads/${item.image}`" 
                        class="w-full h-full object-cover"
                        @error="(e) => e.target.src='https://placehold.co/100x100?text=Anime'"
                      />
                      <div v-else class="w-full h-full flex items-center justify-center text-xs bg-slate-700">🧸</div>
                    </div>
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-xs font-semibold text-white truncate max-w-[160px]">
                      {{ order.items?.[0]?.name || 'Sản phẩm' }}
                    </p>
                    <p v-if="order.items?.length > 1" class="text-[10px] text-slate-400">
                      và {{ order.items.length - 1 }} mặt hàng khác
                    </p>
                  </div>
                </div>
              </td>
              
              <td class="p-4 md:p-5">
                <p class="truncate max-w-xs text-slate-300" :title="order.shipping_address">
                  {{ order.shipping_address || 'Chưa cung cấp địa chỉ' }}
                </p>
              </td>

              <td class="p-4 md:p-5 font-bold text-rose-400 text-base whitespace-nowrap">
                {{ Number(order.total || order.total_price || 0).toLocaleString() }}₫
              </td>

              <td class="p-4 md:p-5 text-center">
                <div class="flex items-center justify-center">
                  <div class="relative w-full max-w-[160px]">
                    <select 
                      v-model="order.status" 
                      @change="updateStatus(order.id, order.status)"
                      :class="[
                        'w-full appearance-none px-4 py-1.5 rounded-xl text-xs font-bold border cursor-pointer focus:outline-none transition-all duration-200 text-center shadow-sm',
                        order.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' :
                        order.status === 'shipping' ? 'bg-sky-500/10 border-sky-500/30 text-sky-400 hover:bg-sky-500/20' :
                        order.status === 'confirmed' ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20' :
                        order.status === 'pending' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20' :
                        'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                      ]"
                    >
                      <option value="pending" class="bg-slate-900 text-amber-400 font-semibold">Đang xử lý </option>
                      <option value="confirmed" class="bg-slate-900 text-indigo-400 font-semibold">Xác nhận đơn </option>
                      <option value="shipping" class="bg-slate-900 text-sky-400 font-semibold">Đang giao hàng </option>
                      <option value="completed" class="bg-slate-900 text-emerald-400 font-semibold">Hoàn thành </option>
                      <option value="cancelled" class="bg-slate-900 text-rose-400 font-semibold">Đã hủy đơn </option>
                    </select>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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
      isInternalFetching: false // Cờ chặn đồng bộ ngược từ Cha khi Con đang chủ động gọi API
    };
  },
  watch: {
    initialOrders: {
      immediate: true,
      handler(newVal) {
        // Chỉ cập nhật từ Cha xuống nếu Con KHÔNG trong quá trình tự bấm nút làm mới dữ liệu
        if (!this.isInternalFetching && Array.isArray(newVal)) {
          this.orders = [...newVal];
        }
      }
    }
  },
  methods: {
    async fetchAdminOrders() {
      this.loading = true;
      this.isInternalFetching = true; // Bật cờ chặn
      
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/orders/admin', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data && response.data.success) {
          // Gán trực tiếp mảng mới (hoặc rỗng []) vào local state để giao diện mất đơn hàng ngay lập tức
          this.orders = response.data.data || [];
          
          // Thông báo cho cha cập nhật lại (nếu cần), lúc này giao diện con đã sạch sẽ
          this.$emit('refresh-data', this.orders);
        }
      } catch (error) {
        console.error('Lỗi khi tải danh sách đơn hàng quản trị:', error);
        alert('Không thể kết nối danh sách đơn hàng tổng quan!');
      } finally {
        this.loading = false;
        // Chờ một chút cho các tiến trình xử lý xong rồi mới nhả cờ chặn ra
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
          if (newStatus === 'confirmed') {
            alert('🎉 Đã xác nhận đơn hàng và tự động trừ số lượng tồn kho sản phẩm thành công!');
          } else if (newStatus === 'cancelled') {
            alert('❌ Đã chuyển trạng thái đơn hàng thành Hủy thành công!');
          }
          this.fetchAdminOrders(); // Tự gọi hàm nội bộ để cập nhật giao diện
        } else {
          alert('Không thể thực thi đổi trạng thái: ' + response.data.message);
          this.fetchAdminOrders();
        }
      } catch (error) {
        console.error('Lỗi cập nhật trạng thái đơn hàng:', error);
        alert(error.response?.data?.message || 'Gặp lỗi hệ thống khi cập nhật trạng thái đơn hàng!');
        this.fetchAdminOrders();
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
select option {
  padding: 10px;
  background-color: #0f172a !important;
}
</style>