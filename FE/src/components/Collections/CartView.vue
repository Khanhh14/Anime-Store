<template>
  <div class="min-h-screen bg-gray-50 py-10">
    <main class="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
      <div v-if="product" class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
          <img :src="buildImageUrl(product.image)" :alt="product.name" class="w-full h-full object-cover" />
        </div>
        
        <div class="flex flex-col justify-between">
          <div>
            <h1 class="text-3xl font-extrabold text-gray-900 mb-2">{{ product.name }}</h1>
            <p class="text-2xl font-black text-rose-600 mb-6">{{ formatPrice(product.price) }}</p>
            <p class="text-gray-600 text-sm mb-6">{{ product.description }}</p>
          </div>

          <div class="space-y-4">
            <div class="flex items-center gap-4">
              <span class="text-sm font-bold text-gray-500 uppercase">Số lượng:</span>
              <div class="flex items-center border border-gray-200 rounded-xl overflow-hidden h-10">
                <button @click="quantity > 1 && quantity--" class="px-3 bg-gray-100 hover:bg-gray-200 font-bold">-</button>
                <input type="number" v-model.number="quantity" class="w-12 text-center font-bold focus:outline-none" readonly />
                <button @click="quantity++" class="px-3 bg-gray-100 hover:bg-gray-200 font-bold">+</button>
              </div>
            </div>

            <p v-if="cartMessage" class="text-xs font-semibold p-2.5 rounded-xl bg-green-50 text-green-600 border border-green-100">{{ cartMessage }}</p>

            <button @click="handleAddToCart" :disabled="isSubmitting" class="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2">
              <span v-if="isSubmitting" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
              {{ isSubmitting ? 'Đang thêm...' : 'Thêm vào giỏ hàng' }}
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const product = ref(null);
const quantity = ref(1);
const isSubmitting = ref(false);
const cartMessage = ref('');

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const handleAddToCart = async () => {
  isSubmitting.value = true;
  cartMessage.value = '';
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`${apiUrl}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ product_id: product.value.id, quantity: quantity.value })
    });
    const data = await response.json();
    if (data.success) {
      cartMessage.value = data.message;
    }
  } catch (error) {
    console.error(error);
  } finally {
    isSubmitting.value = false;
  }
};

const fetchProduct = async () => {
  const response = await fetch(`${apiUrl}/products/${route.params.id}`);
  const data = await response.json();
  if (data.success) product.value = data.data;
};

const buildImageUrl = (img) => img ? `${apiUrl.replace('/api', '')}/uploads/${img}` : '';
const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

onMounted(fetchProduct);
</script>