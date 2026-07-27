<template>
  <div>
    <!-- Render các trang theo router -->
    <router-view />

    <!-- Chat Popup hỗ trợ khách hàng hiển thị ở mọi trang -->
    <CustomerChat />
  </div>
</template>

<script setup>
// 🟢 Import component CustomerChat
import CustomerChat from './components/Home/CustomerChat.vue'
</script>