<template>
  <!-- Modal Đánh Giá -->
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
    <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-fadeIn">
      <!-- Header -->
      <div class="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
        <h3 class="text-lg font-bold text-slate-800">Đánh Giá Sản Phẩm</h3>
        <button @click="close" class="text-slate-400 hover:text-slate-600 text-xl font-bold transition-colors">&times;</button>
      </div>

      <div v-if="product" class="space-y-5">
        <!-- Thông tin sản phẩm -->
        <div class="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div class="w-12 h-12 bg-white rounded-lg overflow-hidden border border-slate-200 flex-shrink-0 shadow-sm">
            <img v-if="product.image" :src="`http://localhost:3000/uploads/${product.image}`" class="w-full h-full object-cover" />
          </div>
          <p class="text-sm font-bold text-slate-700 line-clamp-2">{{ product.name }}</p>
        </div>

        <!-- Chọn số sao (Rating) -->
        <div class="text-center py-1">
          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Số sao đánh giá</label>
          <div class="flex justify-center items-center gap-2">
            <button 
              v-for="star in 5" 
              :key="star"
              type="button"
              @click="rating = star"
              class="text-3xl transition-all duration-200 hover:scale-125 active:scale-110 focus:outline-none"
            >
              <span v-if="star <= rating" class="text-amber-400 drop-shadow-sm">★</span>
              <span v-else class="text-slate-200 hover:text-amber-200">★</span>
            </button>
          </div>
          <p v-if="rating > 0" class="text-xs font-semibold text-amber-500 mt-1.5 animate-fadeIn">
            {{ rating === 5 ? 'Tuyệt vời' : rating === 4 ? 'Rất tốt' : rating === 3 ? 'Bình thường' : rating === 2 ? 'Kém' : 'Rất kém' }}
          </p>
        </div>

        <!-- Nội dung bình luận -->
        <div>
          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nội dung bình luận</label>
          <textarea 
            v-model="comment"
            rows="3"
            placeholder="Cảm nhận của bạn về sản phẩm này..."
            class="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all resize-none"
          ></textarea>
        </div>

        <!-- Các nút hành động -->
        <div class="flex justify-end gap-3 pt-2">
          <button 
            @click="close"
            class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-sm transition"
          >
            Hủy
          </button>
          <button 
            @click="submitReview"
            :disabled="isSubmitting"
            class="px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-bold text-sm shadow-sm active:scale-95 disabled:opacity-50 flex items-center gap-2 transition"
          >
            <span v-if="isSubmitting" class="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            <span>Gửi đánh giá</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useToast, POSITION } from 'vue-toastification';

export default {
  name: 'ReviewModal',
  props: {
    isOpen: { type: Boolean, default: false },
    product: { type: Object, default: null }
  },
  setup() {
    // Khởi tạo instance của vue-toastification
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      rating: 0,
      comment: '',
      isSubmitting: false
    };
  },
  watch: {
    isOpen(val) {
      if (val) {
        this.rating = 0;
        this.comment = '';
      }
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },

    async submitReview() {
      if (this.rating === 0) {
        // Ép vị trí hiển thị ở góc trên bên phải (TOP_RIGHT)
        this.toast.error("Vui lòng chọn ít nhất 1 sao để đánh giá!", {
          position: POSITION.TOP_RIGHT
        });
        return;
      }

      this.isSubmitting = true;
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user.id || user.user_id;

        const payload = {
          user_id: userId,
          product_id: this.product.product_id || this.product.id,
          rating: this.rating,
          comment: this.comment
        };

        const response = await axios.post(
          'http://localhost:3000/api/reviews',
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data && response.data.success) {
          this.toast.success("Đánh giá sản phẩm thành công!", {
            position: POSITION.TOP_RIGHT
          });
          this.$emit('success');
          
          setTimeout(() => {
            this.close();
          }, 300);
        } else {
          this.toast.error("Không thể gửi đánh giá: " + (response.data.message || "Lỗi không xác định"), {
            position: POSITION.TOP_RIGHT
          });
        }
      } catch (error) {
        console.error("Lỗi khi gửi đánh giá:", error);
        this.toast.error(error.response?.data?.message || "Không thể gửi đánh giá, vui lòng thử lại sau!", {
          position: POSITION.TOP_RIGHT
        });
      } finally {
        this.isSubmitting = false;
      }
    }
  }
}
</script>

<style scoped>
.animate-spin {
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}
</style>