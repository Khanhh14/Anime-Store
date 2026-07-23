<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-rose-200/15 rounded-full blur-3xl"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl"></div>
    </div>

    <Header 
      @logo-click="handleLogoClick"
      @nav-click="handleNavClick"
      @search-click="handleSearchClick"
      @login="handleLogin"
      @signup="handleSignup"
    />

    <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
      <button 
        @click="router.back()" 
        class="inline-flex items-center gap-2 text-gray-500 hover:text-rose-600 font-bold text-sm mb-6 transition-colors group"
      >
        <svg class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Quay lại danh sách
      </button>

      <div v-if="loading" class="flex flex-col items-center justify-center py-24">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-rose-600 mb-4"></div>
        <p class="text-gray-500 text-sm font-semibold">Đang tải thông tin sản phẩm...</p>
      </div>

      <div v-else-if="product" class="bg-white rounded-3xl shadow-xl border border-gray-100/80 overflow-hidden">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-0">
          
          <div class="md:col-span-5 bg-gray-50 p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-100">
            <div class="relative w-full aspect-square bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden group flex items-center justify-center">
              <img 
                v-if="product.image"
                :src="buildImageUrl(product.image)" 
                :alt="product.name"
                class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div v-else class="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                <svg class="w-16 h-16 stroke-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span class="text-xs font-semibold uppercase tracking-wider">Không có hình ảnh</span>
              </div>
            </div>
          </div>

          <div class="md:col-span-7 p-8 md:p-10 flex flex-col justify-between space-y-6">
            <div class="space-y-5">
              <div>
                <h1 class="text-2xl md:text-3xl font-extrabold text-gray-900 leading-snug mb-1">
                  {{ product.name }}
                </h1>
                <p class="text-xs font-mono text-gray-400">Mã sản phẩm: #{{ product.id }}</p>
              </div>

              <div class="bg-gradient-to-r from-rose-50 via-pink-50 to-orange-50 rounded-2xl p-6 border border-rose-100/70 relative overflow-hidden shadow-sm">
                <div class="absolute right-4 top-1/2 -translate-y-1/2 opacity-10 font-black text-6xl tracking-widest text-rose-600 pointer-events-none select-none font-mono">
                  PRICE
                </div>
                <span class="block text-xs font-bold text-rose-500/80 uppercase tracking-wider mb-1">Giá bán chính thức</span>
                <p class="text-3xl md:text-4xl font-black bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 bg-clip-text text-transparent tracking-tight">
                  {{ formatPrice(product.price) }}
                </p>
              </div>

              <div class="border-t border-gray-100 pt-4 space-y-3">
                <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider">Thông số sản phẩm</h3>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div class="flex justify-between sm:justify-start items-center gap-4 py-1.5 border-b border-gray-100 sm:border-none">
                    <span class="text-gray-400 font-medium w-24">Danh mục:</span>
                    <span class="font-bold text-gray-800 bg-purple-50 text-purple-600 px-2.5 py-0.5 rounded-lg text-xs border border-purple-100">
                      {{ getCategoryName() }}
                    </span>
                  </div>

                  <div class="flex justify-between sm:justify-start items-center gap-4 py-1.5 border-b border-gray-100 sm:border-none">
                    <span class="text-gray-400 font-medium w-24">Hãng SX:</span>
                    <span class="font-bold text-gray-800 bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-lg text-xs border border-blue-100">
                      {{ getBrandName() }}
                    </span>
                  </div>

                  <div class="flex justify-between sm:justify-start items-center gap-4 py-1.5 border-b border-gray-100 sm:border-none">
                    <span class="text-gray-400 font-medium w-24">Tình trạng:</span>
                    <span 
                      class="font-bold text-xs px-2.5 py-0.5 rounded-lg border"
                      :class="product.stock > 0 ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'"
                    >
                      {{ product.stock > 0 ? `Còn hàng (${product.stock})` : 'Hết hàng' }}
                    </span>
                  </div>

                  <div class="flex justify-between sm:justify-start items-center gap-4 py-1.5 sm:border-none">
                    <span class="text-gray-400 font-medium w-24">Xuất xứ:</span>
                    <span class="font-bold text-gray-800 text-xs bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                      <img 
                        v-if="originFlagCode" 
                        :src="`https://flagcdn.com/w20/${originFlagCode}.png`" 
                        class="w-4.5 h-3 object-cover rounded-sm border border-gray-200/60" 
                      />
                      {{ getOrigin() }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="border-t border-gray-100 pt-4 flex items-center gap-4">
                <span class="text-xs font-bold text-gray-400 uppercase tracking-wider w-24">Số lượng:</span>
                <div class="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden h-10 shadow-sm">
                  <button 
                    @click="decreaseQuantity"
                    class="px-3 text-gray-500 hover:bg-gray-100 font-bold transition-colors h-full"
                    type="button"
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    v-model.number="quantity" 
                    min="1" 
                    :max="product.stock"
                    class="w-12 text-center bg-transparent border-none text-gray-800 font-bold text-sm focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    readonly
                  />
                  <button 
                    @click="increaseQuantity(product.stock)"
                    class="px-3 text-gray-500 hover:bg-gray-100 font-bold transition-colors h-full"
                    type="button"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div class="pt-2">
              <p 
                v-if="cartMessage" 
                class="text-xs font-semibold mb-3 px-4 py-2.5 rounded-xl border"
                :class="isSuccess ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'"
              >
                {{ cartMessage }}
              </p>

              <div class="flex flex-col sm:flex-row gap-3">
                <button 
                  @click="handleAddToCart(product.id, product.stock)"
                  :disabled="product.stock <= 0 || isSubmitting" 
                  class="flex-1 border-2 border-rose-600 text-rose-600 hover:bg-rose-50 font-bold py-3.5 px-6 rounded-xl transition-all transform active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
                >
                  <svg v-if="!isSubmitting" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z"></path>
                  </svg>
                  <div v-else class="animate-spin rounded-full h-4 w-4 border-2 border-rose-600 border-t-transparent"></div>
                  {{ isSubmitting ? 'Đang thêm...' : 'Thêm vào giỏ' }}
                </button>
                
                <button 
                  @click="onBuyNowClick"
                  :disabled="product.stock <= 0"
                  class="flex-1 bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-rose-500/20 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                >
                  Mua ngay
                </button>
              </div>
            </div>

          </div>
        </div>

        <!-- Khối Mô Tả Sản Phẩm -->
        <div class="border-t border-gray-100 p-8 md:p-10 bg-gray-50/50">
          <div class="max-w-3xl">
            <h3 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span class="w-1 h-4 bg-rose-600 rounded-full"></span>
              Mô tả sản phẩm
            </h3>
            <p class="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm font-normal">
              {{ product.description || 'Thông tin mô tả đang được cập nhật.' }}
            </p>
          </div>
        </div>

        <!-- 🟢 KHỐI ĐÁNH GIÁ SẢN PHẨM (Được thêm mới vào đây) -->
        <div class="border-t border-gray-100 p-8 md:p-10 bg-white">
          <ReviewProducts :product-id="product.id" />
        </div>

      </div>

      <div v-else class="text-center py-20 bg-white rounded-3xl shadow-md border border-gray-100">
        <span class="text-5xl block mb-3">🔍</span>
        <h3 class="text-lg text-gray-800 font-bold">Không tìm thấy sản phẩm</h3>
        <p class="text-gray-400 text-sm mb-5">Vui lòng kiểm tra lại đường dẫn hoặc quay lại cửa hàng.</p>
        <button @click="router.push({ name: 'collections' })" class="bg-gray-900 text-white font-bold px-5 py-2 rounded-lg text-xs transition-colors hover:bg-black">
          Quay lại cửa hàng
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Header from '@/components/Home/Header.vue';
import ReviewProducts from './ReviewProducts.vue'; // 🟢 Import component ReviewProducts nằm cùng thư mục
import { useCart } from '@/composables/UseCart'; 
import { countryList } from '../../plugins/countries.js';

const route = useRoute();
const router = useRouter();

const product = ref(null);
const loading = ref(true);

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const baseUrl = apiUrl.replace('/api', '');

const {
  quantity,
  isSubmitting,
  cartMessage,
  isSuccess,
  increaseQuantity,
  decreaseQuantity,
  handleAddToCart
} = useCart(apiUrl);

// --- TÍNH TOÁN LẤY MÃ CỜ CHO QUỐC GIA XUẤT XỨ ---
const originFlagCode = computed(() => {
  const currentOrigin = getOrigin();
  if (currentOrigin === 'Đang cập nhật') return null;
  const target = countryList.find(c => c.name.toLowerCase() === currentOrigin.toLowerCase());
  return target ? target.flag : null;
});

// --- LOGIC XỬ LÝ MUA NGAY ---
const onBuyNowClick = () => {
  if (!product.value || product.value.stock <= 0) return;

  const preparedProduct = {
    ...product.value,
    image: buildImageUrl(product.value.image)
  };

  localStorage.setItem('buy_now_product', JSON.stringify(preparedProduct));
  localStorage.setItem('buy_now_quantity', quantity.value);
  router.push('/checkout');
};

// --- LOGIC TRÍCH XUẤT DỮ LIỆU AN TOÀN ---
const getBrandName = () => {
  if (!product.value) return 'Đang cập nhật';
  if (product.value.brand_name) return product.value.brand_name;
  if (product.value.brand && typeof product.value.brand === 'object') {
    return product.value.brand.brand_name || product.value.brand.name;
  }
  return 'Đang cập nhật';
};

const getCategoryName = () => {
  if (!product.value) return 'Đang cập nhật';
  if (product.value.category_name) return product.value.category_name;
  if (product.value.category && typeof product.value.category === 'object') {
    return product.value.category.category_name || product.value.category.name;
  }
  return 'Đang cập nhật';
};

const getOrigin = () => {
  if (!product.value) return 'Đang cập nhật';
  if (product.value.country) return product.value.country;
  if (product.value.brand && typeof product.value.brand === 'object') {
    return product.value.brand.country || 'Nhật Bản';
  }
  return 'Nhật Bản';
};

// --- API FETCH SẢN PHẨM ---
const fetchProduct = async () => {
  loading.value = true;
  try {
    const id = route.params.id;
    const response = await fetch(`${apiUrl}/products/${id}`);
    const data = await response.json();
    if (data.success) {
      product.value = data.data;
    }
  } catch (error) {
    console.error("Lỗi API:", error);
  } finally {
    loading.value = false;
  }
};

const buildImageUrl = (path) => {
  if (!path) return '';
  return path.startsWith('http') ? path : `${baseUrl}/uploads/${path}`;
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

// Xử lý sự kiện Header
const handleLogoClick = () => router.push({ name: 'home' });
const handleNavClick = (id) => router.push({ name: id });
const handleSearchClick = () => {};
const handleLogin = () => router.push({ name: 'login' });
const handleSignup = () => router.push({ name: 'register' });

onMounted(fetchProduct);
</script>