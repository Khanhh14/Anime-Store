<template>
  <div class="anime-page flex flex-col min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors">
    <!-- Header (Dùng chung toàn trang) -->
    <Header />

    <!-- Main Content -->
    <main class="flex-1 py-10 px-4 space-y-14 max-w-[1376px] mx-auto w-full">
      
      <!-- ================= 1. DANH MỤC ANIME NỔI TIẾNG ================= -->
      <section class="w-full bg-white dark:bg-gray-900 py-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
        <!-- Tiêu đề -->
        <div class="mx-auto mb-8 text-center">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
            <span class="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              CÁC ANIME NỔI TIẾNG
            </span>
          </h2>
        </div>

        <!-- Logo Container -->
        <div class="flex justify-center items-center px-4">
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 w-full place-items-center">
            
            <router-link
              v-for="(it, i) in items"
              :key="i"
              :to="it.slug ? `/anime/${it.slug}` : '/collections'"
              class="group inline-flex flex-col items-center justify-center select-none transition-all duration-300 hover:scale-105 w-40 h-40 cursor-pointer"
              style="perspective: 1000px;"
            >
              <!-- Card Container -->
              <div 
                class="relative w-full h-full rounded-2xl overflow-hidden transition-all duration-300 group-hover:shadow-2xl"
                :class="{
                  'bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg': it.label !== 'Xem tất cả',
                  'bg-gradient-to-br from-rose-500 to-pink-500 shadow-lg': it.label === 'Xem tất cả'
                }"
              >
                <!-- Gradient Border Effect -->
                <div 
                  v-if="it.label !== 'Xem tất cả'"
                  class="absolute inset-0 rounded-2xl bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -m-[2px] p-[2px]"
                ></div>

                <!-- Content -->
                <div 
                  class="relative w-full h-full flex flex-col items-center justify-center rounded-xl"
                  :class="it.label === 'Xem tất cả' ? 'bg-transparent text-white' : 'bg-white dark:bg-gray-900'"
                >
                  <div class="flex items-center justify-center mb-3 relative w-20 h-20">
                    <div 
                      v-if="it.label !== 'Xem tất cả'"
                      class="absolute inset-0 bg-gradient-to-r from-rose-200 to-pink-200 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity"
                    ></div>

                    <img
                      v-if="typeof it.icon === 'string'"
                      :src="it.icon"
                      :alt="it.label"
                      class="relative w-16 h-16 object-contain drop-shadow-md group-hover:drop-shadow-lg transition-all"
                    />
                    <FontAwesomeIcon
                      v-else-if="it.label === 'Xem tất cả'"
                      :icon="['fas', 'bars']"
                      class="relative w-10 h-10 text-white transition-colors"
                    />
                  </div>

                  <span 
                    class="text-center text-sm font-semibold transition-colors px-2"
                    :class="it.label === 'Xem tất cả' ? 'text-white' : 'text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white'"
                  >
                    {{ it.label }}
                  </span>
                </div>
              </div>
            </router-link>

          </div>
        </div>
      </section>

      <!-- ================= 2. LỊCH CHIẾU ANIME ================= -->
      <section class="w-full">
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span>📅</span> Lịch Chiếu Anime Mới
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Cập nhật tập mới nhất theo các ngày trong tuần</p>
          </div>

          <!-- Tab chọn ngày -->
          <div class="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <button
              v-for="day in weekDays"
              :key="day"
              @click="activeDay = day"
              class="px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer"
              :class="[
                activeDay === day 
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' 
                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              ]"
            >
              {{ day }}
            </button>
          </div>
        </div>

        <!-- Danh sách phim chiếu trong ngày -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            v-for="anime in currentSchedule" 
            :key="anime.id"
            @click="goToAnimeDetail(anime.slug)"
            class="flex items-center gap-4 p-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-rose-300 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <img :src="anime.image" :alt="anime.title" class="w-16 h-20 object-cover rounded-xl shadow-sm group-hover:scale-105 transition-transform" />
            <div class="flex-1 min-w-0">
              <span class="inline-block px-2 py-0.5 bg-rose-50 dark:bg-rose-950 text-rose-500 text-[10px] font-bold rounded-md mb-1">
                {{ anime.time }}
              </span>
              <h4 class="text-sm font-bold text-gray-800 dark:text-gray-200 truncate group-hover:text-rose-500 transition-colors">
                {{ anime.title }}
              </h4>
              <p class="text-xs text-gray-400 mt-1">Tập {{ anime.episode }}</p>
            </div>
          </div>
        </div>
      </section>

    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Header from '@/components/Home/Header.vue'
import Footer from '@/components/Home/Footer.vue'

const router = useRouter()

// 1. Khai báo Anime & Slug
const items = [
  { label: 'Naruto', icon: '/images/naruto.jpg', slug: 'naruto' },
  { label: 'One Piece', icon: '/images/onepiece.jpg', slug: 'one-piece' },
  { label: 'Dragon Ball', icon: '/images/dragonball.jpg', slug: 'dragon-ball' },
  { label: 'Demon Slayer', icon: '/images/demonslayer.jpg', slug: 'demon-slayer' },
  { label: 'Attack on Titan', icon: '/images/aot.jpg', slug: 'attack-on-titan' },
  { label: 'Xem tất cả', slug: '' }
]

// 2. Lịch chiếu Anime
const weekDays = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật']
const activeDay = ref('Thứ 7')

const scheduleData = {
  'Thứ 7': [
    { id: 1, title: 'Demon Slayer: Hashira Training', episode: '08', time: '22:30', image: '/images/demonslayer.jpg', slug: 'demon-slayer' },
    { id: 2, title: 'Naruto Shippuden (Re-run)', episode: '500', time: '19:00', image: '/images/naruto.jpg', slug: 'naruto' }
  ],
  'Chủ Nhật': [
    { id: 3, title: 'One Piece', episode: '1115', time: '09:30', image: '/images/onepiece.jpg', slug: 'one-piece' }
  ]
}

const currentSchedule = computed(() => {
  return scheduleData[activeDay.value] || scheduleData['Thứ 7']
})

const goToAnimeDetail = (slug) => {
  if (slug) {
    router.push(`/anime/${slug}`)
  } else {
    router.push('/collections')
  }
}
</script>