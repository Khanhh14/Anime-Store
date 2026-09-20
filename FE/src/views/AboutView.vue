<template>
  <div class="about flex flex-col min-h-screen">
    <!-- Header Component -->
    <Header 
      @logo-click="handleLogoClick"
      @nav-click="handleNavClick"
      @search-click="handleSearchClick"
      @login="handleLogin"
      @signup="handleSignup"
    />

    <!-- Main Content -->
    <main class="flex-1">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h1 class="hero-title">Về Chúng Tôi</h1>
          <p class="hero-subtitle">Kho mô hình anime chính hãng, chất lượng cao nhất thị trường</p>
        </div>
        <div class="hero-decoration">
          <div class="decoration-circle decoration-circle-1"></div>
          <div class="decoration-circle decoration-circle-2"></div>
        </div>
      </section>

      <!-- Story Section -->
      <section class="story">
        <div class="container">
          <div class="story-content">
            <div class="story-text">
              <h2 class="section-title">Câu Chuyện Của Chúng Tôi</h2>
              <p class="story-description">
                Chúng tôi bắt đầu với một đam mê: mang những mô hình anime chất lượng cao đến tay các fan thực thụ. 
                Từ một cửa hàng nhỏ, chúng tôi đã phát triển thành đối tác tin cậy cho hàng nghìn khách hàng yêu thích anime.
              </p>
              <div class="stats">
                <div class="stat-item">
                  <div class="stat-number">10K+</div>
                  <div class="stat-label">Khách hàng hài lòng</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">5000+</div>
                  <div class="stat-label">Sản phẩm hiện có</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">100%</div>
                  <div class="stat-label">Chính hãng</div>
                </div>
              </div>
            </div>
            <div class="story-image">
              <div class="image-placeholder">
                <div class="image-icon">
                  <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" class="text-amber-400 text-3xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Values Section -->
      <section class="values">
        <div class="container">
          <h2 class="section-title text-center">Giá Trị Cốt Lõi</h2>
          <div class="values-grid">
            <div class="value-card">
              <div class="value-icon">
                <font-awesome-icon :icon="['fas', 'bullseye']" class="text-rose-500 text-2xl" />
              </div>
              <h3>Chất Lượng</h3>
              <p>Chỉ cung cấp sản phẩm chính hãng, kiểm định kỹ lưỡng trước khi gửi đến bạn</p>
            </div>
            <div class="value-card">
              <div class="value-icon">
                <font-awesome-icon :icon="['fas', 'heart']" class="text-pink-500 text-2xl" />
              </div>
              <h3>Tâm Niệm</h3>
              <p>Mỗi sản phẩm được đóng gói cẩn thận, gửi tới bạn như một món quà đặc biệt</p>
            </div>
            <div class="value-card">
              <div class="value-icon">
                <font-awesome-icon :icon="['fas', 'bolt']" class="text-amber-400 text-2xl" />
              </div>
              <h3>Hiệu Quả</h3>
              <p>Giao hàng nhanh, hỗ trợ khách hàng 24/7, đảm bảo trải nghiệm mua sắm tuyệt vời</p>
            </div>
            <div class="value-card">
              <div class="value-icon">
                <font-awesome-icon :icon="['fas', 'star']" class="text-yellow-400 text-2xl" />
              </div>
              <h3>Đa Dạng</h3>
              <p>Luôn cập nhật các mô hình mới nhất từ các anime phổ biến và độc quyền</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Team Section -->
      <section class="team">
        <div class="container">
          <h2 class="section-title text-center">Đội Ngũ Của Chúng Tôi</h2>
          <p class="team-subtitle">Những người đam mê anime, luôn sẵn lòng phục vụ bạn</p>
          <div class="team-grid">
            <div class="team-card">
              <div class="team-avatar">
                <font-awesome-icon :icon="['fas', 'user-tie']" class="text-indigo-400 text-2xl" />
              </div>
              <h3>Trần Bảo Khanh</h3>
              <p class="team-role">Sáng Lập Viên & CEO</p>
              <p class="team-bio">Người yêu anime, giấc mơ là mang hình tượng yêu thích đến mọi fan</p>
            </div>
            <div class="team-card">
              <div class="team-avatar">
                <font-awesome-icon :icon="['fas', 'user-check']" class="text-emerald-400 text-2xl" />
              </div>
              <h3>Trần Bảo Khanh</h3>
              <p class="team-role">Quản Lý Sản Phẩm</p>
              <p class="team-bio">Chuyên gia tìm kiếm những mô hình tốt nhất trên toàn thế giới</p>
            </div>
            <div class="team-card">
              <div class="team-avatar">
                <font-awesome-icon :icon="['fas', 'user-gear']" class="text-sky-400 text-2xl" />
              </div>
              <h3>Trần Bảo Khanh</h3>
              <p class="team-role">Quản Lý Vận Hành</p>
              <p class="team-bio">Đảm bảo mỗi sản phẩm đến tay bạn an toàn và đúng thời gian</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta">
        <div class="container">
          <div class="cta-content">
            <h2>Sẵn Sàng Tìm Mô Hình Yêu Thích?</h2>
            <p>Khám phá bộ sưu tập anime đầy đủ của chúng tôi ngay hôm nay</p>
            <router-link to="/collections" class="cta-button">Xem Sản Phẩm Ngay</router-link>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer Component -->
    <Footer />
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import Header from '@/components/Home/Header.vue'
import Footer from '@/components/Home/Footer.vue'

export default {
  name: 'AboutView',
  components: {
    Header,
    Footer
  },
  setup() {
    const router = useRouter()

    const handleLogoClick = () => {
      router.push({ name: 'home' })
    }

    const handleNavClick = (linkId) => {
      if (linkId === 'home') {
        router.push({ name: 'home' })
      } else if (linkId === 'collections') {
        router.push({ name: 'collections' })
      } else if (linkId === 'series') {
        console.log('Navigate to series')
      } else if (linkId === 'about') {
        router.push({ name: 'about' })
      } else if (linkId === 'contact') {
        console.log('Navigate to contact')
      }
    }

    const handleSearchClick = () => {
      console.log('Search clicked')
    }

    const handleLogin = () => {
      router.push({ name: 'login' })
    }

    const handleSignup = () => {
      router.push({ name: 'register' })
    }

    return {
      handleLogoClick,
      handleNavClick,
      handleSearchClick,
      handleLogin,
      handleSignup
    }
  },
  mounted() {
    window.scrollTo(0, 0)
  }
}
</script>

<style scoped>
@import '@/assets/views/AboutView.css';
</style>