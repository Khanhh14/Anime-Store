<template>
  <div class="animate-fadeIn space-y-6">
    <div v-if="cart.length > 0">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        <!-- DANH SÁCH SẢN PHẨM -->
        <div class="lg:col-span-2 space-y-6">
          <div class="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 class="text-xl font-bold text-slate-800 tracking-wide flex items-center gap-3">
              <span class="inline-block w-1.5 h-6 bg-pink-500 rounded-full"></span>
              <font-awesome-icon :icon="['fas', 'cart-shopping']" class="text-pink-500 text-lg" />
              <span>Giỏ Hàng Của Bạn</span>
            </h2>
            <span class="text-slate-500 text-xs bg-slate-50 px-3 py-1 rounded-full border border-slate-100 font-medium">
              {{ cart.length }} sản phẩm
            </span>
          </div>

          <div class="space-y-4">
            <div 
              v-for="item in cart" 
              :key="item.id"
              class="group relative bg-[#fcfbfc] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-100 hover:border-pink-200 hover:shadow-sm transition-all duration-300"
            >
              <!-- Khối bên trái: Ảnh + Thông tin -->
              <div class="flex flex-col sm:flex-row items-center gap-4 flex-1 min-w-0 w-full">
                <!-- Hình ảnh sản phẩm -->
                <div class="w-20 h-20 bg-white rounded-xl flex items-center justify-center text-4xl flex-shrink-0 overflow-hidden border border-slate-100 group-hover:border-pink-200 transition-colors duration-300">
                  <img v-if="item.image" :src="`http://localhost:3000/uploads/${item.image}`" :alt="item.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span v-else>{{ getProductIcon(item.category_name) }}</span>
                </div>
                
                <!-- Thông tin chi tiết sản phẩm -->
                <div class="flex-1 min-w-0 text-center sm:text-left">
                  <h3 class="font-bold text-slate-800 text-base truncate group-hover:text-pink-500 transition-colors duration-300">
                    {{ item.name }}
                  </h3>
                  <p class="text-slate-400 text-xs mt-1 line-clamp-2 font-medium">
                    {{ item.description || 'Sản phẩm Anime cao cấp limited edition.' }}
                  </p>
                  <div class="flex items-center justify-center sm:justify-start gap-3 mt-1.5">
                    <p class="text-pink-500 font-bold text-base tracking-tight">
                      {{ (item.price || 0).toLocaleString() }}<span class="text-xs ml-0.5">₫</span>
                    </p>
                    <!-- Hiển thị số kho nếu tìm thấy biến tồn kho hợp lệ -->
                    <span v-if="getStock(item) !== null" class="text-emerald-600 text-xs bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-100">
                      Kho: {{ getStock(item) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Khối bên phải: Tăng giảm số lượng + Nút Xóa -->
              <div class="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end flex-shrink-0">
                <!-- Bộ tăng giảm số lượng -->
                <div class="flex items-center gap-1 bg-white rounded-xl p-1 border border-slate-100 shadow-sm">
                  <button 
                    @click="decreaseQuantity(item)"
                    :disabled="item.quantity <= 1"
                    :class="[
                      'w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 text-xs font-bold',
                      item.quantity <= 1 
                        ? 'text-slate-300 bg-slate-50 cursor-not-allowed' 
                        : 'bg-slate-50 text-slate-500 hover:bg-pink-50 hover:text-pink-500'
                    ]"
                  >
                    <font-awesome-icon :icon="['fas', 'minus']" />
                  </button>
                  <span class="text-slate-700 font-mono font-bold px-3 w-10 text-center text-sm">
                    {{ item.quantity }}
                  </span>
                  <button 
                    @click="increaseQuantity(item)"
                    :disabled="getStock(item) !== null && item.quantity >= getStock(item)"
                    :class="[
                      'w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 text-xs font-bold',
                      getStock(item) !== null && item.quantity >= getStock(item)
                        ? 'text-slate-300 bg-slate-50 cursor-not-allowed' 
                        : 'bg-slate-50 text-slate-500 hover:bg-pink-50 hover:text-pink-500'
                    ]"
                  >
                    <font-awesome-icon :icon="['fas', 'plus']" />
                  </button>
                </div>

                <!-- Nút Xóa độc lập -->
                <button 
                  @click="$emit('remove-item', item.id)"
                  class="w-8 h-8 flex items-center justify-center bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-xl border border-slate-100 hover:border-rose-100 shadow-sm transition-all duration-200"
                  title="Xóa khỏi giỏ hàng"
                >
                  <font-awesome-icon :icon="['fas', 'xmark']" class="text-xs" />
                </button>
              </div>

            </div>
          </div>
        </div>

        <!-- TÓM TẮT ĐƠN HÀNG -->
        <div class="bg-[#fcfbfc] rounded-2xl p-6 border border-slate-100 h-fit shadow-sm sticky top-6">
          <h3 class="text-lg font-bold text-slate-800 mb-5 tracking-wide flex items-center gap-2">
            <font-awesome-icon :icon="['fas', 'receipt']" class="text-pink-500 text-base" />
            <span>Sản Phẩm Đang Mua</span>
          </h3>
          
          <div class="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-6">
            <div class="flex justify-between items-center">
              <span class="text-slate-600 font-medium text-sm">Tổng thanh toán:</span>
              <div class="text-right">
                <span class="text-pink-500 font-bold text-xl tracking-tight">
                  {{ cartTotal.toLocaleString() }}
                </span>
                <span class="text-pink-500 font-bold text-sm ml-0.5">₫</span>
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <button 
              @click="$emit('checkout')" 
              class="w-full py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-xl transition duration-300 shadow-sm hover:shadow-md hover:shadow-pink-500/10 text-sm tracking-wide transform active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <font-awesome-icon :icon="['fas', 'check']" />
              <span>XÁC NHẬN ĐẶT HÀNG</span>
            </button>
            <button 
              @click="$router.push('/collections')" 
              class="w-full py-3 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-700 font-semibold rounded-xl transition duration-300 border border-slate-100 text-xs flex items-center justify-center gap-2"
            >
              <font-awesome-icon :icon="['fas', 'arrow-left']" />
              <span>Tiếp Tục Mua Sắm</span>
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- GIỎ HÀNG TRỐNG -->
    <div v-else class="text-center py-20 bg-slate-50/50 rounded-2xl border border-slate-100 max-w-2xl mx-auto">
      <div class="text-5xl mb-4 text-pink-400 animate-bounce">
        <font-awesome-icon :icon="['fas', 'cart-shopping']" />
      </div>
      <p class="text-xl text-slate-700 mb-2 font-bold tracking-tight">Giỏ hàng đang trống kìa!</p>
      <p class="text-slate-400 text-xs mb-6 max-w-sm mx-auto leading-relaxed">Có vẻ như bạn chưa chọn được mô hình hay món đồ Anime ưng ý nào rồi.</p>
      <button 
        @click="$router.push('/collections')" 
        class="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-xl transition duration-300 shadow-sm text-xs tracking-wide inline-flex items-center gap-2"
      >
        <span>Khám Phá Shop Ngay</span>
        <font-awesome-icon :icon="['fas', 'arrow-right']" />
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
        alert(`Sản phẩm này chỉ còn tối đa ${stockAvailable} món trong kho thôi!`);
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
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>