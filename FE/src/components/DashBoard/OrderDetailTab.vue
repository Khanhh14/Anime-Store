<template>
  <div class="animate-fadeIn p-2">
    <!-- Tiêu đề chính -->
    <div class="flex items-center gap-3 border-b border-slate-200 pb-4 mb-6">
      <span class="inline-block w-1.5 h-6 bg-pink-500 rounded-full"></span>
      <h2 class="text-xl font-bold text-slate-800 tracking-wide">Chi Tiết Đơn Hàng</h2>
    </div>

    <div v-if="selectedOrder" class="space-y-6">
      <!-- Grid Thông Tin Tổng Quan (Bọc khung viền nét căng, đổ bóng nhẹ) -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <p class="text-slate-400 text-xs font-bold mb-1 tracking-wider">MÃ ĐƠN HÀNG</p>
          <p class="text-slate-800 font-extrabold text-lg">#{{ selectedOrder.id }}</p>
        </div>
        
        <div class="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <p class="text-slate-400 text-xs font-bold mb-1 tracking-wider">NGÀY ĐẶT</p>
          <p class="text-slate-800 font-bold text-base">{{ formatDate(selectedOrder.date) }}</p>
        </div>
        
        <div class="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col justify-center">
          <p class="text-slate-400 text-xs font-bold mb-1.5 tracking-wider">TRẠNG THÁI</p>
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
          <p class="text-pink-500 text-xs font-bold mb-1 tracking-wider">TỔNG TIỀN</p>
          <p class="text-pink-500 font-black text-xl">{{ (selectedOrder.total || 0).toLocaleString() }}<span class="text-sm ml-0.5">₫</span></p>
        </div>
      </div>

      <!-- Danh Sách Sản Phẩm Đặt Hàng -->
      <div class="bg-white rounded-xl p-5 md:p-6 border border-slate-200 shadow-sm">
        <h3 class="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
           Sản Phẩm Đặt Hàng
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
                <img v-if="item.image" :src="`http://localhost:3000/uploads/${item.image}`" :alt="item.name" class="w-full h-full object-cover" />
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
           Địa Chỉ Giao Hàng
        </h3>
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <p class="text-slate-700 text-sm font-semibold leading-relaxed">
            {{ selectedOrder.shipping_address || 'Chưa cập nhật địa chỉ nhận hàng.' }}
          </p>
        </div>
      </div>

      <!-- Khu Vực Nút Điều Hướng -->
      <div class="flex gap-3 pt-2">
        <button 
          @click="$emit('back-to-history')" 
          class="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 font-bold rounded-xl border border-slate-300 shadow-sm transition text-sm flex items-center gap-1"
        >
          ← Quay Lại
        </button>
        
        <button 
          v-if="selectedOrder.status === 'pending'" 
          @click="handleCancelOrder" 
          :disabled="isCancelling"
          class="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white font-bold rounded-xl shadow-sm transition disabled:opacity-50 flex items-center gap-1.5 text-sm transform active:scale-[0.98]"
        >
          <span v-if="isCancelling" class="inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
          <span> Hủy Đơn Hàng</span>
        </button>
      </div>
    </div>
    
    <!-- Trường hợp chưa chọn đơn hàng -->
    <div v-else class="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-md mx-auto">
      <div class="text-5xl mb-4">📋</div>
      <p class="text-lg text-slate-700 mb-5 font-bold">Vui lòng chọn một đơn hàng</p>
      <button 
        @click="$emit('go-to-history')" 
        class="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-xl shadow-sm text-sm tracking-wide transition duration-300"
      >
        Xem Lịch Sử Mua Hàng
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'OrderDetailTab',
  props: {
    selectedOrder: { type: Object, default: null },
    formatDate: { type: Function, required: true },
    getProductIcon: { type: Function, required: true }
  },
  data() {
    return {
      isCancelling: false
    };
  },
  methods: {
    translateStatus(status) {
      const statusMap = {
        'pending': 'Đang xử lý ',
        'confirmed': 'Đã xác nhận ',
        'shipping': 'Đang giao hàng ',
        'completed': 'Đã hoàn thành ',
        'cancelled': 'Đã hủy đơn '
      };
      return statusMap[status] || status;
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
          alert("❌ Bạn đã hủy đơn hàng thành công!");
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