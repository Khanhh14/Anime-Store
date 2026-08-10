<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">
      <!-- Register Card -->
      <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-rose-500 to-pink-500 px-6 sm:px-8 py-8">
          <h1 class="text-2xl sm:text-3xl font-bold text-white text-center">
            Tạo tài khoản mới
          </h1>
          <p class="text-rose-100 text-center mt-2 text-sm">
            Đăng ký và bắt đầu trải nghiệm
          </p>
        </div>

        <!-- Form Content -->
        <form @submit.prevent="handleRegister" class="px-6 sm:px-8 py-8">
          <!-- Full Name Input -->
          <div class="mb-5">
            <label for="fullname" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Họ và tên
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                id="fullname"
                v-model="formData.fullName"
                type="text"
                placeholder="Nhập họ và tên"
                required
                class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300"
              />
            </div>
          </div>

          <!-- Email Input -->
          <div class="mb-5">
            <label for="email" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                placeholder="example@email.com"
                required
                class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300"
              />
            </div>
          </div>

          <!-- Password Input -->
          <div class="mb-5">
            <label for="password" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Mật khẩu
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="password"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                required
                @input="validatePassword"
                class="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-4.753 4.753m7.538-1.15a3 3 0 00-4.243-4.243M9.365 11.599a6 6 0 018.488 8.488M3 3l3.257 3.257m9.486 9.486L21 21" />
                </svg>
              </button>
            </div>
            <!-- Password Strength Indicator -->
            <div v-if="formData.password" class="mt-2 flex items-center space-x-2">
              <div class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  :class="['h-full transition-all duration-300', passwordStrength.color]"
                  :style="{ width: `${passwordStrength.percent}%` }"
                ></div>
              </div>
              <span class="text-xs font-semibold" :class="passwordStrength.textColor">
                {{ passwordStrength.label }}
              </span>
            </div>
          </div>

          <!-- Confirm Password Input -->
          <div class="mb-2">
            <label for="confirmPassword" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Xác nhận mật khẩu
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="confirmPassword"
                v-model="formData.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="••••••••"
                required
                class="w-full pl-10 pr-12 py-3 border transition-all duration-300 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
                :class="{
                  'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-rose-500 focus:border-transparent': !passwordMismatch,
                  'border-red-500 dark:border-red-500 focus:ring-2 focus:ring-red-500 focus:border-transparent': passwordMismatch
                }"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg v-if="showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-4.753 4.753m7.538-1.15a3 3 0 00-4.243-4.243M9.365 11.599a6 6 0 018.488 8.488M3 3l3.257 3.257m9.486 9.486L21 21" />
                </svg>
              </button>
            </div>
            <p v-if="passwordMismatch" class="mt-1 text-sm text-red-500 dark:text-red-400">
              Mật khẩu không khớp
            </p>
          </div>

          <!-- Terms & Conditions -->
          <div class="mb-6 mt-6">
            <label class="flex items-start cursor-pointer">
              <input
                v-model="formData.agreeTerms"
                type="checkbox"
                class="w-4 h-4 mt-1 rounded border-gray-300 dark:border-gray-600 text-rose-500 focus:ring-rose-500 dark:bg-gray-800 cursor-pointer"
                required
              />
              <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">
                Tôi đồng ý với
                <button 
                  type="button" 
                  @click="showTermsModal = true" 
                  class="text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 font-semibold transition-colors underline bg-transparent border-none cursor-pointer p-0"
                >
                  Điều khoản dịch vụ
                </button>
                và
                <button 
                  type="button" 
                  @click="showPrivacyModal = true" 
                  class="text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 font-semibold transition-colors underline bg-transparent border-none cursor-pointer p-0"
                >
                  Chính sách bảo mật
                </button>
              </span>
            </label>
          </div>

          <!-- Register Button -->
          <button
            type="submit"
            :disabled="isLoading || passwordMismatch || !formData.agreeTerms"
            class="w-full py-3 px-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 active:from-rose-700 active:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-rose-500/50 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center"
          >
            <span v-if="!isLoading">Tạo tài khoản</span>
            <span v-else class="flex items-center space-x-2">
              <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Đang xử lý...</span>
            </span>
          </button>
        </form>

        <!-- Login Link -->
        <div class="px-6 sm:px-8 py-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 text-center">
          <p class="text-gray-700 dark:text-gray-300 text-sm">
            Đã có tài khoản?
            <button
              type="button"
              @click="goToLogin"
              class="font-bold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors bg-none border-none cursor-pointer p-0"
            >
              Đăng nhập
            </button>
          </p>
        </div>
      </div>

      <!-- Footer Text -->
      <p class="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
        Bằng cách đăng ký, bạn đồng ý với
        <button 
          type="button" 
          @click="showTermsModal = true" 
          class="text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors underline bg-transparent border-none cursor-pointer p-0"
        >
          Điều khoản dịch vụ
        </button>
        và
        <button 
          type="button" 
          @click="showPrivacyModal = true" 
          class="text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors underline bg-transparent border-none cursor-pointer p-0"
        >
          Chính sách bảo mật
        </button>
      </p>
    </div>

    <!-- Modal 1: Điều khoản dịch vụ -->
    <Teleport to="body">
      <div 
        v-if="showTermsModal" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity"
        @click.self="showTermsModal = false"
      >
        <div class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden border border-gray-100 dark:border-gray-800">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
            <h3 class="text-lg font-bold flex items-center gap-2">
              <span></span> Điều khoản dịch vụ & Đặt hàng Mô hình
            </h3>
            <button @click="showTermsModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl font-bold">&times;</button>
          </div>
          
          <!-- Body -->
          <div class="p-6 overflow-y-auto space-y-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            <section class="space-y-1">
              <h4 class="font-bold text-gray-800 dark:text-white">1. Quy định về Hàng Pre-order (Đặt trước)</h4>
              <p>- Hàng Pre-order có thời gian phát hành dự kiến từ nhà sản xuất (Good Smile Company, Bandai, Kotobukiya...). Thời gian hàng về có thể trễ hơn dự kiến do lịch sản xuất hoặc vận chuyển quốc tế.</p>
              <p>- Số tiền cọc Pre-order sẽ <strong class="text-rose-500">không được hoàn lại</strong> nếu quý khách tự ý hủy đơn sau khi shop đã chốt đơn với nhà phân phối.</p>
            </section>

            <section class="space-y-1">
              <h4 class="font-bold text-gray-800 dark:text-white">2. Cam kết Chính Hãng (Authentic)</h4>
              <p>- Shop cam kết 100% sản phẩm là <strong>HÀNG CHÍNH HÃNG (Official/Authentic)</strong> từ Nhật Bản và các nhà phân phối ủy quyền. Nói KHÔNG với hàng Bootleg / Fake / Figma nhái.</p>
            </section>

            <section class="space-y-1">
              <h4 class="font-bold text-gray-800 dark:text-white">3. Chính sách Đổi trả & Kiểm hàng</h4>
              <p>- Khách hàng <strong>bắt buộc phải quay video Unbox (mở hộp)</strong> từ lúc kiện hàng còn nguyên niêm phong để làm bằng chứng khi có sự cố.</p>
              <p>- Các lỗi sơn nhỏ hoặc lỗi sản xuất nằm trong tiêu chuẩn cho phép của nhà sản xuất sẽ áp dụng theo quy chuẩn hỗ trợ từ hãng.</p>
              <p>- Hỗ trợ đổi trả hoặc hoàn tiền 100% nếu mô hình bị gãy, gãy khớp, thiếu phụ kiện do vận chuyển hoặc giao sai mẫu.</p>
            </section>

            <section class="space-y-1">
              <h4 class="font-bold text-gray-800 dark:text-white">4. Tình trạng Hộp (Box Condition)</h4>
              <p>- Shop luôn đóng gói xốp nổ (bubble wrap) và thùng carton 5 lớp cẩn thận. Tuy nhiên, vỏ hộp bên ngoài có thể bị móp nhẹ trong quá trình vận chuyển quốc tế mà không ảnh hưởng đến mô hình bên trong.</p>
            </section>
          </div>

          <!-- Footer -->
          <div class="px-6 py-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
            <button 
              @click="showTermsModal = false" 
              class="px-5 py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              Tôi đã hiểu & Đồng ý
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal 2: Chính sách bảo mật -->
    <Teleport to="body">
      <div 
        v-if="showPrivacyModal" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity"
        @click.self="showPrivacyModal = false"
      >
        <div class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden border border-gray-100 dark:border-gray-800">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
            <h3 class="text-lg font-bold flex items-center gap-2">
              <span></span> Chính sách bảo mật thông tin
            </h3>
            <button @click="showPrivacyModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl font-bold">&times;</button>
          </div>

          <!-- Body -->
          <div class="p-6 overflow-y-auto space-y-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            <section class="space-y-1">
              <h4 class="font-bold text-gray-800 dark:text-white">1. Thu thập thông tin giao hàng</h4>
              <p>Để đảm bảo mô hình đến đúng tay bạn, chúng tôi thu thập các thông tin bao gồm: Họ tên, Số điện thoại, Địa chỉ nhận hàng và Email (để gửi thông báo lịch hàng về / mã vận đơn).</p>
            </section>

            <section class="space-y-1">
              <h4 class="font-bold text-gray-800 dark:text-white">2. Bảo mật thông tin thanh toán & Đặt cọc</h4>
              <p>Mọi thông tin giao dịch chuyển khoản ngân hàng hoặc thanh toán online đều được xử lý qua cổng thanh toán bảo mật. Shop không lưu trữ thông tin thẻ ngân hàng của khách hàng.</p>
            </section>

            <section class="space-y-1">
              <h4 class="font-bold text-gray-800 dark:text-white">3. Thông báo lịch Hàng về (Pre-order Notification)</h4>
              <p>Email và Số điện thoại của bạn chỉ được sử dụng để:</p>
              <ul class="list-disc pl-5 space-y-1">
                <li>Xác nhận đơn hàng và tiền cọc.</li>
                <li>Gửi thông báo khi đơn hàng Pre-order về tới kho để bạn thanh toán phần còn lại.</li>
                <li>Cập nhật ưu đãi khuyến mãi (chỉ khi bạn đăng ký nhận tin).</li>
              </ul>
            </section>

            <section class="space-y-1">
              <h4 class="font-bold text-gray-800 dark:text-white">4. Cam kết không chia sẻ thông tin</h4>
              <p>Chúng tôi tuyệt đối không bán, chia sẻ hoặc trao đổi thông tin cá nhân của Otaku / Wibu / Khách hàng cho bất kỳ bên thứ ba nào khác ngoài đơn vị vận chuyển (GHTK, GHN, Viettel Post...).</p>
            </section>
          </div>

          <!-- Footer -->
          <div class="px-6 py-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
            <button 
              @click="showPrivacyModal = false" 
              class="px-5 py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              Đã hiểu & Đóng
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()

const formData = ref({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)

// Trạng thái hiển thị modal
const showTermsModal = ref(false)
const showPrivacyModal = ref(false)

const passwordMismatch = computed(() => {
  return formData.value.confirmPassword && formData.value.password !== formData.value.confirmPassword
})

const passwordStrength = computed(() => {
  const password = formData.value.password
  if (!password) return { percent: 0, label: '', color: '', textColor: '' }

  let strength = 0
  if (password.length >= 8) strength++
  if (password.match(/[a-z]+/)) strength++
  if (password.match(/[A-Z]+/)) strength++
  if (password.match(/[0-9]+/)) strength++
  if (password.match(/[@$!%*?&]+/)) strength++

  const strengthLevels = [
    { percent: 0, label: 'Rất yếu', color: 'bg-gray-300', textColor: 'text-gray-500' },
    { percent: 20, label: 'Yếu', color: 'bg-red-500', textColor: 'text-red-500' },
    { percent: 40, label: 'Vừa', color: 'bg-orange-500', textColor: 'text-orange-500' },
    { percent: 60, label: 'Tốt', color: 'bg-yellow-500', textColor: 'text-yellow-500' },
    { percent: 80, label: 'Mạnh', color: 'bg-lime-500', textColor: 'text-lime-500' },
    { percent: 100, label: 'Rất mạnh', color: 'bg-green-500', textColor: 'text-green-500' }
  ]

  return strengthLevels[strength]
})

const validatePassword = () => {
  // Validation happens in computed property
}

const handleRegister = async () => {
  if (passwordMismatch.value) {
    toast.error('Mật khẩu không khớp!')
    return
  }

  if (!formData.value.agreeTerms) {
    toast.warning('Vui lòng đồng ý với điều khoản dịch vụ!')
    return
  }

  isLoading.value = true

  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fullName: formData.value.fullName,
        email: formData.value.email,
        password: formData.value.password,
        confirmPassword: formData.value.confirmPassword
      })
    })

    const data = await response.json()

    if (data.success) {
      localStorage.setItem('token', data.data.token)
      localStorage.setItem('user', JSON.stringify(data.data.user))
      
      toast.success('Đăng ký tài khoản thành công!')
      router.push({ name: 'dashboard' })
    } else {
      toast.error(data.message || 'Đăng ký thất bại!')
    }
  } catch (error) {
    console.error('Registration error:', error)
    toast.error('Có lỗi xảy ra. Vui lòng thử lại sau!')
  } finally {
    isLoading.value = false
  }
}

const goToLogin = () => {
  router.push({ name: 'login' })
}
</script>

<style scoped>
/* Smooth transitions */
input:focus,
button:focus {
  outline: none;
}

/* Password visibility toggle animation */
button {
  transition: all 0.3s ease-out;
}

/* Loading spinner animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>