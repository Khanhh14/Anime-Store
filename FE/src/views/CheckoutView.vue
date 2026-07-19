<template>
  <div class="min-h-screen bg-[#fcf8f9] text-neutral-800 font-sans">
    
    <Header 
      @logo-click="handleLogoClick"
      @nav-click="handleNavClick"
      @search-click="handleSearchClick"
      @login="handleLogin"
      @signup="handleSignup"
    />

    <main class="max-w-6xl mx-auto p-4 md:p-8 relative z-10">
      
      <div class="mb-8 flex items-center justify-between border-b border-neutral-200 pb-5">
        <h1 class="text-2xl font-extrabold tracking-wide text-neutral-900 flex items-center gap-3">
          <span class="inline-block w-1.5 h-6 bg-[#de2053] rounded-full"></span>
          XÁC NHẬN ĐƠN HÀNG
        </h1>
        <button 
          @click="goBack" 
          class="px-4 py-2 bg-white hover:bg-neutral-50 text-neutral-600 rounded-xl border border-neutral-200 text-sm font-semibold shadow-sm transition"
        >
          ← Quay lại mua sắm
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        
        <div class="lg:col-span-3 space-y-6">
          <div class="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm space-y-6">
            <h2 class="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-3 flex items-center gap-2">
              <span></span>   Thông Tin Nhận Hàng
            </h2>

            <form @submit.prevent="handlePlaceOrder" class="space-y-6">
              <div>
                <label class="block text-neutral-600 text-sm font-semibold mb-2">
                  Địa Chỉ Giao Hàng <span class="text-[#de2053]">*</span>
                </label>
                <textarea 
                  v-model="orderForm.shipping_address" 
                  rows="3"
                  required
                  placeholder="Nhập số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                  class="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-800 focus:outline-none focus:border-[#de2053] focus:bg-white transition resize-none text-sm placeholder:text-neutral-400"
                ></textarea>
              </div>

              <!-- Chọn Phương Thức Giao Hàng -->
              <div>
                <label class="block text-neutral-600 text-sm font-semibold mb-3">
                  Phương Thức Giao Hàng <span class="text-[#de2053]">*</span>
                </label>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label 
                    :class="[
                      'flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200',
                      orderForm.shipping_method === 'standard' 
                        ? 'bg-[#de2053]/5 border-[#de2053] text-[#de2053]' 
                        : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300'
                    ]"
                  >
                    <input type="radio" name="shipping_method" value="standard" v-model="orderForm.shipping_method" class="hidden" />
                    <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center" :class="orderForm.shipping_method === 'standard' ? 'border-[#de2053]' : 'border-neutral-300'">
                      <div v-if="orderForm.shipping_method === 'standard'" class="w-2.5 h-2.5 bg-[#de2053] rounded-full"></div>
                    </div>
                    <div>
                      <p class="font-bold text-sm" :class="orderForm.shipping_method === 'standard' ? 'text-[#de2053]' : 'text-neutral-800'">Giao hàng cơ bản</p>
                      <p class="text-xs text-neutral-500">Phí vận chuyển: 15,000₫</p>
                    </div>
                  </label>

                  <label 
                    :class="[
                      'flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200',
                      orderForm.shipping_method === 'express' 
                        ? 'bg-[#de2053]/5 border-[#de2053] text-[#de2053]' 
                        : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300'
                    ]"
                  >
                    <input type="radio" name="shipping_method" value="express" v-model="orderForm.shipping_method" class="hidden" />
                    <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center" :class="orderForm.shipping_method === 'express' ? 'border-[#de2053]' : 'border-neutral-300'">
                      <div v-if="orderForm.shipping_method === 'express'" class="w-2.5 h-2.5 bg-[#de2053] rounded-full"></div>
                    </div>
                    <div>
                      <p class="font-bold text-sm" :class="orderForm.shipping_method === 'express' ? 'text-[#de2053]' : 'text-neutral-800'">Giao hàng nhanh</p>
                      <p class="text-xs text-neutral-500">Phí vận chuyển: 25,000₫</p>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Phần chọn Ưu đãi / Voucher -->
              <div class="border border-neutral-100 bg-neutral-50/50 rounded-xl p-4">
                <div class="flex items-center justify-between border-b border-neutral-200 pb-2.5">
                  <span class="flex items-center gap-2 font-bold text-sm text-neutral-800"> Ưu Đãi Hấp Dẫn</span>
                  <button 
                    type="button"
                    @click="showVouchers = !showVouchers" 
                    class="text-xs font-bold text-[#de2053] hover:underline flex items-center gap-1"
                  >
                    <span>{{ showVouchers ? 'Ẩn danh sách' : 'Xem tất cả mã' }}</span>
                    <span v-if="vouchersLoading" class="w-3 h-3 border border-[#de2053]/40 border-t-[#de2053] rounded-full animate-spin"></span>
                  </button>
                </div>

                <div class="mt-3 flex gap-2" v-if="!showVouchers && selectedVoucher">
                  <div class="flex-1 bg-rose-50 border border-dashed border-[#de2053] rounded-xl px-3 py-2 flex items-center justify-between">
                    <div>
                      <span class="font-bold text-[#de2053] text-xs bg-white border border-[#de2053] px-1.5 py-0.5 rounded mr-2">{{ selectedVoucher.code }}</span>
                      <span class="text-xs text-neutral-700 font-medium">
                        {{ selectedVoucher.type === 'freeship' ? 'Miễn phí vận chuyển' : `Giảm -${Number(selectedVoucher.discount_value).toLocaleString()}₫` }}
                      </span>
                    </div>
                    <button type="button" @click="removeVoucher" class="text-[11px] font-bold text-neutral-400 hover:text-neutral-600">Gỡ bỏ</button>
                  </div>
                </div>

                <div v-if="showVouchers" class="mt-3 space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  <div v-if="availableVouchers.length === 0 && !vouchersLoading" class="text-center py-4 text-xs text-neutral-400">
                    Hiện không có mã giảm giá nào khả dụng từ hệ thống.
                  </div>

                  <div 
                    v-for="voucher in availableVouchers" 
                    :key="voucher.id"
                    :class="[
                      'border rounded-xl p-3 flex items-center justify-between transition-all bg-white shadow-sm',
                      selectedVoucher && selectedVoucher.id === voucher.id ? 'border-[#de2053] bg-rose-50/20' : 'border-neutral-200 hover:border-neutral-300'
                    ]"
                  >
                    <div class="flex-1 pr-3">
                      <div class="flex items-center gap-2 mb-1">
                        <span class="font-black text-[11px] tracking-wider text-[#de2053] bg-rose-100 px-1.5 py-0.5 rounded">{{ voucher.code }}</span>
                        
                        <span v-if="voucher.type === 'freeship'" class="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded border border-emerald-200 font-medium">
                           Free Ship
                        </span>
                        <span v-else-if="Number(voucher.min_order_value) === 0" class="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-200 font-medium">
                           Giảm không điều kiện
                        </span>
                        <span v-else class="text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded border border-amber-200 font-medium">
                           Giảm có điều kiện
                        </span>

                        <span class="text-[10px] text-neutral-500" v-if="voucher.expiry_date">
                          HSD: {{ formatDate(voucher.expiry_date) }}
                        </span>
                      </div>
                      
                      <p class="text-xs font-bold text-neutral-800">
                        {{ voucher.type === 'freeship' ? 'Miễn phí vận chuyển cho đơn hàng' : `Giảm ngay ${Number(voucher.discount_value).toLocaleString()}₫` }}
                      </p>
                      
                      <div class="flex items-center gap-3 mt-1 text-[10px] text-neutral-400">
                        <span>
                          Đơn tối thiểu: <strong class="text-neutral-600">{{ Number(voucher.min_order_value || 0) === 0 ? 'Không có điều kiện' : `${Number(voucher.min_order_value).toLocaleString()}₫` }}</strong>
                        </span>
                        <span>•</span>
                        <span>
                          Số lượng: <strong class="text-neutral-600">{{ voucher.quantity === null ? 'Vô hạn' : `${voucher.quantity} lượt` }}</strong>
                        </span>
                      </div>
                    </div>
                    <div>
                      <button 
                        type="button"
                        @click="applyVoucher(voucher)"
                        :disabled="totalPrice < Number(voucher.min_order_value || 0) || voucher.quantity === 0"
                        :class="[
                          'px-3 py-1.5 text-[11px] font-bold rounded-lg transition shadow-sm w-20 text-center',
                          (totalPrice < Number(voucher.min_order_value || 0) || voucher.quantity === 0)
                            ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed' 
                            : (selectedVoucher && selectedVoucher.id === voucher.id ? 'bg-[#de2053] text-white' : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50')
                        ]"
                      >
                        <span v-if="voucher.quantity === 0">Hết lượt</span>
                        <span v-else>{{ selectedVoucher && selectedVoucher.id === voucher.id ? 'Bỏ chọn' : 'Áp dụng' }}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-neutral-600 text-sm font-semibold mb-3">
                  Phương Thức Thanh Toán <span class="text-[#de2053]">*</span>
                </label>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label 
                    :class="[
                      'flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200',
                      orderForm.payment_method === 'cod' 
                        ? 'bg-[#de2053]/5 border-[#de2053] text-[#de2053]' 
                        : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300'
                    ]"
                  >
                    <input type="radio" name="payment_method" value="cod" v-model="orderForm.payment_method" class="hidden" />
                    <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center" :class="orderForm.payment_method === 'cod' ? 'border-[#de2053]' : 'border-neutral-300'">
                      <div v-if="orderForm.payment_method === 'cod'" class="w-2.5 h-2.5 bg-[#de2053] rounded-full"></div>
                    </div>
                    <div>
                      <p class="font-bold text-sm" :class="orderForm.payment_method === 'cod' ? 'text-[#de2053]' : 'text-neutral-800'">COD</p>
                      <p class="text-xs text-neutral-500">Thanh toán khi nhận hàng</p>
                    </div>
                  </label>

                  <label 
                    :class="[
                      'flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200',
                      orderForm.payment_method === 'banking' 
                        ? 'bg-[#de2053]/5 border-[#de2053] text-[#de2053]' 
                        : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300'
                    ]"
                  >
                    <input type="radio" name="payment_method" value="banking" v-model="orderForm.payment_method" class="hidden" />
                    <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center" :class="orderForm.payment_method === 'banking' ? 'border-[#de2053]' : 'border-neutral-300'">
                      <div v-if="orderForm.payment_method === 'banking'" class="w-2.5 h-2.5 bg-[#de2053] rounded-full"></div>
                    </div>
                    <div>
                      <p class="font-bold text-sm" :class="orderForm.payment_method === 'banking' ? 'text-[#de2053]' : 'text-neutral-800'">Chuyển Khoản</p>
                      <p class="text-xs text-neutral-500">Qua ATM / Internet Banking</p>
                    </div>
                  </label>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm">
            <h3 class="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <span></span> Sản Phẩm Đang Mua
            </h3>

            <div class="bg-neutral-50 border border-neutral-100 rounded-xl p-4 flex gap-4 items-center mb-6">
              <div class="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-neutral-200">
                <img v-if="product.image" :src="product.image" :alt="product.name" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center text-xl bg-neutral-100">📦</div>
              </div>
              <div class="min-w-0 flex-1">
                <h4 class="font-bold text-neutral-800 text-sm truncate">{{ product.name || 'Tên sản phẩm' }}</h4>
                <p class="text-neutral-500 text-xs mt-0.5">Số lượng: <span class="font-bold text-neutral-800">x{{ quantity }}</span></p>
                <p class="text-[#de2053] font-bold text-sm mt-1">{{ (product.price || 0).toLocaleString() }}₫</p>
              </div>
            </div>

            <div class="bg-neutral-50 rounded-xl p-4 border border-neutral-100 space-y-3 mb-6">
              <div class="flex justify-between text-sm">
                <span class="text-neutral-500">Tổng giá trị hàng:</span>
                <span class="text-neutral-800 font-medium">{{ totalPrice.toLocaleString() }}₫</span>
              </div>
              
              <div class="flex justify-between text-sm">
                <span class="text-neutral-500">Phí vận chuyển:</span>
                <span class="text-neutral-800 font-medium">+{{ shippingFee.toLocaleString() }}₫</span>
              </div>
              
              <div v-if="selectedVoucher" class="flex justify-between text-sm items-center">
                <span class="text-neutral-500 flex items-center gap-1">
                  Ưu đãi <span class="text-xs bg-rose-100 text-[#de2053] px-1.5 py-0.5 rounded font-bold">{{ selectedVoucher.code }}</span>:
                </span>
                <span class="text-[#de2053] font-medium">
                  {{ selectedVoucher.type === 'freeship' ? `-${discountAmount.toLocaleString()}₫ (FreeShip)` : `-${discountAmount.toLocaleString()}₫` }}
                </span>
              </div>
              
              <div class="border-t border-neutral-200 my-2"></div>
              <div class="flex justify-between items-end">
                <span class="text-neutral-900 font-bold text-sm">Tổng thanh toán:</span>
                <span class="text-[#de2053] font-black text-xl tracking-tight">
                  {{ finalTotal.toLocaleString() }}₫
                </span>
              </div>
            </div>

            <button 
              @click="handlePlaceOrder"
              :disabled="loading || !orderForm.shipping_address"
              class="w-full py-3.5 bg-gradient-to-r from-[#de2053] to-[#e63968] hover:from-[#c21443] hover:to-[#de2053] disabled:from-neutral-300 disabled:to-neutral-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300 shadow-md shadow-rose-500/10 text-center flex items-center justify-center gap-2 text-sm tracking-wider"
            >
              <span v-if="loading" class="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
              <span v-else>XÁC NHẬN ĐẶT HÀNG </span>
            </button>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script>
import OrderService from '@/plugins/orderService';
import Header from '@/components/Home/Header.vue';

export default {
  name: 'CheckoutView',
  components: {
    Header
  },
  data() {
    return {
      loading: false,
      vouchersLoading: false, 
      product: {},
      quantity: 1,
      showVouchers: false, 
      selectedVoucher: null, 
      orderForm: {
        shipping_address: '',
        payment_method: 'cod',
        shipping_method: 'standard'
      },
      availableVouchers: [] 
    }
  },
  computed: {
    totalPrice() {
      return (Number(this.product.price) || 0) * this.quantity;
    },
    shippingFee() {
      return this.orderForm.shipping_method === 'express' ? 25000 : 15000;
    },
    discountAmount() {
      if (!this.selectedVoucher) return 0;
      
      const type = this.selectedVoucher.type;
      const value = Number(this.selectedVoucher.discount_value || 0);

      if (type === 'freeship') {
        return this.shippingFee; 
      }
      
      return value;
    },
    finalTotal() {
      const remaining = this.totalPrice + this.shippingFee - this.discountAmount;
      return remaining > 0 ? remaining : 0;
    }
  },
  methods: {
    async fetchVouchersFromDB() {
      this.vouchersLoading = true;
      try {
        const response = await OrderService.getVouchers();
        if (response && response.success) {
          this.availableVouchers = response.data || [];
        } else if (Array.isArray(response)) {
          this.availableVouchers = response;
        }
      } catch (error) {
        console.error('Lỗi khi tải danh sách mã giảm giá từ CSDL:', error);
      } finally {
        this.vouchersLoading = false;
      }
    },
    loadCheckoutData() {
      const checkoutProduct = localStorage.getItem('buy_now_product');
      const checkoutQty = localStorage.getItem('buy_now_quantity');

      if (checkoutProduct) {
        this.product = JSON.parse(checkoutProduct);
        this.quantity = parseInt(checkoutQty) || 1;
      } else {
        alert('Không tìm thấy thông tin sản phẩm để thanh toán!');
        this.$router.push('/collections');
      }
    },
    applyVoucher(voucher) {
      const minOrder = Number(voucher.min_order_value || 0);
      if (this.totalPrice < minOrder) {
        alert(`Mã này chỉ áp dụng cho đơn hàng từ ${minOrder.toLocaleString()}₫ trở lên!`);
        return;
      }
      
      if (this.selectedVoucher && this.selectedVoucher.id === voucher.id) {
        this.selectedVoucher = null;
      } else {
        this.selectedVoucher = voucher;
        this.showVouchers = false; 
      }
    },
    removeVoucher() {
      this.selectedVoucher = null;
    },
    formatDate(dateString) {
      if (!dateString) return '';
      try {
        const date = new Date(dateString);
        if(isNaN(date.getTime())) return dateString;
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
      } catch {
        return dateString;
      }
    },
    async handlePlaceOrder() {
      if (!this.orderForm.shipping_address.trim()) {
        alert('Vui lòng nhập địa chỉ giao hàng!');
        return;
      }

      this.loading = true;
      try {
        const payload = {
          total_price: this.finalTotal, 
          original_price: this.totalPrice, 
          shipping_fee: this.shippingFee, 
          shipping_method: this.orderForm.shipping_method, 
          coupon_id: this.selectedVoucher ? this.selectedVoucher.id : null, 
          voucher_code: this.selectedVoucher ? this.selectedVoucher.code : null, 
          discount_amount: this.discountAmount, 
          is_freeship: this.selectedVoucher && this.selectedVoucher.type === 'freeship' ? 1 : 0,
          payment_method: this.orderForm.payment_method, 
          shipping_address: this.orderForm.shipping_address,
          status: 'pending', 
          items: [
            {
              product_id: this.product.id,
              quantity: this.quantity,
              price: Number(this.product.price)
            }
          ]
        };

        const response = await OrderService.createOrder(payload);
        if (response.success) {
          alert('🎉 Đặt hàng thành công!');
          
          // CẬP NHẬT TẠI CLIENT: Nếu có dùng mã giảm giá, ta tiến hành giảm số lượng đi 1 ngay lập tức trên giao diện 
          if (this.selectedVoucher) {
            const voucherInList = this.availableVouchers.find(v => v.id === this.selectedVoucher.id);
            if (voucherInList && voucherInList.quantity !== null && voucherInList.quantity > 0) {
              voucherInList.quantity -= 1;
            }
          }

          localStorage.removeItem('buy_now_product');
          localStorage.removeItem('buy_now_quantity');
          this.$router.push('/dashboard'); 
        } else {
          alert('Đặt hàng thất bại: ' + response.message);
        }
      } catch (error) {
        console.error('Lỗi khi thực hiện đặt hàng:', error);
        alert('Đã xảy ra lỗi trong quá trình xử lý đơn hàng!');
      } finally {
        this.loading = false;
      }
    },
    goBack() { this.$router.go(-1); },
    handleLogoClick() { this.$router.push({ name: 'home' }); },
    handleNavClick(id) { this.$router.push({ name: id }); },
    handleSearchClick() { console.log('Tìm kiếm được click tại trang Checkout'); },
    handleLogin() { this.$router.push({ name: 'login' }); },
    handleSignup() { this.$router.push({ name: 'register' }); }
  },
  mounted() {
    this.loadCheckoutData();
    this.fetchVouchersFromDB(); 
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
.font-sans { font-family: 'Nunito', sans-serif; }
.animate-spin { animation: spin 1s linear infinite; }
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>