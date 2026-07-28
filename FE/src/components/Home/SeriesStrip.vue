<template>
  <div class="w-full bg-slate-50 dark:bg-gray-950 min-h-screen py-10 px-4 transition-colors space-y-14">
    
    <!-- ================= 1. DANH MỤC ANIME (GIỮ NGUYÊN CODE CỦA BẠN) ================= -->
    <section class="w-full bg-white dark:bg-gray-900 py-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
      <!-- Tiêu đề -->
      <div class="mx-auto mb-8 max-w-[1376px]">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white text-center">
          <span class="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
            CÁC ANIME NỔI TIẾNG
          </span>
        </h2>
      </div>

      <!-- Logo Container -->
      <div class="mx-auto flex justify-center items-center max-w-[1376px] px-4">
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 w-full place-items-center">
          <button
            v-for="(it, i) in items"
            :key="i"
            class="group inline-flex flex-col items-center justify-center select-none transition-all duration-300 hover:scale-105 w-40 h-40"
            style="perspective: 1000px;"
          >
            <!-- Card Container -->
            <div 
              class="relative w-full h-full rounded-2xl overflow-hidden transition-all duration-300 group-hover:shadow-2xl"
              :class="{
                'bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg': it.label !== 'Xem tất cả',
                'bg-gradient-to-br from-rose-50 to-pink-50 shadow-lg': it.label === 'Xem tất cả'
              }"
            >
              <!-- Gradient Border Effect -->
              <div 
                v-if="it.label !== 'Xem tất cả'"
                class="absolute inset-0 rounded-2xl bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -m-[2px] p-[2px]"
              ></div>

              <!-- Content -->
              <div class="relative w-full h-full flex flex-col items-center justify-center bg-white dark:bg-gray-900 rounded-xl">
                <!-- Icon/Image Container -->
                <div class="flex items-center justify-center mb-3 relative w-20 h-20">
                  <!-- Glow Background -->
                  <div 
                    v-if="it.label !== 'Xem tất cả'"
                    class="absolute inset-0 bg-gradient-to-r from-rose-200 to-pink-200 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity"
                  ></div>

                  <!-- Image/Icon -->
                  <img
                    v-if="typeof it.icon === 'string'"
                    :src="it.icon"
                    :alt="it.label"
                    class="relative w-16 h-16 object-contain drop-shadow-md group-hover:drop-shadow-lg transition-all"
                  />
                  <FontAwesomeIcon
                    v-else-if="it.label === 'Xem tất cả'"
                    :icon="['fas', 'bars']"
                    class="relative w-10 h-10 text-rose-500 group-hover:text-pink-600 transition-colors"
                  />
                </div>

                <!-- Label -->
                <span class="text-center text-sm font-semibold text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors px-2">
                  {{ it.label }}
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </section>

    <!-- ================= 2. LỊCH CHIẾU PHIM THEO THỨ (NEW) ================= -->
    <section class="max-w-[1376px] mx-auto">
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
            class="px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap"
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
          class="flex items-center gap-4 p-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-rose-300 transition-all cursor-pointer group"
        >
          <img :src="anime.image" :alt="anime.title" class="w-16 h-20 object-cover rounded-xl shadow-sm" />
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

    <!-- ================= 3. BẢNG XẾP HẠNG NHÂN VẬT HOT (NEW) ================= -->
    <section class="max-w-[1376px] mx-auto">
      <div class="mb-6">
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span>🔥</span> Bảng Xếp Hạng Nhân Vật Tuần này
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">Những nhân vật Anime được bình chọn nhiều nhất</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          v-for="(char, index) in topCharacters" 
          :key="char.id"
          class="relative bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-4 hover:shadow-xl transition-all"
        >
          <!-- Huy hiệu Top -->
          <div 
            class="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center font-black text-xs text-white shadow-md"
            :class="[
              index === 0 ? 'bg-amber-400' : index === 1 ? 'bg-slate-300 text-slate-800' : 'bg-amber-700'
            ]"
          >
            #{{ index + 1 }}
          </div>

          <img :src="char.avatar" :alt="char.name" class="w-16 h-16 rounded-full object-cover ring-2 ring-rose-500/20" />
          
          <div class="flex-1">
            <h4 class="font-bold text-gray-900 dark:text-white text-base">{{ char.name }}</h4>
            <p class="text-xs text-rose-500 font-medium">{{ char.anime }}</p>
            <div class="mt-2 text-[11px] text-gray-400 flex items-center justify-between">
              <span>❤️ {{ char.votes }} phiếu</span>
              <button class="text-rose-500 hover:underline font-bold">Bình chọn</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= 4. BẢN TIN ANIME ================= -->
    <section class="max-w-[1376px] mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span>📰</span> Tin Tức Anime Hot
        </h3>
        <a href="#" class="text-xs font-bold text-rose-500 hover:underline">Xem tất cả →</a>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <article 
          v-for="news in newsList" 
          :key="news.id"
          class="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all group cursor-pointer"
        >
          <div class="h-44 overflow-hidden relative">
            <img :src="news.image" :alt="news.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <span class="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
              {{ news.category }}
            </span>
          </div>
          <div class="p-4">
            <span class="text-[11px] text-gray-400">{{ news.date }}</span>
            <h4 class="font-bold text-gray-800 dark:text-gray-100 text-sm mt-1 line-clamp-2 group-hover:text-rose-500 transition-colors">
              {{ news.title }}
            </h4>
          </div>
        </article>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// 1. Data Anime Categories
const items = [
  { label: 'Naruto', icon: '/images/naruto.jpg' },
  { label: 'One Piece', icon: '/images/onepiece.jpg' },
  { label: 'Dragon Ball', icon: '/images/dragonball.jpg' },
  { label: 'Demon Slayer', icon: '/images/demonslayer.jpg' },
  { label: 'Attack on Titan', icon: '/images/aot.jpg' },
  { label: 'Xem tất cả' }
]

// 2. Data Lịch chiếu Anime
const weekDays = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật']
const activeDay = ref('Thứ 2')

const scheduleData = {
  'Thứ 2': [
    { id: 1, title: 'One Piece', episode: '1115', time: '21:30', image: '/images/onepiece.jpg' },
    { id: 2, title: 'Tower of God S2', episode: '04', time: '22:00', image: '/images/aot.jpg' },
  ],
  'Thứ 3': [
    { id: 3, title: 'Bleach: TYBW', episode: '28', time: '23:00', image: '/images/demonslayer.jpg' }
  ],
  'Thứ 4': [
    { id: 4, title: 'Dragon Ball DAIMA', episode: '02', time: '20:00', image: '/images/dragonball.jpg' }
  ],
  // Mặc định hiển thị nếu chọn các thứ khác
  'default': [
    { id: 5, title: 'Demon Slayer: Hashira Training', episode: '08', time: '22:30', image: '/images/demonslayer.jpg' },
    { id: 6, title: 'Naruto Shippuden (Re-run)', episode: '500', time: '19:00', image: '/images/naruto.jpg' }
  ]
}

const currentSchedule = computed(() => {
  return scheduleData[activeDay.value] || scheduleData['default']
})

// 3. Data Nhân vật Hot
const topCharacters = [
  { id: 1, name: 'Monkey D. Luffy', anime: 'One Piece', votes: '12,450', avatar: '/images/onepiece.jpg' },
  { id: 2, name: 'Goku', anime: 'Dragon Ball', votes: '10,210', avatar: '/images/dragonball.jpg' },
  { id: 3, name: 'Levi Ackerman', anime: 'Attack on Titan', votes: '9,840', avatar: '/images/aot.jpg' }
]

// 4. Data Tin tức
const newsList = [
  {
    id: 1,
    title: 'Movie Demon Slayer Vô Hạn Thành công bố trilogy chiếu rạp toàn cầu',
    category: 'Sự kiện',
    date: 'Hôm nay',
    image: '/images/demonslayer.jpg'
  },
  {
    id: 2,
    title: 'Tác giả One Piece lên tiếng về bí mật kho báu cuối cùng',
    category: 'Phỏng vấn',
    date: 'Hôm qua',
    image: '/images/onepiece.jpg'
  },
  {
    id: 3,
    title: 'Top 10 phim Anime mùa Thu hứa hẹn bùng nổ doanh thu',
    category: 'Tổng hợp',
    date: '3 ngày trước',
    image: '/images/aot.jpg'
  }
]
</script>