<template>
  <div class="fixed bottom-20 right-6 z-50 font-sans">
    <!-- Khung Chat -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-4 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-4 scale-95"
    >
      <div 
        v-if="isOpen" 
        class="flex flex-col w-80 sm:w-96 h-[460px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden mb-4"
      >
        <!-- Header -->
        <div class="bg-gradient-to-r from-rose-500 to-red-500 p-4 text-white flex items-center justify-between shadow-sm">
          <div class="flex items-center space-x-3">
            <div class="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
              CS
            </div>
            <div>
              <h3 class="font-semibold text-sm leading-tight">Hỗ trợ khách hàng</h3>
              <p class="text-[11px] text-rose-100">Trực tuyến</p>
            </div>
          </div>
          <button @click="toggleChat" class="text-white/80 hover:text-white p-1 focus:outline-none">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Body / Messages List -->
        <div ref="chatBoxRef" class="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
          <div 
            v-for="msg in messages" 
            :key="msg.id" 
            class="flex flex-col"
            :class="msg.sender === 'user' ? 'items-end' : 'items-start'"
          >
            <div 
              class="max-w-[80%] px-3.5 py-2 rounded-2xl text-sm shadow-xs break-words"
              :class="msg.sender === 'user' 
                ? 'bg-rose-500 text-white rounded-br-none' 
                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'"
            >
              {{ msg.text }}
            </div>
            <span class="text-[10px] text-gray-400 mt-1 px-1">{{ msg.time }}</span>
          </div>
        </div>

        <!-- Footer / Input -->
        <form @submit.prevent="sendMessage" class="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
          <input 
            v-model="newMessage"
            type="text" 
            placeholder="Nhập tin nhắn..." 
            class="flex-1 bg-gray-100 text-gray-800 text-sm px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500/50"
          />
          <button 
            type="submit" 
            :disabled="!newMessage.trim()"
            class="bg-rose-500 text-white p-2 rounded-full hover:bg-rose-600 disabled:opacity-40 transition-colors"
          >
            <svg class="w-4 h-4 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
            </svg>
          </button>
        </form>
      </div>
    </Transition>

    <!-- Toggle Button -->
    <div class="flex justify-end">
      <button 
        @click="toggleChat" 
        class="bg-gradient-to-r from-rose-500 to-red-500 text-white p-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
      >
        <svg v-if="!isOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { io } from 'socket.io-client'

const isOpen = ref(false)
const newMessage = ref('')
const chatBoxRef = ref(null)
const messages = ref([])

// Hàm lấy thời gian thực dạng AM/PM
const getCurrentTime = () => {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
}

// 🟢 Hàm lấy tên user từ localStorage (nếu khách đã đăng nhập)
const getUserName = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return user.name || user.fullName || user.username || 'Khách vãng lai'
  } catch (e) {
    return 'Khách vãng lai'
  }
}

let socket = null

onMounted(() => {
  socket = io('http://localhost:3000')

  // Lắng nghe tin nhắn phản hồi từ Server
  socket.on('receive_message', (msg) => {
    messages.value.push(msg)
    scrollToBottom()
  })
})

onUnmounted(() => {
  if (socket) socket.disconnect()
})

const toggleChat = () => {
  isOpen.value = !isOpen.value

  if (isOpen.value) {
    // Nếu mở chat và chưa có tin nhắn, tạo tin nhắn chào mừng thời gian thực
    if (messages.value.length === 0) {
      messages.value.push({
        id: Date.now(),
        text: 'Xin chào! Bạn cần hỗ trợ gì ạ?',
        sender: 'bot',
        time: getCurrentTime()
      })
    }
    scrollToBottom()
  }
}

const sendMessage = () => {
  const text = newMessage.value.trim()
  if (!text) return

  // 🟢 Gửi tin nhắn kèm tên thực (userName) và thời gian thực
  socket.emit('send_message', {
    text: text,
    sender: 'user',
    userName: getUserName(),
    time: getCurrentTime()
  })

  newMessage.value = ''
}

const scrollToBottom = async () => {
  await nextTick()
  if (chatBoxRef.value) {
    chatBoxRef.value.scrollTop = chatBoxRef.value.scrollHeight
  }
}
</script>