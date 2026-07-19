<template>
  <div class="animate-fadeIn p-2">
    <!-- Tiêu đề chính -->
    <div class="flex items-center gap-3 border-b border-slate-200 pb-4 mb-6">
      <span class="inline-block w-1.5 h-6 bg-pink-500 rounded-full"></span>
      <h2 class="text-xl font-bold text-slate-800 tracking-wide">Lịch Sử Mua Hàng</h2>
    </div>

    <!-- Trường hợp có đơn hàng -->
    <div v-if="purchaseHistory.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div 
        v-for="order in purchaseHistory" 
        :key="order.id"
        class="group bg-white rounded-2xl p-5 border border-slate-200 hover:border-pink-300 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between"
        @click="$emit('select-order', order)"
      >
        <div>
          <!-- Header Đơn hàng: Mã & Trạng thái -->
          <div class="flex justify-between items-start mb-4">
            <div>
              <p class="text-slate-400 text-xs font-bold tracking-wider">ĐƠN HÀNG</p>
              <p class="text-slate-800 font-extrabold text-base mt-0.5">#{{ order.id }}</p>
              <p class="text-slate-500 text-xs mt-1 font-semibold">{{ formatDate(order.date) }}</p>
            </div>
            
            <span :class="[
              'px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap border',
              order.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
              order.status === 'shipping' ? 'bg-blue-50 text-blue-600 border-blue-200' :
              order.status === 'confirmed' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' :
              order.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-200' :
              'bg-rose-50 text-rose-600 border-rose-200'
            ]">
              {{ translateStatus(order.status) }}
            </span>
          </div>

          <!-- Chi tiết đơn hàng -->
          <div class="border-t border-slate-100 pt-4 space-y-3">
            <div class="flex justify-between items-center text-sm">
              <span class="text-slate-500 font-medium">Sản phẩm:</span>
              <span class="text-slate-800 font-bold">{{ order.items?.length || 0 }} mặt hàng</span>
            </div>

            <div class="flex flex-col gap-1">
              <span class="text-slate-500 text-sm font-medium">Địa chỉ giao hàng:</span>
              <span class="text-slate-700 text-xs line-clamp-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 font-semibold leading-relaxed">
                {{ order.shipping_address || 'Chưa cập nhật địa chỉ' }}
              </span>
            </div>

            <div class="flex justify-between items-center pt-2 border-b border-slate-100 pb-3">
              <span class="text-slate-600 font-bold text-sm">Tổng tiền:</span>
              <span class="text-pink-500 font-extrabold text-base">{{ (order.total || 0).toLocaleString() }}₫</span>
            </div>
          </div>
        </div>
        
        <!-- Nút hành động nổi bật khi Hover -->
        <button class="w-full mt-4 py-2.5 bg-slate-50 group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-rose-500 text-slate-600 group-hover:text-white font-bold rounded-xl transition-all duration-300 border border-slate-200 group-hover:border-transparent text-xs tracking-wide shadow-sm">
          XEM CHI TIẾT ĐƠN HÀNG →
        </button>
      </div>
    </div>

    <!-- Trường hợp trống -->
    <div v-else class="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-md mx-auto">
      <div class="text-5xl mb-4"></div>
      <p class="text-lg text-slate-800 mb-2 font-bold">Chưa có đơn hàng nào</p>
      <p class="text-slate-400 text-xs font-semibold mb-6">Bắt đầu mua sắm những sản phẩm Anime yêu thích ngay hôm nay!</p>
      <button 
        @click="$router.push('/collections')"
        class="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-xl shadow-sm text-sm tracking-wide transition duration-300"
      >
        Khám phá Shop ngay
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderHistoryTab',
  props: {
    purchaseHistory: { type: Array, required: true },
    formatDate: { type: Function, required: true }
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
    }
  }
}
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>