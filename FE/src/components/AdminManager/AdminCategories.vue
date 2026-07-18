<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-white">Quản lý Phân loại & Thương hiệu</h2>
      <p class="text-slate-400 text-sm">Xem, thêm, sửa đổi dữ liệu thực tế kết nối trực tiếp bảng `categories` và `brands`.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <div class="bg-slate-800 rounded-2xl border border-slate-700/60 shadow-xl overflow-hidden p-5 space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-bold text-pink-400 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-pink-500"></span>
            Phân loại danh mục (`categories`)
          </h3>
          <button @click="openModal('category', null)" class="px-3 py-1.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded-lg shadow-md hover:opacity-90 transition">
            ＋ Thêm danh mục
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-slate-900/40 text-slate-400 border-b border-slate-700">
              <tr>
                <th class="p-3 font-semibold w-12 text-center">ID</th>
                <th class="p-3 font-semibold w-40">Tên danh mục</th>
                <th class="p-3 font-semibold">Mô tả</th>
                <th class="p-3 font-semibold text-center w-28">Hành động</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-700/40">
              <tr v-for="cat in categories" :key="cat.id" class="text-slate-300 hover:bg-slate-700/20 transition">
                <td class="p-3 text-center text-slate-500 font-mono">{{ cat.id }}</td>
                <td class="p-3 font-bold text-white">{{ cat.name }}</td>
                <td class="p-3 text-slate-400 max-w-[180px] truncate" :title="cat.description">{{ cat.description || '---' }}</td>
                <td class="p-3 text-center">
                  <div class="flex items-center justify-center gap-1.5">
                    <button @click="openModal('category', cat)" class="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded transition">Sửa</button>
                    <button @click="handleDelete('category', cat.id)" class="px-2 py-1 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 text-xs rounded transition">Xóa</button>
                  </div>
                </td>
              </tr>
              <tr v-if="categories.length === 0">
                <td colspan="4" class="text-center py-6 text-slate-500 text-xs">Không có danh mục nào.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="bg-slate-800 rounded-2xl border border-slate-700/60 shadow-xl overflow-hidden p-5 space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-bold text-blue-400 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-blue-500"></span>
            Thương hiệu / Hãng (`brands`)
          </h3>
          <button @click="openModal('brand', null)" class="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold rounded-lg shadow-md hover:opacity-90 transition">
            ＋ Thêm thương hiệu
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-slate-900/40 text-slate-400 border-b border-slate-700">
              <tr>
                <th class="p-3 font-semibold w-12 text-center">ID</th>
                <th class="p-3 font-semibold w-40">Tên thương hiệu</th>
                <th class="p-3 font-semibold">Quốc gia</th>
                <th class="p-3 font-semibold text-center w-28">Hành động</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-700/40">
              <tr v-for="brand in brands" :key="brand.id" class="text-slate-300 hover:bg-slate-700/20 transition">
                <td class="p-3 text-center text-slate-500 font-mono">{{ brand.id }}</td>
                <td class="p-3 font-bold text-white">{{ brand.name }}</td>
                <td class="p-3 text-slate-400 flex items-center gap-2">
                  <img v-if="getCountryFlag(brand.country)" :src="`https://flagcdn.com/w20/${getCountryFlag(brand.country)}.png`" class="w-5 h-3.5 object-cover rounded-sm shadow-sm" />
                  {{ brand.country || '---' }}
                </td>
                <td class="p-3 text-center">
                  <div class="flex items-center justify-center gap-1.5">
                    <button @click="openModal('brand', brand)" class="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded transition">Sửa</button>
                    <button @click="handleDelete('brand', brand.id)" class="px-2 py-1 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 text-xs rounded transition">Xóa</button>
                  </div>
                </td>
              </tr>
              <tr v-if="brands.length === 0">
                <td colspan="4" class="text-center py-6 text-slate-500 text-xs">Không có thương hiệu nào.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <div v-if="isOpen" class="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div class="bg-slate-800 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        
        <div class="bg-slate-950 p-4 border-b border-slate-700 flex justify-between items-center">
          <h3 class="text-lg font-bold text-white">
            {{ isEditMode ? 'Cập nhật' : 'Thêm mới' }} 
            {{ targetType === 'category' ? 'Danh mục' : 'Thương hiệu' }}
          </h3>
          <button @click="isOpen = false" class="text-slate-400 hover:text-white text-lg">✕</button>
        </div>

        <form @submit.prevent="handleSubmit" class="p-5 space-y-4 text-sm text-slate-300">
          <div>
            <label class="block text-xs font-bold text-slate-400 mb-1">
              Tên {{ targetType === 'category' ? 'danh mục' : 'thương hiệu' }} *
            </label>
            <input v-model="form.name" type="text" required class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-pink-500"/>
          </div>

          <div v-if="targetType === 'category'">
            <label class="block text-xs font-bold text-slate-400 mb-1">Mô tả danh mục (description)</label>
            <textarea v-model="form.description" rows="3" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-pink-500"></textarea>
          </div>

          <div v-else class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-400">Quốc gia (country)</label>
            
            <div @click="toggleDropdown" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white flex items-center justify-between cursor-pointer hover:border-slate-600 transition select-none">
              <div class="flex items-center gap-2.5">
                <img v-if="selectedCountryFlag" :src="`https://flagcdn.com/w20/${selectedCountryFlag}.png`" class="w-5 h-3.5 object-cover rounded-sm shadow" />
                <span class="text-slate-200">{{ form.country || '-- Chọn quốc gia --' }}</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap='round' stroke-linejoin='round' :class="{'rotate-180': isDropdownOpen}" class="transition-transform duration-200"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>

            <div v-if="isDropdownOpen" class="w-full mt-1 max-h-40 overflow-y-auto bg-slate-950 border border-slate-700/70 rounded-lg shadow-inner divide-y divide-slate-800/60 custom-scrollbar block">
              <div v-for="country in countries" :key="country.code" @click="selectCountry(country)" class="flex items-center gap-3 p-2.5 hover:bg-blue-600/20 hover:text-blue-400 cursor-pointer transition text-left text-slate-300">
                <img :src="`https://flagcdn.com/w20/${country.flag}.png`" class="w-5 h-3.5 object-cover rounded-sm shadow-sm" />
                <span class="font-medium text-xs">{{ country.name }}</span>
              </div>
            </div>
          </div>

          <div class="pt-2 flex justify-end gap-3 border-t border-slate-700">
            <button type="button" @click="isOpen = false" class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition">Hủy</button>
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
import { ref, onMounted, computed } from 'vue'
import { countryList } from '../../plugins/countries.js'

const categories = ref([])
const brands = ref([])
const countries = ref(countryList)

const isDropdownOpen = ref(false)

const isOpen = ref(false)
const isEditMode = ref(false)
const isSubmitting = ref(false)
const targetType = ref('category') 
const currentId = ref(null)

const form = ref({
  name: '',
  description: '',
  country: ''
})

const emit = defineEmits(['refresh-data'])

// Lấy mã cờ của quốc gia hiện tại dựa vào tên đang chọn để hiển thị trên ô bấm chính
const selectedCountryFlag = computed(() => {
  if (!form.value.country) return null
  const target = countries.value.find(c => c.name === form.value.country)
  return target ? target.flag : null
})

// Tìm mã cờ cho dữ liệu hiển thị ngoài bảng danh sách chính
const getCountryFlag = (countryName) => {
  if (!countryName) return null
  const target = countries.value.find(c => c.name === countryName)
  return target ? target.flag : null
}

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const selectCountry = (country) => {
  form.value.country = country.name
  isDropdownOpen.value = false
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}

const fetchCategories = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/categories')
    const data = await res.json()
    if (data.success) categories.value = data.data
  } catch (error) {
    console.error('Lỗi khi tải danh mục:', error)
  }
}

const fetchBrands = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/brands')
    const data = await res.json()
    if (data.success) brands.value = data.data
  } catch (error) {
    console.error('Lỗi khi tải thương hiệu:', error)
  }
}

const loadAllData = () => {
  fetchCategories()
  fetchBrands()
}

const openModal = (type, data = null) => {
  targetType.value = type
  isDropdownOpen.value = false // Reset dropdown khi mở form mới
  if (data) {
    isEditMode.value = true
    currentId.value = data.id
    form.value = { ...data }
  } else {
    isEditMode.value = false
    currentId.value = null
    form.value = { name: '', description: '', country: '' }
  }
  isOpen.value = true
}

const handleSubmit = async () => {
  isSubmitting.value = true
  
  const baseRoute = targetType.value === 'category' ? 'categories' : 'brands'
  const url = isEditMode.value 
    ? `http://localhost:3000/api/${baseRoute}/${currentId.value}`
    : `http://localhost:3000/api/${baseRoute}`
  
  const method = isEditMode.value ? 'PUT' : 'POST'

  const payload = { name: form.value.name }
  if (targetType.value === 'category') {
    payload.description = form.value.description || ''
  } else {
    payload.country = form.value.country || ''
  }

  try {
    const response = await fetch(url, {
      method: method,
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    })
    const resData = await response.json()
    
    if (resData.success) {
      alert(resData.message)
      isOpen.value = false
      loadAllData() 
      emit('refresh-data')
    } else {
      alert(resData.message)
    }
  } catch (error) {
    console.error(`Lỗi thao tác trên ${targetType.value}:`, error)
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async (type, id) => {
  const label = type === 'category' ? 'danh mục' : 'thương hiệu'
  if (!confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn ${label} này?`)) return
  
  const baseRoute = type === 'category' ? 'categories' : 'brands'
  try {
    const response = await fetch(`http://localhost:3000/api/${baseRoute}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    const data = await response.json()
    if (data.success) {
      alert(data.message)
      loadAllData()
      emit('refresh-data')
    } else {
      alert(data.message)
    }
  } catch (error) {
    console.error(`Lỗi khi xóa ${label}:`, error)
  }
}

onMounted(() => {
  loadAllData()
})
</script>

<style scoped>
/* Làm đẹp thanh scrollbar của danh sách chọn quốc gia */
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #0f172a;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 99px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #475569;
}
</style>