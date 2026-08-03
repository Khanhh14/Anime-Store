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
                <!-- Địa chỉ -->
                <div class="info-item">
                  <div class="info-icon">
                    <FontAwesomeIcon icon="fa-solid fa-location-dot" />
                  </div>
                  <div class="info-text">
                    <h3>Địa chỉ cửa hàng</h3>
                    <p>123 Đường Anime, Phường 4, Quận 10, TP. Hồ Chí Minh</p>
                  </div>
                </div>

                <!-- Hotline -->
                <div class="info-item">
                  <div class="info-icon">
                    <FontAwesomeIcon icon="fa-solid fa-phone" />
                  </div>
                  <div class="info-text">
                    <h3>Hotline hỗ trợ</h3>
                    <p>(036) 3352990</p>
                    <span class="sub-text">Thứ 2 - Chủ Nhật (8:30 - 21:30)</span>
                  </div>
                </div>

                <!-- Email -->
                <div class="info-item">
                  <div class="info-icon">
                    <FontAwesomeIcon icon="fa-solid fa-envelope" />
                  </div>
                  <div class="info-text">
                    <h3>Email liên hệ</h3>
                    <p>busu6226@gmail.com</p>
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
                    name="user_name"
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
                      name="user_email"
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
                      name="user_phone"
                      v-model="form.phone" 
                      placeholder="0901234567" 
                      required 
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label for="subject">Nhu cầu hỗ trợ *</label>
                  <select id="subject" name="subject" v-model="form.subject" required>
                    <option value="" disabled selected>Chọn chủ đề...</option>
                    <option value="Tư vấn đặt trước (Pre-order)">Tư vấn đặt trước (Pre-order)</option>
                    <option value="Kiểm tra trạng thái đơn hàng">Kiểm tra trạng thái đơn hàng</option>
                    <option value="Bảo hành / Đổi trả sản phẩm">Bảo hành / Đổi trả sản phẩm</option>
                    <option value="Vấn đề khác">Vấn đề khác</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="message">Nội dung tin nhắn *</label>
                  <textarea 
                    id="message" 
                    name="message"
                    v-model="form.message" 
                    rows="5" 
                    placeholder="Nhập chi tiết yêu cầu của bạn..." 
                    required
                  ></textarea>
                </div>

                <button type="submit" class="submit-btn" :disabled="isSubmitting">
                  {{ isSubmitting ? 'Đang gửi...' : 'Gửi Tin Nhắn' }}
                </button>

                <!-- Dòng hiển thị thông báo kết quả -->
                <p 
                  v-if="statusMessage" 
                  :style="{ color: isSuccess ? '#52c41a' : '#ff4d4f', marginTop: '12px', fontWeight: '500', textAlign: 'center' }"
                >
                  {{ statusMessage }}
                </p>
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
import { sendContactEmail } from '@/plugins/emailService'
import { FontAwesomeIcon } from '@/plugins/fontawesome'

export default {
  name: 'ContactView',
  components: {
    Header,
    Footer,
    FontAwesomeIcon
  },
  setup() {
    const router = useRouter()
    const isSubmitting = ref(false)
    const statusMessage = ref('')
    const isSuccess = ref(false)

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

    // Xử lý gửi tin nhắn qua EmailJS
    const handleSubmit = async (event) => {
      isSubmitting.value = true
      statusMessage.value = ''

      const result = await sendContactEmail(event.target)

      isSubmitting.value = false
      isSuccess.value = result.success
      statusMessage.value = result.message

      if (result.success) {
        form.name = ''
        form.email = ''
        form.phone = ''
        form.subject = ''
        form.message = ''
      }
    }

    return {
      form,
      isSubmitting,
      statusMessage,
      isSuccess,
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
@import '@/assets/views/ContactView.css';
</style>