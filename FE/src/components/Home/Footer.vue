<template>
  <footer class="w-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 border-t border-gray-200 dark:border-gray-800 mt-20">
    <div class="mx-auto px-4 sm:px-6 md:px-8 py-16" :style="{ maxWidth: '1376px' }">
      <!-- Main Footer Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <!-- Brand Section -->
        <div class="space-y-4">
          <div class="flex items-center space-x-2">
            <span class="text-2xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              ANIME
            </span>
            <span class="text-sm font-semibold text-gray-600 dark:text-gray-400">Store</span>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Cửa hàng mô hình anime hàng đầu với bộ sưu tập đa dạng từ các bộ anime nổi tiếng nhất thế giới.
          </p>
          <!-- Social Links -->
          <div class="flex items-center space-x-4 pt-4">
            <a
              href="#"
              class="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gradient-to-br hover:from-rose-500 hover:to-pink-500 hover:text-white transition-all duration-300 hover:shadow-md hover:shadow-rose-500/20"
              aria-label="Facebook"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="#"
              class="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gradient-to-br hover:from-rose-500 hover:to-pink-500 hover:text-white transition-all duration-300 hover:shadow-md hover:shadow-rose-500/20"
              aria-label="Instagram"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.117.6c-.79.263-1.459.597-2.126 1.272-.673.667-1.005 1.35-1.27 2.126-.266.786-.47 1.656-.53 2.93C.06 8.333.05 8.74 0 12c0 3.26.015 3.667.072 4.947.06 1.277.261 2.148.528 2.934.263.79.597 1.457 1.272 2.123.671.673 1.35 1.007 2.126 1.272.787.266 1.656.47 2.93.529C8.333 23.94 8.74 23.95 12 23.95c3.26 0 3.667-.015 4.947-.072 1.277-.06 2.148-.261 2.934-.528.79-.263 1.457-.597 2.123-1.272.673-.671 1.007-1.35 1.272-2.126.266-.787.47-1.656.529-2.93.059-1.28.07-1.687.07-4.947 0-3.26-.015-3.667-.072-4.947-.06-1.277-.261-2.148-.528-2.934-.263-.79-.597-1.459-1.272-2.126C21.94 1.91 21.263 1.575 20.377 1.31c-.784-.266-1.649-.47-2.926-.529C15.667.06 15.26.05 12 .05Z" />
              </svg>
            </a>
            <a
              href="#"
              class="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gradient-to-br hover:from-rose-500 hover:to-pink-500 hover:text-white transition-all duration-300 hover:shadow-md hover:shadow-rose-500/20"
              aria-label="Twitter"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 002.856-3.498A9.86 9.86 0 0116.78 1.95a4.82 4.82 0 00-8.237 4.32c-4.069-.4-7.639-2.342-10.04-5.574a4.823 4.823 0 001.493 6.437A4.804 4.804 0 012.8 9.713v.07a4.823 4.823 0 003.866 4.724 4.82 4.82 0 01-2.178.082 4.823 4.823 0 004.512 3.336A9.67 9.67 0 011.671 21.543a13.064 13.064 0 008.946 2.605c10.734 0 16.586-8.887 16.586-16.588 0-.253-.009-.504-.025-.75a11.8 11.8 0 002.921-3.04z" />
              </svg>
            </a>
            <a
              href="#"
              class="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gradient-to-br hover:from-rose-500 hover:to-pink-500 hover:text-white transition-all duration-300 hover:shadow-md hover:shadow-rose-500/20"
              aria-label="YouTube"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="space-y-4">
          <h3 class="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <span class="w-1 h-6 bg-gradient-to-b from-rose-500 to-pink-500 rounded"></span>
            <span>Liên kết nhanh</span>
          </h3>
          <ul class="space-y-3">
            <li>
              <router-link
                to="/"
                class="text-sm text-gray-600 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors duration-300 flex items-center space-x-2 group"
              >
                <svg class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="currentColor" viewBox="0 0 6 6">
                  <circle cx="3" cy="3" r="3" />
                </svg>
                <span>Trang chủ</span>
              </router-link>
            </li>
            <li>
              <router-link
                to="/collections"
                class="text-sm text-gray-600 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors duration-300 flex items-center space-x-2 group"
              >
                <svg class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="currentColor" viewBox="0 0 6 6">
                  <circle cx="3" cy="3" r="3" />
                </svg>
                <span>Bộ sưu tập</span>
              </router-link>
            </li>
            <li>
              <a
                href="#"
                @click.prevent="handleAnimeNew"
                class="text-sm text-gray-600 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors duration-300 flex items-center space-x-2 group"
              >
                <svg class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="currentColor" viewBox="0 0 6 6">
                  <circle cx="3" cy="3" r="3" />
                </svg>
                <span>Anime mới</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                @click.prevent="handleTopSelling"
                class="text-sm text-gray-600 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors duration-300 flex items-center space-x-2 group"
              >
                <svg class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="currentColor" viewBox="0 0 6 6">
                  <circle cx="3" cy="3" r="3" />
                </svg>
                <span>Top bán chạy</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                @click.prevent="handlePromotions"
                class="text-sm text-gray-600 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors duration-300 flex items-center space-x-2 group"
              >
                <svg class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="currentColor" viewBox="0 0 6 6">
                  <circle cx="3" cy="3" r="3" />
                </svg>
                <span>Khuyến mãi</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Customer Service -->
        <div class="space-y-4">
          <h3 class="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <span class="w-1 h-6 bg-gradient-to-b from-rose-500 to-pink-500 rounded"></span>
            <span>Hỗ trợ khách hàng</span>
          </h3>
          <ul class="space-y-3">
            <li>
              <a
                href="#"
                class="text-sm text-gray-600 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors duration-300 flex items-center space-x-2 group"
              >
                <svg class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="currentColor" viewBox="0 0 6 6">
                  <circle cx="3" cy="3" r="3" />
                </svg>
                <span>Liên hệ chúng tôi</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                class="text-sm text-gray-600 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors duration-300 flex items-center space-x-2 group"
              >
                <svg class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="currentColor" viewBox="0 0 6 6">
                  <circle cx="3" cy="3" r="3" />
                </svg>
                <span>Câu hỏi thường gặp</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                class="text-sm text-gray-600 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors duration-300 flex items-center space-x-2 group"
              >
                <svg class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="currentColor" viewBox="0 0 6 6">
                  <circle cx="3" cy="3" r="3" />
                </svg>
                <span>Chính sách trả hàng</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                class="text-sm text-gray-600 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors duration-300 flex items-center space-x-2 group"
              >
                <svg class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="currentColor" viewBox="0 0 6 6">
                  <circle cx="3" cy="3" r="3" />
                </svg>
                <span>Theo dõi đơn hàng</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                class="text-sm text-gray-600 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors duration-300 flex items-center space-x-2 group"
              >
                <svg class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="currentColor" viewBox="0 0 6 6">
                  <circle cx="3" cy="3" r="3" />
                </svg>
                <span>Bảo hành sản phẩm</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Newsletter & Contact -->
        <div class="space-y-4">
          <h3 class="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <span class="w-1 h-6 bg-gradient-to-b from-rose-500 to-pink-500 rounded"></span>
            <span>Nhận tin tức</span>
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Đăng ký nhận thông tin về sản phẩm mới, khuyến mãi và sự kiện đặc biệt từ ANIME Store.
          </p>
          <form @submit.prevent="handleNewsletterSubmit" class="space-y-3">
            <div class="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 focus-within:border-rose-500 focus-within:ring-1 focus-within:ring-rose-500 transition-all duration-300">
              <input
                v-model="newsletterEmail"
                type="email"
                placeholder="Email của bạn"
                class="flex-1 px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
                required
              />
              <button
                type="submit"
                class="px-4 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold text-sm transition-all duration-300"
              >
                Đăng ký
              </button>
            </div>
          </form>

          <div class="space-y-3 pt-4">
            <div class="flex items-start space-x-3">
              <svg class="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
              <span class="text-sm text-gray-600 dark:text-gray-400">123 Đường ABC, TP.HCM, Việt Nam</span>
            </div>
            <div class="flex items-start space-x-3">
              <svg class="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773c.418 1.265 1.215 2.807 2.453 4.045 1.238 1.238 2.78 2.035 4.045 2.453l.773-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a2 2 0 01-2 2H7a6 6 0 01-6-6V5a2 2 0 012-2z" />
              </svg>
              <span class="text-sm text-gray-600 dark:text-gray-400">+84 (0)123 456 789</span>
            </div>
            <div class="flex items-start space-x-3">
              <svg class="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span class="text-sm text-gray-600 dark:text-gray-400">support@animestore.com</span>
            </div>
          </div>
        </div>
      </div>
      <button
        @click="scrollToTop"
        class="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg hover:shadow-rose-500/50 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center z-40"
        :class="{ 'opacity-0 pointer-events-none': !showScrollButton }"
        aria-label="Scroll to top"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m0 0l4 4m10-4v12m0 0l4-4m0 0l-4-4" />
        </svg>
      </button>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const newsletterEmail = ref('')
const showScrollButton = ref(false)

const handleNewsletterSubmit = () => {
  if (newsletterEmail.value) {
    console.log('Newsletter subscription:', newsletterEmail.value)
    // Gửi request đến API
    newsletterEmail.value = ''
  }
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleScroll = () => {
  showScrollButton.value = window.scrollY > 300
}

const handleContact = () => {
  console.log('Contact clicked')
}

const handleAnimeNew = () => {
  console.log('Anime mới clicked')
  // Có thể navigate hoặc filter sản phẩm mới
}

const handleTopSelling = () => {
  console.log('Top bán chạy clicked')
  // Có thể navigate hoặc filter sản phẩm bán chạy
}

const handlePromotions = () => {
  console.log('Khuyến mãi clicked')
  // Có thể navigate hoặc filter sản phẩm khuyến mãi
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
footer {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

button {
  transition: all 0.3s ease-out;
}
</style>