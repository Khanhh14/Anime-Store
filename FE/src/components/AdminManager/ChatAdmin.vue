<template>
  <div class="h-[calc(100vh-5rem)] border border-slate-800 rounded-2xl bg-slate-950 shadow-2xl flex overflow-hidden">
    
    <!-- CỘT TRÁI: DANH SÁCH KHÁCH HÀNG -->
    <div class="w-80 border-r border-slate-800 flex flex-col bg-slate-950/50">
      <div class="p-4 border-b border-slate-800 flex items-center justify-between">
        <h2 class="font-bold text-slate-200 flex items-center gap-2">
          <span>💬</span> Khách hàng
        </h2>
        <span class="bg-rose-500/20 text-rose-400 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-rose-500/30">
          {{ userList.length }} online
        </span>
      </div>

      <div class="flex-1 overflow-y-auto">
        <div 
          v-for="user in userList" 
          :key="user.id"
          @click="selectUser(user.id)"
          :class="[
            'p-4 border-b border-slate-800/50 cursor-pointer transition duration-150',
            selectedUserId === user.id 
              ? 'bg-gradient-to-r from-rose-500/10 to-pink-500/10 border-l-4 border-l-rose-500' 
              : 'hover:bg-slate-900/60'
          ]"
        >
          <div class="flex justify-between items-start mb-1">
            <!-- 🟢 HIỂN THỊ TÊN NGƯỜI DÙNG CHUẨN -->
            <span class="font-semibold text-sm text-slate-200 truncate pr-2">
              {{ user.userName || `Khách #${user.id.slice(0, 5)}` }}
            </span>
            <span class="text-[10px] text-slate-500 shrink-0">{{ user.time }}</span>
          </div>
          <p class="text-xs text-slate-400 truncate">{{ user.lastMessage || 'Đã tham gia đoạn chat' }}</p>
        </div>

        <div v-if="userList.length === 0" class="p-8 text-center text-slate-500 text-xs">
          Chưa có khách hàng nào mở khung chat...
        </div>
      </div>
    </div>

    <!-- CỘT PHẢI: KHUNG CHAT CHI TIẾT -->
    <div class="flex-1 flex flex-col bg-slate-900/50">
      <template v-if="selectedUserId">
        <!-- Header khung chat -->
        <div class="p-4 border-b border-slate-800 bg-slate-950/80 flex justify-between items-center">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold text-xs uppercase">
              {{ selectedUser?.userName?.charAt(0) || 'U' }}
            </div>
            <div>
              <!-- 🟢 TÊN KHÁCH HÀNG Ở HEADER -->
              <h3 class="font-bold text-sm text-slate-200">
                {{ selectedUser?.userName || `Khách #${selectedUserId.slice(0, 5)}` }}
              </h3>
              <p class="text-[11px] text-emerald-400 flex items-center gap-1">
                <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Trực tuyến
              </p>
            </div>
          </div>
        </div>

        <!-- Danh sách tin nhắn -->
        <div ref="chatBoxRef" class="flex-1 p-4 overflow-y-auto space-y-3">
          <div 
            v-for="msg in currentMessages" 
            :key="msg.id"
            class="flex flex-col"
            :class="msg.sender === 'admin' ? 'items-end' : 'items-start'"
          >
            <div 
              class="max-w-[70%] px-4 py-2.5 rounded-2xl text-sm shadow-sm break-words"
              :class="msg.sender === 'admin' 
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-br-none' 
                : 'bg-slate-800 text-slate-200 border border-slate-700/80 rounded-bl-none'"
            >
              {{ msg.text }}
            </div>
            <span class="text-[10px] text-slate-500 mt-1 px-1">{{ msg.time }}</span>
          </div>
        </div>

        <!-- Khung nhập tin nhắn -->
        <form @submit.prevent="sendAdminMessage" class="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center gap-2">
          <input 
            v-model="adminMessage"
            type="text" 
            placeholder="Nhập tin nhắn phản hồi..." 
            class="flex-1 bg-slate-900 border border-slate-700 text-slate-100 text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:border-rose-500 transition"
          />
          <button 
            type="submit" 
            :disabled="!adminMessage.trim()"
            class="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition"
          >
            Gửi
          </button>
        </form>
      </template>

      <!-- Màn hình chờ khi chưa chọn khách -->
      <div v-else class="flex-1 flex flex-col items-center justify-center text-slate-500">
        <span class="text-4xl mb-2">💬</span>
        <p class="text-sm">Chọn một khách hàng ở danh sách bên trái để bắt đầu hỗ trợ</p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { io } from 'socket.io-client'

const userList = ref([])
const selectedUserId = ref(null)
const adminMessage = ref('')
const chatBoxRef = ref(null)
const conversations = ref({})

const getCurrentTime = () => {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
}

const selectedUser = computed(() => {
  return userList.value.find(u => u.id === selectedUserId.value)
})

let socket = null

onMounted(() => {
  socket = io('http://localhost:3000')

  // Lấy danh sách khách online ngay khi mở trang Admin
  socket.emit('get_user_list')

  socket.on('update_user_list', (users) => {
    userList.value = users
  })

  // 🟢 LẮNG NGHE LỊCH SỬ CHAT TỪ BACKEND TRẢ VỀ
  socket.on('load_chat_history', (data) => {
    conversations.value[data.userId] = data.messages
    scrollToBottom()
  })

  // Lắng nghe tin nhắn mới nhận
  socket.on('receive_message', (msg) => {
    const targetId = msg.userId || selectedUserId.value
    if (targetId) {
      if (!conversations.value[targetId]) {
        conversations.value[targetId] = []
      }
      
      // Tránh trùng lặp tin nhắn nếu đã được nạp từ history
      const exists = conversations.value[targetId].some(m => m.id === msg.id)
      if (!exists) {
        conversations.value[targetId].push(msg)
      }

      scrollToBottom()
    }
  })
})

onUnmounted(() => {
  if (socket) socket.disconnect()
})

const selectUser = (userId) => {
  selectedUserId.value = userId
  if (!conversations.value[userId]) {
    conversations.value[userId] = []
  }
  // 🟢 Yêu cầu Backend gửi lịch sử tin nhắn & gia nhập room
  socket.emit('admin_join_room', userId)
  scrollToBottom()
}

const currentMessages = computed(() => {
  return selectedUserId.value ? (conversations.value[selectedUserId.value] || []) : []
})

const sendAdminMessage = () => {
  const text = adminMessage.value.trim()
  if (!text || !selectedUserId.value) return

  socket.emit('admin_send_message', {
    userId: selectedUserId.value,
    text: text,
    time: getCurrentTime()
  })

  adminMessage.value = ''
}

const scrollToBottom = async () => {
  await nextTick()
  if (chatBoxRef.value) {
    chatBoxRef.value.scrollTop = chatBoxRef.value.scrollHeight
  }
}
</script>