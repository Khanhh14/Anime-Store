<template>
  <div 
    v-if="show" 
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" 
    @click.self="closeModal"
  >
    <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-5 transform transition-all">
      
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-neutral-100 pb-3">
        <h2 class="text-lg font-extrabold text-neutral-900 flex items-center gap-2">
          <span class="w-1.5 h-5 bg-[#de2053] rounded-full inline-block"></span>
          Thanh Toán Chuyển Khoản
        </h2>
        <button 
          type="button"
          @click="closeModal" 
          class="text-neutral-400 hover:text-neutral-600 text-2xl font-bold leading-none p-1 rounded-lg hover:bg-neutral-100 transition"
        >
          &times;
        </button>
      </div>

      <!-- Thông tin đơn hàng -->
      <div class="bg-neutral-50 rounded-xl p-4 text-sm space-y-2.5 border border-neutral-100">
        <div class="flex justify-between items-center">
          <span class="text-neutral-500 font-medium">Mã đơn hàng:</span>
          <strong class="text-neutral-800">#{{ orderId || '...' }}</strong>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-neutral-500 font-medium">Tổng tiền thanh toán:</span>
          <span class="font-black text-[#de2053] text-base">{{ formattedPrice }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-neutral-500 font-medium">Nội dung chuyển khoản:</span>
          <code class="font-black bg-rose-50 text-[#de2053] px-2.5 py-1 rounded-lg border border-rose-200 tracking-wider text-xs">
            {{ dynamicContent }}
          </code>
        </div>
      </div>

      <!-- Tabs chọn phương thức thanh toán -->
      <div>
        <label class="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
          Chọn phương thức quét QR
        </label>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="method in paymentMethods"
            :key="method.value"
            type="button"
            @click="selectMethod(method.value)"
            :class="[
              'py-2.5 px-1 text-xs font-bold rounded-xl border transition-all text-center',
              selectedMethod === method.value
                ? 'bg-[#de2053] text-white border-[#de2053] shadow-md shadow-rose-500/20'
                : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
            ]"
          >
            {{ method.label }}
          </button>
        </div>
      </div>

      <!-- Khung hiển thị Mã QR -->
      <div v-if="selectedMethod" class="flex flex-col items-center justify-center p-4 bg-neutral-50 rounded-2xl border border-neutral-100 min-h-[240px]">
        <h3 class="text-xs font-bold text-neutral-600 mb-3">
          Quét mã QR {{ getLabel(selectedMethod) }}
        </h3>
        
        <!-- Loading -->
        <div v-if="loading" class="text-center text-xs text-neutral-500 flex flex-col items-center gap-2 py-8">
          <div class="w-7 h-7 border-2 border-[#de2053] border-t-transparent rounded-full animate-spin"></div>
          <span>Đang tạo mã QR thanh toán...</span>
        </div>
        
        <!-- Ảnh QR -->
        <div v-else-if="qrCodeUrl" class="text-center space-y-2">
          <img 
            :src="qrCodeUrl" 
            alt="QR Code Thanh Toán" 
            class="w-48 h-48 object-contain rounded-xl border border-neutral-200 shadow-sm mx-auto bg-white p-2" 
          />
          <p class="text-[11px] text-neutral-500 font-medium">
            ⚠️ Vui lòng giữ nguyên nội dung <strong class="text-neutral-700">{{ dynamicContent }}</strong> khi chuyển khoản
          </p>
        </div>

        <!-- Lỗi không tạo được QR -->
        <div v-else class="text-center py-8">
          <p class="text-xs text-rose-500 font-semibold">Không thể tạo mã QR. Vui lòng thử lại sau.</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3 pt-1">
        <button 
          type="button"
          @click="closeModal" 
          class="flex-1 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-xl text-sm transition"
        >
          Đóng
        </button>
        <button 
          type="button"
          :disabled="!selectedMethod || loading"
          @click="handlePayment" 
          class="flex-1 py-3 bg-gradient-to-r from-[#de2053] to-[#e63968] hover:from-[#c21443] hover:to-[#de2053] text-white font-bold rounded-xl text-sm transition shadow-md shadow-rose-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Xác nhận đã thanh toán
        </button>
      </div>

    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PaymentModal',
  props: {
    show: { type: Boolean, required: true },
    order: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      paymentMethods: [
        { label: 'VietQR', value: 'credit_cash' },
        { label: 'Ví MoMo', value: 'momo' },
        { label: 'Ví ZaloPay', value: 'zalopay' }
      ],
      selectedMethod: 'credit_cash',
      qrCodeUrl: '',
      loading: false
    };
  },
  computed: {
    orderId() {
      return this.order?.id || this.order?.order_id || null;
    },
    amount() {
      return Number(this.order?.total_price || this.order?.total) || 0;
    },
    formattedPrice() {
      return this.amount.toLocaleString('vi-VN') + ' VNĐ';
    },
    dynamicContent() {
      return this.orderId ? `DH${this.orderId}` : 'DH00';
    }
  },
  watch: {
    show(newVal) {
      if (newVal && this.selectedMethod) {
        this.generateQRCode(this.selectedMethod);
      }
    },
    selectedMethod(newMethod) {
      if (newMethod && this.show) {
        this.generateQRCode(newMethod);
      }
    }
  },
  emits: ['close', 'payment-success'],
  methods: {
    closeModal() {
      this.$emit('close');
    },
    selectMethod(methodValue) {
      this.selectedMethod = methodValue;
    },
    getLabel(methodValue) {
      const found = this.paymentMethods.find(m => m.value === methodValue);
      return found ? found.label : methodValue;
    },
    getAuthHeaders() {
      const token = localStorage.getItem('token') || localStorage.getItem('user_token');
      return token ? { Authorization: `Bearer ${token}` } : {};
    },
    async generateQRCode(method) {
      if (!this.amount || this.amount <= 0) return;

      this.loading = true;
      this.qrCodeUrl = '';

      try {
        const payload = {
          type: method,
          soTaiKhoan: '1048929602',
          tenTaiKhoan: 'Tran Bao Khanh',
          soTien: this.amount,
          noiDung: this.dynamicContent,
          soDienThoai: '0363352990'
        };

        const response = await axios.post('http://localhost:3000/api/qr', payload);

        if (response.data.success && response.data.qr) {
          this.qrCodeUrl = response.data.qr;
        } else if (typeof response.data === 'string') {
          this.qrCodeUrl = response.data;
        } else {
          this.qrCodeUrl = '';
        }
      } catch (error) {
        console.error('Lỗi tạo mã QR:', error.response?.data || error.message);
        this.qrCodeUrl = '';
      } finally {
        this.loading = false;
      }
    },
    async handlePayment() {
      if (!this.selectedMethod) {
        alert('Vui lòng chọn phương thức thanh toán.');
        return;
      }

      if (!this.orderId) {
        alert('Không tìm thấy ID đơn hàng!');
        return;
      }

      try {
        const payload = {
          order_id: this.orderId,
          payment_method: this.selectedMethod,
          amount: this.amount,
          content: this.dynamicContent,
          status: 'pending'
        };

        // Gọi API với Auth Header để gửi Token JWT cho backend xác thực
        const response = await axios.post('http://localhost:3000/api/orders/payments', payload, {
          headers: this.getAuthHeaders()
        });

        if (response.data.success || response.data.payment_id || response.status === 200 || response.status === 201) {
          alert('Đã ghi nhận thanh toán! Hệ thống sẽ kiểm tra và xác nhận đơn hàng của bạn.');
          this.$emit('payment-success', response.data);
          this.closeModal();
        } else {
          alert('Tạo giao dịch thanh toán thất bại.');
        }
      } catch (error) {
        console.error('Lỗi khi lưu thanh toán:', error.response?.data || error.message);
        alert('Có lỗi xảy ra khi tạo thanh toán: ' + (error.response?.data?.message || 'Vui lòng thử lại!'));
      }
    }
  }
};
</script>