<template>
  <div class="contact page-wrapper">
    <!-- Header Component -->
    <Header 
      @logo-click="handleLogoClick"
      @nav-click="handleNavClick"
      @search-click="handleSearchClick"
      @login="handleLogin"
      @signup="handleSignup"
    />

    <!-- Main Content -->
    <main class="main-content">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h1 class="hero-title">Liên Hệ Với Chúng Tôi</h1>
          <p class="hero-subtitle">Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ mọi thắc mắc của bạn 24/7</p>
        </div>
        <div class="hero-decoration">
          <div class="decoration-circle decoration-circle-1"></div>
          <div class="decoration-circle decoration-circle-2"></div>
        </div>
      </section>

      <!-- Main Contact Section -->
      <section class="contact-main">
        <div class="container">
          <div class="contact-grid">
            
            <!-- Information Column -->
            <div class="contact-info">
              <h2 class="section-title">Thông Tin Liên Hệ</h2>
              <p class="info-desc">
                Bạn cần tìm kiếm mô hình hiếm, thắc mắc về đơn hàng Pre-order hay muốn trao đổi hợp tác? Hãy liên hệ qua các kênh dưới đây!
              </p>

              <div class="info-list">
                <div class="info-item">
                  <div class="info-icon">📍</div>
                  <div class="info-text">
                    <h3>Địa chỉ cửa hàng</h3>
                    <p>123 Đường Anime, Phường 4, Quận 10, TP. Hồ Chí Minh</p>
                  </div>
                </div>

                <div class="info-item">
                  <div class="info-icon">📞</div>
                  <div class="info-text">
                    <h3>Hotline hỗ trợ</h3>
                    <p>1900 xxxx - (028) 3838 xxxx</p>
                    <span class="sub-text">Thứ 2 - Chủ Nhật (8:30 - 21:30)</span>
                  </div>
                </div>

                <div class="info-item">
                  <div class="info-icon">✉️</div>
                  <div class="info-text">
                    <h3>Email liên hệ</h3>
                    <p>support@animestore.vn</p>
                    <span class="sub-text">Phản hồi nhanh trong vòng 24 giờ</span>
                  </div>
                </div>
              </div>

              <!-- Social Links -->
              <div class="social-box">
                <h3>Theo dõi chúng tôi</h3>
                <div class="social-icons">
                  <a href="#" class="social-btn">Facebook</a>
                  <a href="#" class="social-btn">Instagram</a>
                  <a href="#" class="social-btn">TikTok</a>
                  <a href="#" class="social-btn">Zalo Community</a>
                </div>
              </div>
            </div>

            <!-- Form Column -->
            <div class="contact-form-container">
              <form class="contact-form" @submit.prevent="handleSubmit">
                <h3 class="form-title">Gửi Tin Nhắn Cho Chúng Tôi</h3>
                
                <div class="form-group">
                  <label for="name">Họ và tên *</label>
                  <input 
                    type="text" 
                    id="name" 
                    v-model="form.name" 
                    placeholder="Ví dụ: Nguyễn Văn A" 
                    required 
                  />
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="email">Email *</label>
                    <input 
                      type="email" 
                      id="email" 
                      v-model="form.email" 
                      placeholder="email@example.com" 
                      required 
                    />
                  </div>
                  <div class="form-group">
                    <label for="phone">Số điện thoại *</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      v-model="form.phone" 
                      placeholder="0901234567" 
                      required 
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label for="subject">Nhu cầu hỗ trợ *</label>
                  <select id="subject" v-model="form.subject" required>
                    <option value="" disabled selected>Chọn chủ đề...</option>
                    <option value="preorder">Tư vấn đặt trước (Pre-order)</option>
                    <option value="order">Kiểm tra trạng thái đơn hàng</option>
                    <option value="warranty">Bảo hành / Đổi trả sản phẩm</option>
                    <option value="other">Vấn đề khác</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="message">Nội dung tin nhắn *</label>
                  <textarea 
                    id="message" 
                    v-model="form.message" 
                    rows="5" 
                    placeholder="Nhập chi tiết yêu cầu của bạn..." 
                    required
                  ></textarea>
                </div>

                <button type="submit" class="submit-btn" :disabled="isSubmitting">
                  {{ isSubmitting ? 'Đang gửi...' : 'Gửi Tin Nhắn' }}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="faq">
        <div class="container">
          <h2 class="section-title text-center">Câu Hỏi Thường Gặp</h2>
          <div class="faq-grid">
            <div class="faq-card">
              <h3>Mô hình có phải hàng chính hãng không?</h3>
              <p>100% sản phẩm tại cửa hàng đều là hàng chính hãng (Official), nhập khẩu trực tiếp từ Nhật Bản và các nhà phân phối ủy quyền.</p>
            </div>
            <div class="faq-card">
              <h3>Chính sách đặt trước (Pre-order) như thế nào?</h3>
              <p>Bạn chỉ cần cọc trước từ 20% - 50% giá trị sản phẩm. Khi hàng về kho, cửa hàng sẽ thông báo để bạn thanh toán phần còn lại.</p>
            </div>
            <div class="faq-card">
              <h3>Giao hàng trong bao lâu?</h3>
              <p>Đối với đơn hàng có sẵn: Nội thành TP.HCM (1 - 2 ngày), các tỉnh thành khác (3 - 5 ngày làm việc).</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Map Section -->
      <section class="map-section">
        <div class="container">
          <h2 class="section-title text-center">Bản Đồ Cửa Hàng</h2>
          <div class="map-wrapper">
            <iframe 
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3882.2618990141675!2d109.39547537583626!3d12.970935287344332!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTLCsDU4JzE1LjQiTiAxMDlhMjMnNTEuMyJF!5e0!3m2!1svi!2s!4v1710000000000!5m2!1svi!2s" 
            width="100%" 
            height="450" 
            style="border:0;" 
            allowfullscreen="" 
            loading="lazy" 
            referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer Component -->
    <Footer />
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/Home/Header.vue'
import Footer from '@/components/Home/Footer.vue'

export default {
  name: 'ContactView',
  components: {
    Header,
    Footer
  },
  setup() {
    const router = useRouter()
    const isSubmitting = ref(false)

    const form = reactive({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    })

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
        router.push({ name: 'contact' })
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

    const handleSubmit = () => {
      isSubmitting.value = true
      setTimeout(() => {
        alert('Cảm ơn bạn đã gửi tin nhắn! Chúng tôi sẽ liên hệ lại sớm nhất.')
        form.name = ''
        form.email = ''
        form.phone = ''
        form.subject = ''
        form.message = ''
        isSubmitting.value = false
      }, 1000)
    }

    return {
      form,
      isSubmitting,
      handleLogoClick,
      handleNavClick,
      handleSearchClick,
      handleLogin,
      handleSignup,
      handleSubmit
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

/* Base Layout Structure (Thay thế cho Tailwind flex flex-col min-h-screen) */
.page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #fff;
}

.main-content {
  flex: 1;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  font-size: 2.5rem;
  color: #ff1744;
  margin-bottom: 20px;
  font-weight: 700;
}

.text-center {
  text-align: center;
}

/* Hero Section */
.hero {
  position: relative;
  min-height: 400px;
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
  background: white;
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
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.hero-subtitle {
  font-size: 1.2rem;
  opacity: 0.95;
  font-weight: 300;
}

/* Contact Main Section */
.contact-main {
  padding: 80px 0;
  background: #f8f9fa;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 50px;
  align-items: start;
}

.info-desc {
  font-size: 1.05rem;
  color: #555;
  line-height: 1.6;
  margin-bottom: 30px;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin-bottom: 40px;
}

.info-item {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.info-icon {
  font-size: 2rem;
  background: #fff;
  width: 55px;
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-shadow: 0 5px 15px rgba(255, 23, 68, 0.15);
  flex-shrink: 0;
}

.info-text h3 {
  font-size: 1.1rem;
  color: #333;
  font-weight: 700;
  margin-bottom: 5px;
}

.info-text p {
  color: #555;
  font-weight: 600;
}

.sub-text {
  font-size: 0.85rem;
  color: #888;
}

.social-box h3 {
  font-size: 1.1rem;
  color: #333;
  font-weight: 700;
  margin-bottom: 15px;
}

.social-icons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.social-btn {
  padding: 8px 16px;
  background: white;
  color: #ff1744;
  border: 1px solid #ff1744;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-btn:hover {
  background: #ff1744;
  color: white;
}

/* Contact Form */
.contact-form-container {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.form-title {
  font-size: 1.5rem;
  color: #333;
  font-weight: 700;
  margin-bottom: 25px;
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #444;
  margin-bottom: 8px;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 12px 15px;
  border: 1.5px solid #eee;
  border-radius: 10px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.3s ease;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #ff1744;
}

.submit-btn {
  width: 100%;
  background: linear-gradient(135deg, #ff1744 0%, #ff5252 100%);
  color: white;
  border: none;
  padding: 15px;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(255, 23, 68, 0.25);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(255, 23, 68, 0.35);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* FAQ Section */
.faq {
  padding: 80px 0;
  background: white;
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.faq-card {
  padding: 30px;
  background: #f8f9fa;
  border-radius: 15px;
  border-left: 4px solid #ff1744;
}

.faq-card h3 {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 12px;
  font-weight: 700;
}

.faq-card p {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.6;
}

/* Map Section */
.map-section {
  padding: 0 0 80px 0;
  background: white;
}

.map-wrapper {
  margin-top: 30px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

/* Responsive */
@media (max-width: 992px) {
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .contact-form-container {
    padding: 25px;
  }
}
</style>