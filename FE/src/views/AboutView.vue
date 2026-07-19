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
                <div class="image-icon">✨</div>
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
              <div class="value-icon">🎯</div>
              <h3>Chất Lượng</h3>
              <p>Chỉ cung cấp sản phẩm chính hãng, kiểm định kỹ lưỡng trước khi gửi đến bạn</p>
            </div>
            <div class="value-card">
              <div class="value-icon">💝</div>
              <h3>Tâm Niệm</h3>
              <p>Mỗi sản phẩm được đóng gói cẩn thận, gửi tới bạn như một món quà đặc biệt</p>
            </div>
            <div class="value-card">
              <div class="value-icon">⚡</div>
              <h3>Hiệu Quả</h3>
              <p>Giao hàng nhanh, hỗ trợ khách hàng 24/7, đảm bảo trải nghiệm mua sắm tuyệt vời</p>
            </div>
            <div class="value-card">
              <div class="value-icon">🌟</div>
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
              <div class="team-avatar">👨‍💼</div>
              <h3>Trần Bảo Khanh</h3>
              <p class="team-role">Sáng Lập Viên & CEO</p>
              <p class="team-bio">Người yêu anime, giấc mơ là mang hình tượng yêu thích đến mọi fan</p>
            </div>
            <div class="team-card">
              <div class="team-avatar">👩‍💼</div>
              <h3>Trần Bảo Khanh</h3>
              <p class="team-role">Quản Lý Sản Phẩm</p>
              <p class="team-bio">Chuyên gia tìm kiếm những mô hình tốt nhất trên toàn thế giới</p>
            </div>
            <div class="team-card">
              <div class="team-avatar">👨‍🔧</div>
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
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.about {
  background: #fff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Hero Section */
.hero {
  position: relative;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff1744 0%, #ff5252 50%, #ff1744 100%);
  color: white;
  text-align: center;
  overflow: hidden;
}

.hero-decoration {
  position: absolute;
  width: 100%;
  height: 100%;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
}

.decoration-circle-1 {
  width: 500px;
  height: 500px;
  top: -100px;
  right: -100px;
}

.decoration-circle-2 {
  width: 300px;
  height: 300px;
  bottom: -50px;
  left: -100px;
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-title {
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.hero-subtitle {
  font-size: 1.3rem;
  opacity: 0.95;
  font-weight: 300;
}

/* Story Section */
.story {
  padding: 80px 0;
  background: #f8f9fa;
}

.story-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.section-title {
  font-size: 2.5rem;
  color: #ff1744;
  margin-bottom: 30px;
  font-weight: 700;
}

.text-center {
  text-align: center;
}

.story-description {
  font-size: 1.1rem;
  color: #555;
  line-height: 1.8;
  margin-bottom: 40px;
}

.stats {
  display: flex;
  gap: 40px;
}

.stat-item {
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #ff1744;
  margin-bottom: 5px;
}

.stat-label {
  color: #999;
  font-size: 0.9rem;
}

.story-image {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}

.image-placeholder {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #ff5252, #ff1744);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 20px 60px rgba(255, 23, 68, 0.3);
  animation: float 3s ease-in-out infinite;
}

.image-icon {
  font-size: 80px;
  opacity: 0.8;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* Values Section */
.values {
  padding: 80px 0;
  background: white;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 50px;
}

.value-card {
  padding: 40px 30px;
  background: #f8f9fa;
  border-radius: 15px;
  text-align: center;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.value-card:hover {
  transform: translateY(-10px);
  border-color: #ff1744;
  box-shadow: 0 15px 40px rgba(255, 23, 68, 0.1);
}

.value-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.value-card h3 {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 15px;
  font-weight: 700;
}

.value-card p {
  color: #777;
  line-height: 1.6;
  font-size: 0.95rem;
}

/* Team Section */
.team {
  padding: 80px 0;
  background: #f8f9fa;
}

.team-subtitle {
  text-align: center;
  color: #777;
  font-size: 1.1rem;
  margin-bottom: 50px;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
  margin-top: 50px;
}

.team-card {
  background: white;
  padding: 40px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.team-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(255, 23, 68, 0.15);
}

.team-avatar {
  font-size: 4rem;
  margin-bottom: 20px;
}

.team-card h3 {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 8px;
  font-weight: 700;
}

.team-role {
  color: #ff1744;
  font-weight: 600;
  margin-bottom: 15px;
  font-size: 0.95rem;
}

.team-bio {
  color: #777;
  line-height: 1.6;
  font-size: 0.9rem;
}

/* CTA Section */
.cta {
  padding: 80px 0;
  background: linear-gradient(135deg, #ff1744 0%, #ff5252 100%);
  color: white;
  text-align: center;
}

.cta-content h2 {
  font-size: 2.5rem;
  margin-bottom: 15px;
  font-weight: 700;
}

.cta-content p {
  font-size: 1.1rem;
  margin-bottom: 40px;
  opacity: 0.95;
}

.cta-button {
  background: white;
  color: #ff1744;
  border: none;
  padding: 16px 50px;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-decoration: none;
  display: inline-block;
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .story-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .stats {
    flex-direction: column;
    gap: 20px;
  }

  .story-image {
    height: 300px;
  }

  .image-placeholder {
    width: 250px;
    height: 250px;
  }

  .image-icon {
    font-size: 60px;
  }

  .values-grid {
    grid-template-columns: 1fr;
  }

  .team-grid {
    grid-template-columns: 1fr;
  }

  .cta-content h2 {
    font-size: 1.8rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .cta-button {
    padding: 12px 30px;
    font-size: 1rem;
  }
}
</style>
