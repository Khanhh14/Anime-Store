<template>
  <div class="animate-fadeIn space-y-6">
    <div v-if="cart.length > 0">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        <!-- DANH SÁCH SẢN PHẨM -->
        <div class="lg:col-span-2 space-y-6">
          <div class="flex items-center justify-between border-b border-slate-700/60 pb-4">
            <h2 class="text-2xl font-bold text-white tracking-wide flex items-center gap-3">
              <span class="inline-block w-2 h-7 bg-blue-500 rounded-full"></span>
              Giỏ Hàng Của Bạn
            </h2>
            <span class="text-slate-400 text-sm bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/50">
              {{ cart.length }} sản phẩm
            </span>
          </div>

          <div class="space-y-4">
            <div 
              v-for="item in cart" 
              :key="item.id"
              class="group relative bg-slate-800/40 backdrop-blur-md rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-5 border border-slate-700/50 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300"
            >
              <!-- Khối bên trái: Ảnh + Thông tin -->
              <div class="flex flex-col sm:flex-row items-center gap-5 flex-1 min-w-0 w-full">
                <!-- Hình ảnh sản phẩm -->
                <div class="w-20 h-20 bg-slate-900 rounded-xl flex items-center justify-center text-4xl flex-shrink-0 overflow-hidden border border-slate-700 group-hover:border-blue-400/50 transition-colors duration-300">
                  <img v-if="item.image" :src="`http://localhost:3000/uploads/${item.image}`" :alt="item.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span v-else>{{ getProductIcon(item.category_name) }}</span>
                </div>
                
                <!-- Thông tin chi tiết sản phẩm -->
                <div class="flex-1 min-w-0 text-center sm:text-left">
                  <h3 class="font-bold text-slate-100 text-lg truncate group-hover:text-blue-400 transition-colors duration-300">
                    {{ item.name }}
                  </h3>
                  <p class="text-slate-400 text-xs mt-1 line-clamp-2 font-medium">
                    {{ item.description || 'Sản phẩm Anime cao cấp limited edition.' }}
                  </p>
                  <div class="flex items-center justify-center sm:justify-start gap-3 mt-2">
                    <p class="text-blue-400 font-extrabold text-xl tracking-tight">
                      {{ (item.price || 0).toLocaleString() }}<span class="text-xs ml-0.5">₫</span>
                    </p>
                    <!-- Hiển thị số kho nếu tìm thấy biến tồn kho hợp lệ -->
                    <span v-if="getStock(item) !== null" class="text-emerald-400 text-xs bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Kho: {{ getStock(item) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Khối bên phải: Tăng giảm số lượng + Nút Xóa độc lập -->
              <div class="flex items-center gap-4 w-full sm:w-auto justify-center sm:justify-end flex-shrink-0">
                <!-- Bộ tăng giảm số lượng -->
                <div class="flex items-center gap-1 bg-slate-900/90 rounded-xl p-1 border border-slate-700/60">
                  <button 
                    @click="decreaseQuantity(item)"
                    :disabled="item.quantity <= 1"
                    :class="[
                      'w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 text-lg font-bold',
                      item.quantity <= 1 
                        ? 'text-slate-600 bg-slate-800/40 cursor-not-allowed' 
                        : 'bg-slate-800 text-slate-400 hover:bg-blue-600/20 hover:text-blue-400'
                    ]"
                  >
                    −
                  </button>
                  <span class="text-slate-200 font-mono font-bold px-4 w-12 text-center text-sm">
                    {{ item.quantity }}
                  </span>
                  <button 
                    @click="increaseQuantity(item)"
                    :disabled="getStock(item) !== null && item.quantity >= getStock(item)"
                    :class="[
                      'w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 text-lg font-bold',
                      getStock(item) !== null && item.quantity >= getStock(item)
                        ? 'text-slate-600 bg-slate-800/40 cursor-not-allowed' 
                        : 'bg-slate-800 text-slate-400 hover:bg-blue-600/20 hover:text-blue-400'
                    ]"
                  >
                    +
                  </button>
                </div>

                <!-- NÚT XÓA ĐÃ ĐƯỢC ĐỊNH VỊ LẠI KHÔNG CHE NÚT KHÁC -->
                <button 
                  @click="$emit('remove-item', item.id)"
                  class="w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-xl border border-slate-700/80 hover:border-red-500/40 shadow-sm transition-all duration-200"
                  title="Xóa khỏi giỏ hàng"
                >
                  <span class="text-xs font-bold">✕</span>
                </button>
              </div>

            </div>
          </div>
        </div>

        <!-- TÓM TẮT ĐƠN HÀNG -->
        <div class="bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/80 h-fit shadow-[0_10px_30px_rgba(0,0,0,0.3)] sticky top-6">
          <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2 tracking-wide">
            <span></span> Tóm Tắt Đơn Hàng
          </h3>
          
          <div class="bg-slate-900/60 rounded-xl p-4 border border-slate-800 mb-6">
            <div class="flex justify-between items-end">
              <span class="text-white font-bold text-base">Tổng cộng:</span>
              <div class="text-right">
                <span class="text-blue-400 font-mono font-black text-2xl tracking-tight">
                  {{ cartTotal.toLocaleString() }}
                </span>
                <span class="text-blue-400 font-bold text-sm ml-0.5">₫</span>
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <button 
              @click="$emit('checkout')" 
              class="w-full py-3.5 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-xl transition duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 text-base tracking-wide transform active:scale-[0.98]"
            >
              Thanh Toán Ngay 
            </button>
            <button 
              @click="$router.push('/collections')" 
              class="w-full py-3 bg-slate-800 hover:bg-slate-700/80 text-slate-300 hover:text-white font-semibold rounded-xl transition duration-300 border border-slate-700/80 text-sm"
            >
              Tiếp Tục Mua Sắm
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- GIỎ HÀNG TRỐNG -->
    <div v-else class="text-center py-24 bg-slate-800/20 backdrop-blur-sm rounded-3xl border border-slate-800/60 max-w-2xl mx-auto">
      <div class="text-7xl mb-6 animate-bounce">🛒</div>
      <p class="text-2xl text-slate-300 mb-2 font-bold tracking-tight">Giỏ hàng đang trống kìa!</p>
      <p class="text-slate-500 text-sm mb-8 max-w-sm mx-auto">Có vẻ như bạn chưa chọn được mô hình hay món đồ Anime ưng ý nào rồi.</p>
      <button 
        @click="$router.push('/collections')" 
        class="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-xl transition duration-300 shadow-md shadow-blue-500/10 hover:shadow-blue-500/30 text-sm tracking-wide"
      >
        Khám Phá Shop Ngay
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CartTab',
  props: {
    cart: { type: Array, required: true },
    getProductIcon: { type: Function, required: true }
  },
  computed: {
    cartTotal() {
      return this.cart.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 1)), 0);
    }
  },
  methods: {
    
    getStock(item) {
      if (item.stock !== undefined) return item.stock;
      if (item.quantity_in_stock !== undefined) return item.quantity_in_stock;
      if (item.instock !== undefined) return item.instock;
      return null; 
    },
    decreaseQuantity(item) {
      if (item.quantity > 1) {
        this.$emit('update-quantity', item.id, item.quantity - 1);
      }
    },
    increaseQuantity(item) {
      const stockAvailable = this.getStock(item);
      
      if (stockAvailable !== null && item.quantity >= stockAvailable) {
        alert(`Sản phẩm này chỉ còn tối đa ${stockAvailable} món trong kho thôii!`);
        return;
      }
      this.$emit('update-quantity', item.id, item.quantity + 1);
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
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>