<template>
  <section
    class="relative w-full overflow-hidden rounded-xl hero-root"
    :style="sectionStyle"
  >
    <div
      class="absolute inset-0 bg-center bg-cover"
      :style="{ backgroundImage: `url('${bg}')` }"
      role="img"
      :aria-label="alt || title"
    />

    <div class="absolute inset-0" :style="{ backgroundColor: `rgba(0,0,0,${overlay})` }" />
    <div
      v-if="gradient"
      class="absolute inset-0"
      :class="[
        'bg-gradient-to-r',
        gradient === 'left'  ? 'from-black/45 via-black/25 to-transparent' : '',
        gradient === 'right' ? 'from-transparent via-black/25 to-black/45' : '',
      ]"
    />

    <div class="relative h-full">
      <div class="h-full container mx-auto px-4 sm:px-6 md:px-8">
        <div class="h-full flex items-center">
          <div class="text-white max-w-2xl">
            <h1
              class="font-bold leading-tight tracking-tight drop-shadow-lg animate-fade-in"
              :class="titleClass"
              v-html="title"
            />
            <div class="mt-8 animate-fade-in-delayed">
              <button
                class="inline-flex items-center justify-center rounded-full
                       bg-rose-500 hover:bg-rose-600 active:bg-rose-700
                       transition-all duration-300 shadow-lg hover:shadow-rose-500/50
                       font-semibold text-white
                       hover:scale-105 active:scale-95
                       focus:outline-none focus:ring-4 focus:ring-rose-400/50"
                :style="{ width: `${btnW}px`, height: `${btnH}px` }"
                @click="$emit('cta')"
              >
                {{ btnText }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  bg:        { type: String, required: true },

  height:    { type: [Number, String], default: null },

 
  h:         { type: [Number, String], default: null },   
  hSm:       { type: [Number, String], default: null },   
  hMd:       { type: [Number, String], default: null },   
  hLg:       { type: [Number, String], default: null },   

  aspect:    { type: String, default: '3.2 / 1' },
  minH:      { type: [Number, String], default: 260 },    

  overlay:   { type: Number, default: 0.35 },
  gradient:  { type: [String, Boolean], default: 'left' },
  title:     { type: String, default: 'Bộ Sưu Tập Mô Hình<br class="hidden sm:block" />Anime Độc Đáo' },
  titleSize: { type: String, default: 'md' },
  btnText:   { type: String, default: 'Khám phá ngay' },
  btnW:      { type: Number, default: 183 },
  btnH:      { type: Number, default: 48 },
  alt:       { type: String, default: '' },
})

const sectionStyle = computed(() => {
  if (props.h || props.hSm || props.hMd || props.hLg) {
    const toPx = v => (v == null ? null : (typeof v === 'number' ? `${v}px` : String(v)))
    return {
      '--h':    toPx(props.h)   || toPx(props.height) || null,
      '--h-sm': toPx(props.hSm) || null,
      '--h-md': toPx(props.hMd) || null,
      '--h-lg': toPx(props.hLg) || null,
    }
  }

  if (props.height) {
    return {
      height: typeof props.height === 'number' ? `${props.height}px` : String(props.height),
    }
  }

  return {
    aspectRatio: props.aspect,
    minHeight: typeof props.minH === 'number' ? `${props.minH}px` : String(props.minH),
  }
})

const titleClass = computed(() => {
  switch (props.titleSize) {
    case 'sm': return 'text-2xl sm:text-3xl md:text-4xl'
    case 'lg': return 'text-4xl sm:text-5xl md:text-6xl'
    default:   return 'text-3xl sm:text-4xl md:text-5xl'
  }
})

defineEmits(['cta'])
</script>

<style scoped>
.hero-root { height: var(--h); }
@media (min-width: 640px) { .hero-root { height: var(--h-sm, var(--h)); } }
@media (min-width: 768px) { .hero-root { height: var(--h-md, var(--h-sm, var(--h))); } }
@media (min-width: 1024px){ .hero-root { height: var(--h-lg, var(--h-md, var(--h-sm, var(--h)))); } }

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDelayed {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}

.animate-fade-in-delayed {
  animation: fadeInDelayed 0.8s ease-out 0.2s both;
}
</style>
