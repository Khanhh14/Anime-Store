<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <div v-if="loading" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-slate-800 rounded-lg p-8">
        <div class="animate-spin w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full mx-auto"></div>
        <p class="text-slate-300 mt-4 text-center">Đang tải dữ liệu...</p>
      </div>
    </div>

    <div class="min-h-screen p-4 md:p-8">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 animate-fadeIn">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 6H6.28l-.31-1.243A1 1 0 005 4H3z" />
                <path d="M16 16a2 2 0 11-4 0 2 2 0 014 0zM4 12a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h1 class="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500">
                ANIME SHOP
              </h1>
              <p class="text-slate-500 text-sm">Quản lý đơn hàng của bạn</p>
            </div>
          </div>
          <div class="flex items-center gap-4 w-full sm:w-auto">
            <div class="text-right flex-1 sm:flex-none">
              <p class="text-white font-semibold">{{ user.name || 'Khách hàng' }}</p>
              <p class="text-slate-400 text-sm">{{ user.email }}</p>
            </div>
            <button 
              @click="goToHome"
              class="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg transition duration-300 hover:shadow-lg hover:shadow-blue-500/30 whitespace-nowrap flex items-center gap-2"
            >
              🏠 Trang Chủ
            </button>
          </div>
        </div>

        <div class="flex gap-2 md:gap-4 mb-8 border-b border-slate-700 overflow-x-auto pb-4">
          <button 
            v-for="tab in tabs" 
            :key="tab"
            @click="activeTab = tab"
            :class="[
              'px-4 md:px-6 py-3 font-semibold transition duration-300 whitespace-nowrap text-sm md:text-base',
              activeTab === tab 
                ? 'text-blue-400 border-b-2 border-blue-400 shadow-lg shadow-blue-500/20' 
                : 'text-slate-400 hover:text-white'
            ]"
          >
            {{ tab }}
          </button>
        </div>

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

        <div v-if="activeTab === 'Đổi Mật Khẩu'" class="animate-fadeIn">
          <ChangePassword />
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import AuthService from '@/plugins/authService';
import OrderService from '@/plugins/orderService';
import ChangePassword from '@/components/Auth/ChangePassword.vue'; 
// Import 3 Component mới tách
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
  transform: translateY(-2px);
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-fadeIn {
  animation: fadeIn 0.6s ease-out forwards;
}
.animate-spin {
  animation: spin 1s linear infinite;
}
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.3);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.5);
}
</style>