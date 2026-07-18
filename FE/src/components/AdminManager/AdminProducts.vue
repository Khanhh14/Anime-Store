<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold text-white">Quản lý kho sản phẩm</h2>
        <p class="text-slate-400 text-sm">Xem, thêm, sửa đổi dữ liệu thực tế kết nối trực tiếp bảng `products`.</p>
      </div>
      <button @click="openProductModal(null)" class="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-bold rounded-xl shadow-lg transition duration-200 hover:opacity-90">
        ＋ Thêm sản phẩm mới
      </button>
    </div>

    <div class="bg-slate-800 rounded-2xl border border-slate-700/60 shadow-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-900/40 text-slate-400 border-b border-slate-700">
            <tr>
              <th class="p-4 font-semibold">Ảnh</th>
              <th class="p-4 font-semibold">Tên sản phẩm</th>
              <th class="p-4 font-semibold">Giá niêm yết</th>
              <th class="p-4 font-semibold">Số lượng kho</th>
              <th class="p-4 font-semibold text-center">Hành động</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-700/40">
            <tr v-for="prod in products" :key="prod.id" class="text-slate-300 hover:bg-slate-700/20 transition">
              <td class="p-4">
                <div class="w-12 h-12 bg-slate-900 border border-slate-700 rounded-lg flex items-center justify-center text-xl overflow-hidden">
                  <img v-if="prod.image" :src="`http://localhost:3000/uploads/${prod.image}`" class="w-full h-full object-cover" @error="(e) => e.target.style.display='none'"/>
                  <span v-else>🧸</span>
                </div>
              </td>
              <td class="p-4">
                <p class="font-bold text-white text-base">{{ prod.name }}</p>
                <p class="text-xs text-slate-500 mt-0.5">Danh mục: {{ prod.category_name || prod.category_id }} | Hãng: {{ prod.brand_name || prod.brand_id }}</p>
              </td>
              <td class="p-4 font-semibold text-pink-400 text-base">{{ Number(prod.price).toLocaleString() }}₫</td>
              <td class="p-4">
                <span :class="['px-2.5 py-1 rounded-md text-xs font-bold', prod.stock === 0 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-slate-900 text-slate-400']">
                  {{ prod.stock === 0 ? 'Hết hàng' : prod.stock + ' chiếc' }}
                </span>
              </td>
              <td class="p-4 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button @click="openProductModal(prod)" class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold rounded-md transition">Sửa</button>
                  <button @click="handleDeleteProduct(prod.id)" class="px-3 py-1.5 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 text-xs font-semibold rounded-md transition">Xóa</button>
                </div>
              </td>
            </tr>
            <tr v-if="products.length === 0">
              <td colspan="5" class="text-center py-10 text-slate-500">Không có sản phẩm nào trong CSDL.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="isProductModalOpen" class="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div class="bg-slate-800 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        <div class="bg-slate-950 p-5 border-b border-slate-700 flex justify-between items-center">
          <h3 class="text-xl font-bold text-white">{{ isProductEditMode ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới' }}</h3>
          <button @click="isProductModalOpen = false" class="text-slate-400 hover:text-white text-xl">✕</button>
        </div>

        <form @submit.prevent="handleSubmitProduct" class="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-sm text-slate-300">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-400 mb-1">Chọn thể loại truyện / mô hình *</label>
              <select v-model="productForm.category_id" required class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-pink-500 appearance-none">
                <option value="" disabled hidden>-- Chọn thể loại --</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>
            
            <div>
              <label class="block text-xs font-bold text-slate-400 mb-1">Chọn thương hiệu / hãng sản xuất</label>
              <select v-model="productForm.brand_id" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-pink-500 appearance-none">
                <option value="" disabled hidden>-- Chọn thương hiệu --</option>
                <option v-for="brand in brands" :key="brand.id" :value="brand.id">
                  {{ brand.name }}
                </option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-400 mb-1">Tên sản phẩm *</label>
            <input v-model="productForm.name" type="text" required class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-pink-500"/>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-400 mb-1">Giá bán (₫) *</label>
              <input v-model="productForm.price" type="number" required class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-pink-500"/>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-400 mb-1">Số lượng kho *</label>
              <input v-model="productForm.stock" type="number" required class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-pink-500"/>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-400 mb-1">Tệp hình ảnh thực tế</label>
            <input type="file" @change="handleFileChange" accept="image/*" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-400 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-pink-600 file:text-white hover:file:bg-pink-700 file:cursor-pointer"/>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-400 mb-1">Mô tả sản phẩm (description)</label>
            <textarea v-model="productForm.description" rows="3" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-pink-500"></textarea>
          </div>

          <div class="pt-4 flex justify-end gap-3 border-t border-slate-700">
            <button type="button" @click="isProductModalOpen = false" class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition">Hủy</button>
            <button type="submit" :disabled="isSubmitting" class="px-5 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-bold transition flex items-center gap-2">
              <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
              Lưu lại
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const products = ref([])
const categories = ref([]) 
const brands = ref([])     

const isProductModalOpen = ref(false)
const isProductEditMode = ref(false)
const isSubmitting = ref(false)
const currentProductId = ref(null)
const selectedFile = ref(null)

const productForm = ref({
  category_id: '',
  brand_id: '',
  name: '',
  price: 0,
  stock: 0,
  description: ''
})

const emit = defineEmits(['refresh-data'])

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return { 'Authorization': `Bearer ${token}` }
}

// 1. Tải danh sách sản phẩm
const fetchProducts = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/products')
    const data = await res.json()
    if (data.success) products.value = data.data
  } catch (error) {
    console.error('Lỗi khi tải danh sách sản phẩm:', error)
  }
}

// 2. Tải danh sách danh mục về để hiển thị tên lên ô select box
const fetchCategoriesData = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/categories')
    const data = await res.json()
    if (data.success) categories.value = data.data
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu categories:', error)
  }
}

// 3. Tải danh sách thương hiệu về để hiển thị tên lên ô select box
const fetchBrandsData = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/brands')
    const data = await res.json()
    if (data.success) brands.value = data.data
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu brands:', error)
  }
}

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) selectedFile.value = file
}

const openProductModal = (product = null) => {
  selectedFile.value = null
  if (product) {
    isProductEditMode.value = true
    currentProductId.value = product.id
    productForm.value = { ...product }
  } else {
    isProductEditMode.value = false
    currentProductId.value = null
    productForm.value = { category_id: '', brand_id: '', name: '', price: 0, stock: 0, description: '' }
  }
  isProductModalOpen.value = true
}

const handleSubmitProduct = async () => {
  isSubmitting.value = true
  const url = isProductEditMode.value 
    ? `http://localhost:3000/api/products/${currentProductId.value}`
    : 'http://localhost:3000/api/products'
  
  const method = isProductEditMode.value ? 'PUT' : 'POST'

  const formData = new FormData()
  formData.append('category_id', productForm.value.category_id || '')
  formData.append('brand_id', productForm.value.brand_id || '')
  formData.append('name', productForm.value.name)
  formData.append('price', productForm.value.price)
  formData.append('stock', productForm.value.stock)
  formData.append('description', productForm.value.description || '')
  if (selectedFile.value) {
    formData.append('image', selectedFile.value)
  }

  try {
    const response = await fetch(url, {
      method: method,
      headers: getAuthHeaders(),
      body: formData
    })
    const data = await response.json()
    if (data.success) {
      alert(data.message)
      isProductModalOpen.value = false
      fetchProducts()
      emit('refresh-data') 
    } else {
      alert(data.message)
    }
  } catch (error) {
    console.error('Lỗi lưu sản phẩm:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleDeleteProduct = async (id) => {
  if (!confirm('Bạn có chắc chắn muốn xóa vĩnh viễn mô hình này khỏi CSDL?')) return
  try {
    const response = await fetch(`http://localhost:3000/api/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    const data = await response.json()
    if (data.success) {
      alert(data.message)
      fetchProducts()
      emit('refresh-data')
    } else {
      alert(data.message)
    }
  } catch (error) {
    console.error('Lỗi khi xóa sản phẩm:', error)
  }
}

// Nạp đồng thời tất cả dữ liệu nền khi component được dựng (mounted)
onMounted(() => {
  fetchProducts()
  fetchCategoriesData()
  fetchBrandsData()
})
</script>