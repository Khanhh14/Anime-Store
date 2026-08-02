<template>
  <div class="space-y-6">
    <!-- Header & Bộ lọc danh mục -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold text-white">Quản lý kho sản phẩm</h2>
        <p class="text-slate-400 text-sm">Xem, thêm, sửa đổi dữ liệu thực tế kết nối trực tiếp bảng `products`.</p>
      </div>

      <div class="flex flex-wrap items-center gap-3 w-full lg:w-auto">
        <!-- Dropdown Lọc theo Danh mục -->
        <div class="relative min-w-[200px]">
          <select 
            v-model="selectedCategory" 
            @change="currentPage = 1"
            class="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500 cursor-pointer appearance-none shadow-lg"
          >
            <option value="">Tất cả danh mục</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
          <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400 text-xs">▼</div>
        </div>

        <!-- Nút Thêm sản phẩm -->
        <button 
          @click="openProductModal(null)" 
          class="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-bold rounded-xl shadow-lg transition duration-200 hover:opacity-90 flex items-center gap-1"
        >
          <span>＋</span> Thêm sản phẩm mới
        </button>
      </div>
    </div>

    <!-- Bảng sản phẩm -->
    <div class="bg-slate-800 rounded-2xl border border-slate-700/60 shadow-xl overflow-hidden flex flex-col">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-900/40 text-slate-400 border-b border-slate-700">
            <tr>
              <th class="p-4 font-semibold w-20">Ảnh</th>
              <th class="p-4 font-semibold">Tên sản phẩm</th>
              <th class="p-4 font-semibold">Giá niêm yết</th>
              <th class="p-4 font-semibold">Số lượng kho</th>
              <th class="p-4 font-semibold text-center w-32">Hành động</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-700/40">
            <tr v-for="prod in paginatedProducts" :key="prod.id" class="text-slate-300 hover:bg-slate-700/20 transition">
              <td class="p-4">
                <div class="w-12 h-12 bg-slate-900 border border-slate-700 rounded-lg flex items-center justify-center text-xl overflow-hidden flex-shrink-0">
                  <img 
                    v-if="prod.image" 
                    :src="`http://localhost:3000/uploads/${prod.image}`" 
                    class="w-full h-full object-cover" 
                    @error="(e) => e.target.style.display='none'"
                  />
                  <span v-else>🧸</span>
                </div>
              </td>
              <td class="p-4">
                <p class="font-bold text-white text-base">{{ prod.name }}</p>
                <p class="text-xs text-slate-500 mt-0.5">
                  Danh mục: {{ getCategoryName(prod) }} | Hãng: {{ getBrandName(prod) }}
                </p>
              </td>
              <td class="p-4 font-semibold text-pink-400 text-base whitespace-nowrap">
                {{ Number(prod.price).toLocaleString() }}₫
              </td>
              <td class="p-4 whitespace-nowrap">
                <span :class="['px-2.5 py-1 rounded-md text-xs font-bold', prod.stock === 0 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-slate-900 text-slate-300']">
                  {{ prod.stock === 0 ? 'Hết hàng' : prod.stock + ' chiếc' }}
                </span>
              </td>
              <td class="p-4 text-center whitespace-nowrap">
                <div class="flex items-center justify-center gap-2">
                  <button @click="openProductModal(prod)" class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold rounded-md transition">Sửa</button>
                  <button @click="handleDeleteProduct(prod.id)" class="px-3 py-1.5 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 text-xs font-semibold rounded-md transition">Xóa</button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredProducts.length === 0">
              <td colspan="5" class="text-center py-12 text-slate-500">
                <div class="text-3xl mb-2">🔍</div>
                <p class="text-sm font-semibold">Không tìm thấy sản phẩm nào phù hợp.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Thanh Phân Trang (Pagination) -->
      <div v-if="totalPages > 1" class="p-4 bg-slate-900/30 border-t border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div>
          Hiển thị <span class="font-bold text-white">{{ startItemIndex + 1 }}</span> - <span class="font-bold text-white">{{ endItemIndex }}</span> trên tổng số <span class="font-bold text-white">{{ filteredProducts.length }}</span> sản phẩm
        </div>

        <div class="flex items-center gap-1.5">
          <button 
            @click="currentPage--" 
            :disabled="currentPage === 1"
            class="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-40 disabled:hover:bg-slate-700 transition"
          >
             Trước
          </button>

          <span class="px-3 py-1.5 font-bold text-slate-200">
            Trang {{ currentPage }} / {{ totalPages }}
          </span>

          <button 
            @click="currentPage++" 
            :disabled="currentPage === totalPages"
            class="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-40 disabled:hover:bg-slate-700 transition"
          >
            Sau 
          </button>
        </div>
      </div>
    </div>

    <!-- SỬ DỤNG TELEPORT ĐỂ ÉP MODAL RA NGOÀI VÀ CÂN GIỮA CHUẨN 100% -->
    <Teleport to="body">
      <div 
        v-if="isProductModalOpen" 
        class="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
      >
        <div class="bg-slate-800 border border-slate-700/80 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
          
          <!-- Modal Header -->
          <div class="bg-slate-950 p-5 border-b border-slate-700/80 flex justify-between items-center flex-shrink-0">
            <h3 class="text-xl font-bold text-white">{{ isProductEditMode ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới' }}</h3>
            <button @click="isProductModalOpen = false" class="text-slate-400 hover:text-white text-2xl leading-none">&times;</button>
          </div>

          <!-- Modal Body (Form cuộn bên trong) -->
          <form @submit.prevent="handleSubmitProduct" class="p-6 space-y-4 overflow-y-auto text-sm text-slate-300 flex-1">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-400 mb-1">Thể loại truyện / mô hình *</label>
                <select v-model="productForm.category_id" required class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-pink-500 appearance-none">
                  <option value="" disabled hidden>-- Chọn thể loại --</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                    {{ cat.name }}
                  </option>
                </select>
              </div>
              
              <div>
                <label class="block text-xs font-bold text-slate-400 mb-1">Thương hiệu / hãng sản xuất</label>
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

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <!-- Modal Footer (Cố định ở đáy) -->
            <div class="pt-4 flex justify-end gap-3 border-t border-slate-700/80">
              <button type="button" @click="isProductModalOpen = false" class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition">Hủy</button>
              <button type="submit" :disabled="isSubmitting" class="px-5 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-bold transition flex items-center gap-2 disabled:opacity-50">
                <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                Lưu lại
              </button>
            </div>
          </form>

        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const products = ref([])
const categories = ref([]) 
const brands = ref([]) 

const selectedCategory = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

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

const filteredProducts = computed(() => {
  if (!selectedCategory.value) return products.value
  return products.value.filter(p => String(p.category_id) === String(selectedCategory.value))
})

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage) || 1
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredProducts.value.slice(start, start + itemsPerPage)
})

const startItemIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endItemIndex = computed(() => Math.min(currentPage.value * itemsPerPage, filteredProducts.value.length))

const getCategoryName = (prod) => {
  if (prod.category_name) return prod.category_name
  const cat = categories.value.find(c => String(c.id) === String(prod.category_id))
  return cat ? cat.name : (prod.category_id || 'N/A')
}

const getBrandName = (prod) => {
  if (prod.brand_name) return prod.brand_name
  const b = brands.value.find(brand => String(brand.id) === String(prod.brand_id))
  return b ? b.name : (prod.brand_id || 'N/A')
}

const fetchProducts = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/products')
    const data = await res.json()
    if (data.success) products.value = data.data
  } catch (error) {
    console.error('Lỗi khi tải danh sách sản phẩm:', error)
  }
}

const fetchCategoriesData = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/categories')
    const data = await res.json()
    if (data.success) categories.value = data.data
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu categories:', error)
  }
}

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

onMounted(() => {
  fetchProducts()
  fetchCategoriesData()
  fetchBrandsData()
})
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fadeIn {
  animation: fadeIn 0.2s ease-out forwards;
}
</style>