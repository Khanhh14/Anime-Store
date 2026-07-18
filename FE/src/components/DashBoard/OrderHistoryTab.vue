<template>
  <div class="animate-fadeIn">
    <h2 class="text-3xl font-bold text-white mb-8">Lịch Sử Mua Hàng</h2>
    <div v-if="purchaseHistory.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div 
        v-for="order in purchaseHistory" 
        :key="order.id"
        class="bg-gradient-to-br from-slate-700 to-slate-600 rounded-xl p-6 border border-slate-600 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 transition duration-300 cursor-pointer"
        @click="$emit('select-order', order)"
      >
        <div class="flex justify-between items-start mb-6">
          <div>
            <p class="text-slate-400 text-sm font-semibold">ĐƠN HÀNG</p>
            <p class="text-white font-bold text-lg mt-1">#{{ order.id }}</p>
            <p class="text-slate-400 text-sm mt-2">{{ formatDate(order.date) }}</p>
          </div>
          
          <span :class="[
            'px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap',
            order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
            order.status === 'shipping' ? 'bg-blue-500/20 text-blue-400' :
            order.status === 'confirmed' ? 'bg-indigo-500/20 text-indigo-400' :
            order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          ]">
            {{ translateStatus(order.status) }}
          </span>
        </div>

        <div class="border-t border-slate-500/30 pt-4 space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-slate-400">Sản phẩm:</span>
            <span class="text-white font-semibold">{{ order.items?.length || 0 }} mặt hàng</span>
          </div>

          <div class="flex flex-col gap-1">
            <span class="text-slate-400">Địa chỉ giao hàng:</span>
            <span class="text-white text-sm line-clamp-2 bg-slate-800/40 px-3 py-1.5 rounded-lg border border-slate-600/30">
              {{ order.shipping_address || 'Chưa cập nhật' }}
            </span>
          </div>

          <div class="flex justify-between items-center pt-2">
            <span class="text-slate-300 font-semibold">Tổng tiền:</span>
            <span class="text-blue-400 font-bold text-lg">{{ (order.total || 0).toLocaleString() }}₫</span>
          </div>
        </div>
        
        <button class="w-full mt-6 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition duration-300">
          Xem Chi Tiết →
        </button>
      </div>
    </div>
    <div v-else class="text-center py-20">
      <div class="text-6xl mb-4">📦</div>
      <p class="text-3xl text-slate-400 mb-4 font-bold">Chưa có đơn hàng nào</p>
      <p class="text-slate-500">Bắt đầu mua sắm ngay hôm nay</p>
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
        'pending': 'Đang xử lý ⏳',
        'confirmed': 'Đã xác nhận 🤝',
        'shipping': 'Đang giao hàng 🚚',
        'completed': 'Đã hoàn thành 🎉',
        'cancelled': 'Đã hủy đơn ❌'
      };
      return statusMap[status] || status;
    }
  }
}
</script>