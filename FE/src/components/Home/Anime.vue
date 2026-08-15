<!-- src/components/Home/Anime.vue -->
<template>
  <div class="w-full min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-800 dark:text-gray-100 flex flex-col">
    
    <!-- ================= 1. HEADER CHÍNH ================= -->
    <Header />

    <!-- ================= 2. BANNER GIỚI THIỆU ================= -->
    <section class="max-w-[1376px] mx-auto px-4 pt-12 pb-6 text-center">
      <span class="text-xs uppercase font-extrabold tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 px-4 py-1.5 rounded-full inline-block mb-3 shadow-sm">
        🔥 Khám Phá Vũ Trụ Anime
      </span>
      <h1 class="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
        Các Bộ Anime & Series Mô Hình
      </h1>
      <p class="text-gray-500 dark:text-gray-400 mt-3 text-sm sm:text-base max-w-xl mx-auto">
        Tuyển tập những tác phẩm kinh điển sở hữu các dòng figure sắc nét, bản quyền và được săn đón nhiều nhất.
      </p>
    </section>

    <!-- ================= 3. 5 BỘ ANIME ================= -->
    <section class="max-w-[1376px] mx-auto px-4 py-8">
      
      <!-- Skeleton Loading -->
      <div v-if="isLoading" class="flex flex-wrap justify-center gap-4 md:gap-6">
        <div v-for="i in 5" :key="i" class="w-[calc(50%-8px)] sm:w-48 lg:w-56 aspect-square bg-gray-200 dark:bg-gray-800 rounded-3xl animate-pulse"></div>
      </div>

      <!-- Grid 5 Bộ Anime Căn Giữa Cân Bằng -->
      <div v-else class="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
        <div 
          v-for="(anime, index) in animeCategories" 
          :key="anime.id || index"
          @click="selectAnime(index)"
          :class="activeAnimeIndex === index ? 'ring-4 ring-indigo-500 shadow-2xl scale-105' : 'hover:-translate-y-2 hover:shadow-xl opacity-90 hover:opacity-100'"
          class="group relative w-[calc(50%-8px)] sm:w-48 lg:w-56 aspect-square bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 transition-all duration-300 cursor-pointer flex-shrink-0"
        >
          <!-- Ảnh Logo Anime -->
          <div class="w-full h-full p-4 flex items-center justify-center bg-gradient-to-b from-transparent via-black/5 to-black/80">
            <img 
              :src="anime.image" 
              :alt="anime.name" 
              class="max-w-[85%] max-h-[85%] object-contain group-hover:scale-110 transition-transform duration-500"
              @error="handleImageError"
            />
          </div>

          <!-- Badge Tag -->
          <div 
            v-if="anime.tag" 
            class="absolute top-3 right-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-black shadow-sm"
            :class="getTagColorClass(anime.tag)"
          >
            {{ anime.tag }}
          </div>

          <!-- Lớp phủ Tên & Số lượng sản phẩm -->
          <div class="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
            <p class="text-white font-bold text-sm sm:text-base leading-snug">{{ anime.name }}</p>
            <p class="text-white/70 text-xs mt-0.5">{{ anime.productCount }} sản phẩm</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= 4. KHUNG CHI TIẾT THÔNG TIN BỘ ANIME ĐƯỢC CHỌN ================= -->
    <section v-if="currentSelectedAnime" class="max-w-[1376px] mx-auto px-4 py-8 mb-16">
      <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
        
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <!-- Cột Trái: Thông tin tổng quan -->
          <div class="lg:col-span-7 space-y-4">
            <div class="flex items-center gap-2">
              <span class="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-lg">
                Thông tin Series
              </span>
              <span class="text-xs text-gray-400 font-medium">Tác giả: {{ currentSelectedAnime.author }}</span>
            </div>

            <h2 class="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white">
              {{ currentSelectedAnime.name }}
            </h2>

            <p class="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
              {{ currentSelectedAnime.description }}
            </p>

            <!-- Hiển thị ngẫu nhiên 3 mô hình từ CSDL -->
            <div class="pt-2">
              <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Nhân vật / Mô hình tiêu biểu:</span>
              <div class="flex flex-wrap gap-2">
                <template v-if="randomizedCharacters.length > 0">
                  <span 
                    v-for="character in randomizedCharacters" 
                    :key="character"
                    class="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 transition-all duration-300"
                  >
                    ⚡ {{ character }}
                  </span>
                </template>
                <span v-else class="text-xs text-gray-400 italic">Đang cập nhật mô hình...</span>
              </div>
            </div>

            <!-- Nút chuyển tới bộ sưu tập của Anime này -->
            <div class="pt-4 flex flex-wrap gap-3">
              <button 
                @click="goToCategory(currentSelectedAnime.id)"
                class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-bold rounded-2xl shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                Xem {{ currentSelectedAnime.productCount }} Mô Hình {{ currentSelectedAnime.name }} &rarr;
              </button>
            </div>
          </div>

          <!-- Cột Phải: Preview Banner nghệ thuật -->
          <div class="lg:col-span-5 relative aspect-[16/10] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-inner">
            <img 
              :src="currentSelectedAnime.image" 
              :alt="currentSelectedAnime.name" 
              class="w-full h-full object-contain p-6 hover:scale-105 transition-transform duration-500" 
              @error="handleImageError"
            />
          </div>
        </div>

      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Header from './Header.vue'

const router = useRouter()

const isLoading = ref(false)
const activeAnimeIndex = ref(0)

const animeCategories = ref([
  {
    id: 1,
    name: 'Attack on Titan',
    tag: 'Sale',
    image: '/images/aot.jpg',
    productCount: 2,
    author: 'Hajime Isayama',
    description: 'Cuộc chiến sinh tồn tàn khốc giữa nhân loại và các Titan khổng lồ. Dòng mô hình tập trung tái hiện bộ cơ động 3D sắc bén cùng các hình thái Titan cực kỳ hoành tráng.',
    popularCharacters: ['Eren Yeager', 'Levi Ackerman', 'Mikasa', 'Armored Titan']
  },
  {
    id: 2,
    name: 'Demon Slayer',
    tag: 'Trend',
    image: '/images/demonslayer.jpg',
    productCount: 2,
    author: 'Koyoharu Gotouge',
    description: 'Hành trình diệt quỷ cứu em gái của Tanjiro. Nổi tiếng với các mô hình hiệu ứng nhựa trong suốt tuyệt đẹp thể hiện các chiêu thức Hơi Thở Của Lửa và Nước.',
    popularCharacters: ['Tanjiro Kamado', 'Nezuko', 'Rengoku Kyojuro', 'Zenitsu']
  },
  {
    id: 3,
    name: 'Dragon Ball',
    tag: 'Best',
    image: '/images/dragonball.jpg',
    productCount: 0,
    author: 'Akira Toriyama',
    description: 'Biểu tượng Shonen huyền thoại thế giới. Các mô hình cơ bắp sắc nét của Goku, Vegeta qua các trạng thái Siêu Xayda (Super Saiyan) đỉnh cao.',
    popularCharacters: ['Son Goku', 'Vegeta', 'Gohan', 'Frieza']
  },
  {
    id: 4,
    name: 'Naruto',
    tag: 'New',
    image: '/images/naruto.jpg',
    productCount: 4,
    author: 'Masashi Kishimoto',
    description: 'Thế giới Nhẫn giả đầy cảm xúc. Dòng Figure phong phú từ tạo hình thời niên thiếu đến trạng thái Lục Đạo và Cửu Vĩ Chakra.',
    popularCharacters: ['Naruto Uzumaki', 'Sasuke Uchiha', 'Kakashi Hatake', 'Itachi Uchiha']
  },
  {
    id: 5,
    name: 'One Piece',
    tag: 'Hot',
    image: '/images/onepiece.jpg',
    productCount: 3,
    author: 'Eiichiro Oda',
    description: 'Hành trình tìm kiếm kho báu Vua Hải Tặc. Bộ sưu tập mô hình đa dạng với các trạng thái chiến đấu như Gear 4, Gear 5 Thần Mặt Trời Nika.',
    popularCharacters: ['Monkey D. Luffy', 'Roronoa Zoro', 'Sanji', 'Trafalgar Law']
  }
])

const currentSelectedAnime = computed(() => {
  if (animeCategories.value.length === 0) return null
  return animeCategories.value[activeAnimeIndex.value] || animeCategories.value[0]
})

// Chọn ngẫu nhiên tối đa 3 tên mô hình của anime đang chọn
const randomizedCharacters = computed(() => {
  const characters = currentSelectedAnime.value?.popularCharacters || []
  if (characters.length <= 3) return characters
  
  // Thuật toán xáo trộn Fisher-Yates
  const shuffled = [...characters]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.slice(0, 3)
})

const selectAnime = (index) => {
  activeAnimeIndex.value = index
}

const getTagColorClass = (tag) => {
  switch (tag) {
    case 'Hot': return 'text-rose-600 dark:text-rose-400'
    case 'Sale': return 'text-indigo-600 dark:text-indigo-400'
    case 'Trend': return 'text-sky-600 dark:text-sky-400'
    case 'Best': return 'text-amber-600 dark:text-amber-400'
    case 'New': return 'text-purple-600 dark:text-purple-400'
    default: return 'text-gray-700 dark:text-gray-300'
  }
}

const goToCategory = (id) => {
  router.push({ name: 'collections', query: { category: id } })
}

// Gọi API lấy danh mục & danh sách sản phẩm từ Backend
const fetchCategoryCounts = async () => {
  try {
    const [catRes, prodRes] = await Promise.allSettled([
      axios.get('http://localhost:3000/api/categories'),
      axios.get('http://localhost:3000/api/products')
    ])

    let allProducts = []
    if (prodRes.status === 'fulfilled' && prodRes.value.data) {
      allProducts = prodRes.value.data.data || prodRes.value.data
    }

    if (catRes.status === 'fulfilled' && catRes.value.data) {
      const data = catRes.value.data.data || catRes.value.data
      
      animeCategories.value.forEach(cat => {
        const foundCat = data.find(apiCat => 
          apiCat.name && apiCat.name.toLowerCase().includes(cat.name.toLowerCase())
        )
        
        if (foundCat) {
          if (foundCat.id) cat.id = foundCat.id
          if (foundCat.products_count !== undefined || foundCat.count !== undefined) {
            cat.productCount = foundCat.products_count || foundCat.count
          }
        }

        // Lọc sản phẩm thực tế từ CSDL theo ID danh mục hoặc tên Anime
        if (Array.isArray(allProducts) && allProducts.length > 0) {
          const matchedProducts = allProducts.filter(p => 
            p.category_id === cat.id || 
            (p.category_name && p.category_name.toLowerCase().includes(cat.name.toLowerCase())) ||
            (p.name && p.name.toLowerCase().includes(cat.name.toLowerCase()))
          )

          if (matchedProducts.length > 0) {
            cat.popularCharacters = matchedProducts.map(p => p.name || p.title)
            cat.productCount = matchedProducts.length
          }
        }
      })
    }
  } catch (error) {
    console.log('Sử dụng danh sách mặc định:', error.message)
  }
}

const handleImageError = (e) => {
  e.target.src = '/images/demonslayer.jpg'
}

onMounted(() => {
  fetchCategoryCounts()
})
</script>