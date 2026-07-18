<template>
  <section
    class="w-full bg-white"
    :style="{ padding: '48px 32px' }"
  >
    <!-- Tiêu đề -->
    <div class="mx-auto mb-8" :style="{ maxWidth: '1376px' }">
      <h2 class="text-3xl font-bold text-gray-900 text-center">
        <span class="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
          CÁC ANIME NỔI TIẾNG
        </span>
      </h2>
    </div>

    <!-- Logo Container -->
    <div
      class="mx-auto flex justify-center items-center"
      :style="{ width: '1376px', maxWidth: '100%' }"
    >
      <div class="grid gap-8 w-full place-items-center" :class="gridClass">
        <button
          v-for="(it, i) in items"
          :key="i"
          class="group inline-flex flex-col items-center justify-center select-none transition-all duration-300 hover:scale-105"
          :style="{ 
            width: '160px', 
            height: '160px',
            perspective: '1000px'
          }"
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
              class="absolute inset-0 rounded-2xl bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              :style="{ padding: '2px', margin: '-2px' }"
            ></div>

            <!-- Content -->
            <div class="relative w-full h-full flex flex-col items-center justify-center bg-white dark:bg-gray-900 rounded-xl m-0.5">
              <!-- Icon/Image Container -->
              <div 
                class="flex items-center justify-center mb-3 relative"
                :style="{ width: '80px', height: '80px' }"
              >
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
                  class="relative w-12 h-12 text-rose-500 group-hover:text-pink-600 transition-colors"
                />
              </div>

              <!-- Label -->
              <span class="text-center text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors px-2">
                {{ it.label }}
              </span>
            </div>
          </div>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const gridClass = 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'

const items = [
  { label: 'Naruto',          icon: '/images/naruto.jpg' },
  { label: 'One Piece',       icon: '/images/onepiece.jpg' },
  { label: 'Dragon Ball',     icon: '/images/dragonball.jpg' },
  { label: 'Demon Slayer',    icon: '/images/demonslayer.jpg' },
  { label: 'Attack on Titan', icon: '/images/aot.jpg' },
  { label: 'Xem tất cả' } 
]
</script>
