<template>
  <div class="min-h-screen bg-[#f9f8f9] text-slate-800">
    <!-- Loading Overlay -->
    <div v-if="loading" class="fixed inset-0 bg-black/30 flex items-center justify-center z-50 animate-fadeIn">
      <div class="bg-white rounded-xl p-8 shadow-xl">
        <div class="animate-spin w-12 h-12 border-4 border-pink-100 border-t-pink-500 rounded-full mx-auto"></div>
        <p class="text-slate-600 mt-4 text-center font-medium">Đang tải dữ liệu...</p>
      </div>
    </div>

    <div class="min-h-screen p-4 md:p-8">
      <div class="max-w-7xl mx-auto">
        <!-- Header Section -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 animate-fadeIn">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/20">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 6H6.28l-.31-1.243A1 1 0 005 4H3z" />
                <path d="M16 16a2 2 0 11-4 0 2 2 0 014 0zM4 12a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h1 class="text-4xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600">
                ANIME SHOP
              </h1>
              <p class="text-slate-400 text-sm font-medium">Quản lý đơn hàng của bạn</p>
            </div>
          </div>
          <div class="flex items-center gap-4 w-full sm:w-auto bg-white p-3 rounded-xl shadow-sm border border-slate-100">
            <div class="text-right flex-1 sm:flex-none">
              <p class="text-slate-800 font-bold">{{ user.name || 'Khách hàng' }}</p>
              <p class="text-slate-400 text-xs">{{ user.email }}</p>
            </div>
            <button 
              @click="goToHome"
              class="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold rounded-lg transition duration-300 hover:shadow-lg hover:shadow-pink-500/20 whitespace-nowrap flex items-center gap-2 text-sm"
            >
               Trang Chủ
            </button>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="flex gap-2 md:gap-4 mb-8 border-b border-slate-200 overflow-x-auto pb-0">
          <button 
            v-for="tab in tabs" 
            :key="tab"
            @click="activeTab = tab"
            :class="[
              'px-4 md:px-6 py-3 font-bold transition duration-300 whitespace-nowrap text-sm md:text-base border-b-2 -mb-[2px]',
              activeTab === tab 
                ? 'text-pink-500 border-pink-500' 
                : 'text-slate-400 border-transparent hover:text-slate-700'
            ]"
          >
            {{ tab }}
          </button>
        </div>

        <!-- Tab Contents Wrapper (Thêm nền trắng bo góc đồng bộ như ảnh mẫu) -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-fadeIn">
          <CartTab 
            v-if="activeTab === 'Giỏ Hàng'"
            :cart="cart"
            :shippingFee="shippingFee"
            :getProductIcon="getProductIcon"
            @update-quantity="updateCartQuantity"
            @remove-item="removeFromCart"
            @checkout="checkout"
          />

          <OrderHistoryTab 
            v-if="activeTab === 'Lịch Sử Mua Hàng'"
            :purchaseHistory="purchaseHistory"
            :formatDate="formatDate"
            @select-order="handleSelectOrder"
          />

          <OrderDetailTab 
            v-if="activeTab === 'Chi Tiết Đơn Hàng'"
            :selectedOrder="selectedOrder"
            :formatDate="formatDate"
            :getProductIcon="getProductIcon"
            @back-to-history="activeTab = 'Lịch Sử Mua Hàng'"
            @go-to-history="activeTab = 'Lịch Sử Mua Hàng'"
          />

          <div v-if="activeTab === 'Đổi Mật Khẩu'">
            <ChangePassword />
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import AuthService from '@/plugins/authService';
import OrderService from '@/plugins/orderService';
import ChangePassword from '@/components/Auth/ChangePassword.vue'; 
import CartTab from '@/components/DashBoard/CartTab.vue';
import OrderHistoryTab from '@/components/DashBoard/OrderHistoryTab.vue';
import OrderDetailTab from '@/components/DashBoard/OrderDetailTab.vue';

export default {
  name: 'DashboardView',
  components: {
    ChangePassword,
    CartTab,
    OrderHistoryTab,
    OrderDetailTab
  },
  data() {
    return {
      loading: false,
      user: {
        name: '',
        email: '',
        role: 'user'
      },
      activeTab: 'Giỏ Hàng',
      tabs: ['Giỏ Hàng', 'Lịch Sử Mua Hàng', 'Chi Tiết Đơn Hàng', 'Đổi Mật Khẩu'],
      shippingFee: 30000,
      selectedOrder: null,
      cart: [],
      purchaseHistory: []
    }
  },
  methods: {
    async fetchUserData() {
      this.loading = true;
      try {
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) {
          this.user = {
            name: currentUser.name || currentUser.fullName || 'Khách hàng',
            email: currentUser.email,
            role: currentUser.role || 'user'
          };
        }
        await this.fetchCart();
        await this.fetchOrders();
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchCart() {
      try {
        const response = await OrderService.getUserCart();
        if (response.success && response.data) {
          this.cart = Array.isArray(response.data) ? response.data : [];
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        this.cart = [];
      }
    },

    async fetchOrders() {
      try {
        const response = await OrderService.getUserOrders();
        if (response.success && response.data) {
          this.purchaseHistory = Array.isArray(response.data) ? response.data : [];
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        this.purchaseHistory = [];
      }
    },

    updateCartQuantity(productId, newQuantity) {
      if (newQuantity <= 0) {
        this.removeFromCart(productId);
        return;
      }
      const item = this.cart.find(item => item.id === productId);
      if (item) {
        item.quantity = newQuantity;
      }
    },

    async removeFromCart(productId) {
      try {
        const response = await OrderService.removeFromCart(productId);
        if (response.success) {
          this.cart = this.cart.filter(item => item.id !== productId);
        }
      } catch (error) {
        console.error('Error removing from cart:', error);
        this.cart = this.cart.filter(item => item.id !== productId);
      }
    },

    async checkout() {
      if (this.cart.length === 0) {
        alert('Giỏ hàng trống');
        return;
      }
      try {
        const orderData = {
          items: this.cart.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.price
          })),
          total: this.cart.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 1)), 0) + this.shippingFee
        };
        const response = await OrderService.createOrder(orderData);
        if (response.success) {
          alert('Đặt hàng thành công');
          this.cart = [];
          await this.fetchOrders();
          this.activeTab = 'Lịch Sử Mua Hàng';
        } else {
          alert('Đặt hàng thất bại: ' + response.message);
        }
      } catch (error) {
        console.error('Error creating order:', error);
        alert('Lỗi khi đặt hàng');
      }
    },

    handleSelectOrder(order) {
      this.selectedOrder = order;
      this.activeTab = 'Chi Tiết Đơn Hàng';
    },

    goToHome() {
      this.$router.push('/'); 
    },

    getProductIcon(categoryName) {
      const icons = {
        'Electronics': '📱',
        'Clothing': '👕',
        'Books': '📚',
        'Food': '🍕',
        'Sports': '⚽',
        'Default': '📦'
      };
      return icons[categoryName] || icons['Default'];
    },

    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' });
    }
  },
  mounted() {
    this.fetchUserData();
  }
}
</script>

<style scoped>
button {
  transition: all 0.3s ease;
}
button:active {
  transform: scale(0.95);
}
button:hover {
  transform: translateY(-1px);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-fadeIn {
  animation: fadeIn 0.4s ease-out forwards;
}
.animate-spin {
  animation: spin 1s linear infinite;
}

/* Custom Scrollbar theo tông màu hồng nhạt của ảnh */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb {
  background: #f472b6;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #ec4899;
}
</style>