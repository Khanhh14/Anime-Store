<template>
  <div class="terms-container">
    <!-- Checkbox và Nhãn -->
    <label class="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer select-none">
      <input 
        type="checkbox" 
        v-model="isChecked"
        class="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500 cursor-pointer"
      />
      <span>
        Tôi đồng ý với 
        <a href="#" @click.prevent="openTerms" class="text-red-500 font-medium hover:underline">
          Điều khoản dịch vụ
        </a> 
        và 
        <a href="#" @click.prevent="openPrivacy" class="text-red-500 font-medium hover:underline">
          Chính sách bảo mật
        </a>
      </span>
    </label>

    <!-- Modal 1: Điều khoản dịch vụ (Bán Mô Hình Anime) -->
    <Teleport to="body">
      <div 
        v-if="showTermsModal" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity"
        @click.self="showTermsModal = false"
      >
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden border border-gray-100">
          <!-- Header -->
          <div class="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
            <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span></span> Điều khoản dịch vụ & Đặt hàng Mô hình
            </h3>
            <button @click="showTermsModal = false" class="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
          </div>
          
          <!-- Body -->
          <div class="p-6 overflow-y-auto space-y-4 text-sm text-gray-600 leading-relaxed">
            <section class="space-y-1">
              <h4 class="font-bold text-gray-800">1. Quy định về Hàng Pre-order (Đặt trước)</h4>
              <p>- Hàng Pre-order có thời gian phát hành dự kiến từ nhà sản xuất (Good Smile Company, Bandai, Kotobukiya...). Thời gian hàng về có thể trễ hơn dự kiến do lịch sản xuất hoặc vận chuyển quốc tế.</p>
              <p>- Số tiền cọc Pre-order sẽ **không được hoàn lại** nếu quý khách tự ý hủy đơn sau khi shop đã chốt đơn với nhà phân phối.</p>
            </section>

            <section class="space-y-1">
              <h4 class="font-bold text-gray-800">2. Cam kết Cam Kết Chính Hãng (Authentic)</h4>
              <p>- Shop cam kết 100% sản phẩm là **HÀNG CHÍNH HÃNG (Official/Authentic)** từ Nhật Bản và các nhà phân phối ủy quyền. Nói KHÔNG với hàng Bootleg / Fake / Figma nhái.</p>
            </section>

            <section class="space-y-1">
              <h4 class="font-bold text-gray-800">3. Chính sách Đổi trả & Kiểm hàng</h4>
              <p>- Khách hàng **bắt buộc phải quay video Unbox (mở hộp)** từ lúc kiện hàng còn nguyên niêm phong để làm bằng chứng khi có sự cố.</p>
              <p>- Các lỗi do nhà sản xuất (Mỗi mẫu bị lem sơn nhẹ, khớp hơi xê dịch trong tiêu chuẩn cho phép của nhà sản xuất) sẽ áp dụng theo quy chuẩn hỗ trợ của hãng.</p>
              <p>- Hỗ trợ đổi trả hoặc hoàn tiền 100% nếu mô hình bị gãy, gãy khớp, thiếu phụ kiện do vận chuyển hoặc giao sai mẫu.</p>
            </section>

            <section class="space-y-1">
              <h4 class="font-bold text-gray-800">4. Tình trạng Hộp (Box Condition)</h4>
              <p>- Shop luôn đóng gói xốp nổ (bubble wrap) và thùng carton 5 lớp cẩn thận. Tuy nhiên, tình trạng vỏ hộp bên ngoài có thể bị móp nhẹ trong quá trình vận chuyển quốc tế và không ảnh hưởng đến mô hình bên trong.</p>
            </section>
          </div>

          <!-- Footer -->
          <div class="px-6 py-3 border-t bg-gray-50 flex justify-end">
            <button 
              @click="showTermsModal = false" 
              class="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              Tôi đã hiểu & Đồng ý
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal 2: Chính sách bảo mật (Bán Mô Hình Anime) -->
    <Teleport to="body">
      <div 
        v-if="showPrivacyModal" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity"
        @click.self="showPrivacyModal = false"
      >
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden border border-gray-100">
          <!-- Header -->
          <div class="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
            <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span></span> Chính sách bảo mật thông tin
            </h3>
            <button @click="showPrivacyModal = false" class="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
          </div>

          <!-- Body -->
          <div class="p-6 overflow-y-auto space-y-4 text-sm text-gray-600 leading-relaxed">
            <section class="space-y-1">
              <h4 class="font-bold text-gray-800">1. Thu thập thông tin giao hàng</h4>
              <p>Để đảm bảo mô hình đến đúng tay bạn, chúng tôi thu thập các thông tin bao gồm: Họ tên, Số điện thoại, Địa chỉ nhận hàng và Email (để gửi thông báo lịch hàng về / mã vận đơn).</p>
            </section>

            <section class="space-y-1">
              <h4 class="font-bold text-gray-800">2. Bảo mật thông tin thanh toán & Đặt cọc</h4>
              <p>Mọi thông tin giao chuyển khoản ngân hàng hoặc thanh toán online của bạn đều được xử lý qua cổng thanh toán bảo mật. Shop không lưu trữ thông tin thẻ ngân hàng của khách hàng.</p>
            </section>

            <section class="space-y-1">
              <h4 class="font-bold text-gray-800">3. Thông báo lịch Hàng về (Pre-order Notification)</h4>
              <p>Email và Số điện thoại của bạn chỉ được sử dụng để:</p>
              <ul class="list-disc pl-5 space-y-1">
                <li>Xác nhận đơn hàng và tiền cọc.</li>
                <li>Gửi thông báo khi đơn hàng Pre-order về tới kho để bạn thanh toán phần còn lại.</li>
                <li>Cập nhật ưu đãi khuyến mãi (chỉ khi bạn đăng ký nhận tin).</li>
              </ul>
            </section>

            <section class="space-y-1">
              <h4 class="font-bold text-gray-800">4. Cam kết không chia sẻ thông tin</h4>
              <p>Chúng tôi tuyệt đối không bán, chia sẻ hoặc trao đổi thông tin cá nhân của Otaku / Wibu / Khách hàng cho bất kỳ bên thứ ba nào khác ngoài đơn vị vận chuyển (GHTK, GHN, Viettel Post...).</p>
            </section>
          </div>

          <!-- Footer -->
          <div class="px-6 py-3 border-t bg-gray-50 flex justify-end">
            <button 
              @click="showPrivacyModal = false" 
              class="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
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
import { ref } from 'vue'

const isChecked = ref(false)
const showTermsModal = ref(false)
const showPrivacyModal = ref(false)

const openTerms = () => {
  showTermsModal.value = true
}

const openPrivacy = () => {
  showPrivacyModal.value = true
}
</script>