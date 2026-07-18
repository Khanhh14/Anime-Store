<template>
  <div class="animate-fadeIn">
    <h2 class="text-3xl font-bold text-white mb-8">Chi Tiết Đơn Hàng</h2>
    <div v-if="selectedOrder" class="space-y-6">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-gradient-to-br from-slate-700 to-slate-600 rounded-lg p-6 border border-slate-600">
          <p class="text-slate-400 text-sm font-semibold mb-2">MÃ ĐƠN HÀNG</p>
          <p class="text-white font-bold text-xl">#{{ selectedOrder.id }}</p>
        </div>
        <div class="bg-gradient-to-br from-slate-700 to-slate-600 rounded-lg p-6 border border-slate-600">
          <p class="text-slate-400 text-sm font-semibold mb-2">NGÀY ĐẶT</p>
          <p class="text-white font-bold text-xl">{{ formatDate(selectedOrder.date) }}</p>
        </div>
        <div class="bg-gradient-to-br from-slate-700 to-slate-600 rounded-lg p-6 border border-slate-600">
          <p class="text-slate-400 text-sm font-semibold mb-2">TRẠNG THÁI</p>
          <span :class="[
            'px-3 py-1 rounded-full text-sm font-bold inline-block',
            selectedOrder.status === 'completed' ? 'bg-green-500/20 text-green-400' :
            selectedOrder.status === 'shipping' ? 'bg-blue-500/20 text-blue-400' :
            selectedOrder.status === 'confirmed' ? 'bg-indigo-500/20 text-indigo-400' :
            selectedOrder.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          ]">
            {{ translateStatus(selectedOrder.status) }}
          </span>
        </div>
        <div class="bg-gradient-to-br from-blue-700/20 to-blue-600/20 rounded-lg p-6 border border-blue-500/30">
          <p class="text-blue-400 text-sm font-semibold mb-2">TỔNG TIỀN</p>
          <p class="text-blue-400 font-bold text-2xl">{{ (selectedOrder.total || 0).toLocaleString() }}₫</p>
        </div>
      </div>

      <div class="bg-gradient-to-br from-slate-700 to-slate-600 rounded-xl p-8 border border-slate-600">
        <h3 class="text-2xl font-bold text-white mb-6">Sản Phẩm Đặt Hàng</h3>
        <div class="space-y-4">
          <div 
            v-for="item in selectedOrder.items" 
            :key="item.id"
            class="flex items-center justify-between bg-slate-800 p-4 rounded-lg hover:bg-slate-700/70 transition"
          >
            <div class="flex items-center gap-4 flex-1">
              <div class="w-14 h-14 bg-slate-700 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                <img v-if="item.image" :src="`http://localhost:3000/uploads/${item.image}`" :alt="item.name" class="w-full h-full object-cover rounded" />
                <span v-else>{{ getProductIcon(item.category_name) }}</span>
              </div>
              <div class="min-w-0">
                <p class="text-white font-semibold truncate">{{ item.name }}</p>
                <p class="text-slate-400 text-sm">Số lượng: <span class="text-white font-semibold">x{{ item.quantity }}</span></p>
              </div>
            </div>
            <div class="text-right flex-shrink-0">
              <p class="text-slate-300 text-sm">{{ (item.price || 0).toLocaleString() }}₫</p>
              <p class="text-blue-400 font-bold">{{ ((item.price || 0) * (item.quantity || 1)).toLocaleString() }}₫</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-slate-700 to-slate-600 rounded-xl p-8 border border-slate-600">
        <h3 class="text-2xl font-bold text-white mb-6">📍 Địa Chỉ Giao Hàng</h3>
        <div class="bg-slate-800 p-6 rounded-lg">
          <p class="text-white text-lg">{{ selectedOrder.shipping_address || 'Chưa cập nhật' }}</p>
        </div>
      </div>

      <div class="flex gap-4">
        <button @click="$emit('back-to-history')" class="px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white font-bold rounded-lg transition">
          ← Quay Lại
        </button>
        
        <button 
          v-if="selectedOrder.status === 'pending'" 
          @click="handleCancelOrder" 
          :disabled="isCancelling"
          class="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition disabled:bg-red-800 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <span v-if="isCancelling" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          <span>❌ Hủy Đơn Hàng</span>
        </button>
      </div>
    </div>
    
    <div v-else class="text-center py-20">
      <div class="text-6xl mb-4">📋</div>
      <p class="text-2xl text-slate-400 mb-4 font-bold">Vui lòng chọn một đơn hàng</p>
      <button @click="$emit('go-to-history')" class="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition">
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
      isCancelling: false // Trạng thái khóa nút tránh người dùng bấm liên tục khi đang xử lý API
    };
  },
  methods: {
    translateStatus(status) {
      const statusMap = {
        'pending': 'Đang xử lý ⏳',
        'confirmed': 'Đã xác nhận 🤝',
        'shipping': 'Đang giao hàng 🚚',
        'completed': 'Đã hoàn thành 🎉',
        'cancelled': 'Đã hủy đơn ❌'
      };
      return statusMap[status] || status;
    },
    
    // Đã cập nhật: Xử lý đồng bộ API hủy đơn hàng trực tiếp lên backend
    async handleCancelOrder() {
      if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác.")) {
        return;
      }

      this.isCancelling = true;
      try {
        const token = localStorage.getItem('token'); // Lấy Token JWT của User đăng nhập
        
        // Gọi API của backend để cập nhật lại trạng thái thành 'cancelled'
        const response = await axios.put(
          `http://localhost:3000/api/orders/${this.selectedOrder.id}`,
          { status: 'cancelled' },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data && response.data.success) {
          alert("❌ Bạn đã hủy đơn hàng thành công!");
          
          // Cập nhật giao diện trực tiếp thay đổi trạng thái của object props
          this.selectedOrder.status = 'cancelled';
          
          // Phát tín hiệu thông báo cho component cha cập nhật lại danh sách tổng quan
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
.animate-spin {
  animation: spin 0.6s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>