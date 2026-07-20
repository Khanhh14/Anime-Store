<template>
  <div class="space-y-6">
    <!-- Header & Nút thêm tài khoản -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold text-white">Người dùng hệ thống</h2>
        <p class="text-slate-400 text-sm">Xem, thêm, sửa đổi dữ liệu kết nối trực tiếp bảng `users`.</p>
      </div>
      <button @click="openUserModal(null)" class="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-bold rounded-xl shadow-lg transition duration-200 hover:opacity-90">
        ＋ Thêm người dùng mới
      </button>
    </div>

    <!-- Bảng danh sách người dùng -->
    <div class="bg-slate-800 rounded-2xl border border-slate-700/60 shadow-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-900/40 text-slate-400 border-b border-slate-700">
            <tr>
              <th class="p-4 font-semibold w-16 text-center">ID</th>
              <th class="p-4 font-semibold">Họ và tên</th>
              <th class="p-4 font-semibold">Email liên hệ</th>
              <th class="p-4 font-semibold">Vai trò</th>
              <th class="p-4 font-semibold">Ngày tham gia</th>
              <th class="p-4 font-semibold text-center">Hành động</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-700/40">
            <tr v-for="user in users" :key="user.id || user.email" class="text-slate-300 hover:bg-slate-700/20 transition">
              <td class="p-4 text-center font-mono text-slate-500">{{ user.id || '-' }}</td>
              <td class="p-4 font-semibold text-white">{{ user.full_name || user.fullName }}</td>
              <td class="p-4 font-mono text-xs text-slate-400">{{ user.email }}</td>
              <td class="p-4">
                <span v-if="user.role === 'admin'" class="px-2.5 py-1 text-xs font-bold rounded bg-pink-500/10 text-pink-400 border border-pink-500/20 uppercase tracking-wider">
                  Admin
                </span>
                <span v-else class="px-2.5 py-1 text-xs font-bold rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 uppercase tracking-wider">
                  User
                </span>
              </td>
              <td class="p-4 text-slate-400">{{ formatDate(user.created_at) }}</td>
              <td class="p-4 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button @click="openUserModal(user)" class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold rounded-md transition">Sửa</button>
                  <button @click="handleDeleteUser(user.id)" class="px-3 py-1.5 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 text-xs font-semibold rounded-md transition">Xóa</button>
                </div>
              </td>
            </tr>
            <tr v-if="users.length === 0">
              <td colspan="6" class="text-center py-10 text-slate-500">Không có tài khoản nào trong CSDL.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- TELEPORT MODAL CHO USER -->
    <Teleport to="body">
      <div v-if="isUserModalOpen" class="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[9999] animate-fadeIn">
        <div class="bg-slate-800 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          <div class="bg-slate-950 p-5 border-b border-slate-700 flex justify-between items-center shrink-0">
            <h3 class="text-xl font-bold text-white">{{ isUserEditMode ? 'Cập nhật thông tin thành viên' : 'Thêm người dùng mới' }}</h3>
            <button type="button" @click="isUserModalOpen = false" class="text-slate-400 hover:text-white text-xl">✕</button>
          </div>

          <form @submit.prevent="handleSubmitUser" class="p-6 space-y-4 text-sm text-slate-300 overflow-y-auto">
            <div>
              <label class="block text-xs font-bold text-slate-400 mb-1">Họ và tên *</label>
              <input v-model="userForm.full_name" type="text" required placeholder="Ví dụ: Nguyễn Văn A" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-pink-500"/>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-400 mb-1">Email liên hệ *</label>
              <input v-model="userForm.email" type="email" required placeholder="username@gmail.com" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-pink-500 font-mono"/>
            </div>

            <!-- 🟢 ĐÃ CẬP NHẬT: Ẩn hoàn toàn ô nhập mật khẩu khi ở chế độ Sửa bằng v-if -->
            <div v-if="!isUserEditMode">
              <label class="block text-xs font-bold text-slate-400 mb-1">Mật khẩu *</label>
              <input v-model="userForm.password" type="password" required placeholder="Tối thiểu 6 ký tự" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-pink-500"/>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-400 mb-1">Phân quyền vai trò *</label>
              <select v-model="userForm.role" required class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-pink-500">
                <option value="user">User (Khách mua mô hình)</option>
                <option value="admin">Admin (Quản trị viên hệ thống)</option>
              </select>
            </div>

            <div class="pt-4 flex justify-end gap-3 border-t border-slate-700 sticky bottom-0 bg-slate-800">
              <button type="button" @click="isUserModalOpen = false" class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition">Hủy</button>
              <button type="submit" :disabled="isSubmitting" class="px-5 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-bold transition flex items-center gap-2">
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
import { ref } from 'vue'

// Nhận danh sách users từ component cha truyền xuống
defineProps({
  users: {
    type: Array,
    default: () => []
  }
})

// Định nghĩa gửi tín hiệu kích hoạt load lại data ở component cha sau khi Thêm/Sửa/Xóa thành công
const emit = defineEmits(['refresh-data'])

const isUserModalOpen = ref(false)
const isUserEditMode = ref(false)
const isSubmitting = ref(false)
const currentUserId = ref(null)
const userForm = ref({ full_name: '', email: '', password: '', role: 'user' })

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'Chưa rõ'
  const d = new Date(dateStr)
  return d.toLocaleDateString('vi-VN')
}

const openUserModal = (user = null) => {
  if (user) {
    isUserEditMode.value = true
    currentUserId.value = user.id
    userForm.value = { 
      full_name: user.full_name || user.fullName,
      email: user.email,
      role: user.role,
      password: '' 
    }
  } else {
    isUserEditMode.value = false
    currentUserId.value = null
    userForm.value = { full_name: '', email: '', password: '', role: 'user' }
  }
  isUserModalOpen.value = true
}

const handleSubmitUser = async () => {
  isSubmitting.value = true
  
  const url = isUserEditMode.value 
    ? `http://localhost:3000/api/auth/users/${currentUserId.value}`
    : 'http://localhost:3000/api/auth/users'
  
  const method = isUserEditMode.value ? 'PUT' : 'POST'
  const payload = {
    full_name: userForm.value.full_name,
    email: userForm.value.email,
    role: userForm.value.role
  }

  if (!isUserEditMode.value || userForm.value.password.trim() !== '') {
    payload.password = userForm.value.password
  }

  try {
    const response = await fetch(url, {
      method: method,
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    })
    const data = await response.json()
    if (data.success) {
      alert(data.message)
      isUserModalOpen.value = false
      emit('refresh-data') 
    } else {
      alert(data.message)
    }
  } catch (error) {
    console.error('Lỗi khi lưu người dùng:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleDeleteUser = async (id) => {
  if (!id) return alert('Không tìm thấy ID người dùng!')
  if (!confirm('Bạn có chắc muốn xóa tài khoản này khỏi hệ thống?')) return
  try {
    const response = await fetch(`http://localhost:3000/api/auth/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    const data = await response.json()
    if (data.success) {
      alert(data.message)
      emit('refresh-data')
    } else {
      alert(data.message)
    }
  } catch (error) {
    console.error('Lỗi khi xóa người dùng:', error)
  }
}
</script>