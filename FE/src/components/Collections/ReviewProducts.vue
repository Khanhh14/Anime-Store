<template>
  <div class="mt-8">
    <!-- Tiêu đề & Thống kê điểm số tổng quan -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
      <div class="flex items-center gap-3">
        <span class="inline-block w-2 h-7 bg-gradient-to-b from-pink-500 to-rose-600 rounded-full shadow-sm"></span>
        <h3 class="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <font-awesome-icon :icon="['fas', 'comments']" class="text-pink-500 text-lg" />
          <span>Đánh Giá Từ Khách Hàng</span>
          <span class="text-slate-400 font-bold text-sm ml-1">({{ reviews.length }})</span>
        </h3>
      </div>

      <!-- Khối Thống Kê Điểm Số Tổng Quan -->
      <div v-if="reviews.length > 0" class="flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50/60 px-4 py-2.5 rounded-2xl border border-amber-200/60 shadow-sm w-fit">
        <div class="text-center">
          <span class="text-amber-500 font-black text-2xl leading-none">{{ averageRating }}</span>
          <span class="text-amber-400 text-xs font-bold block mt-0.5">/ 5.0</span>
        </div>
        <div class="h-8 w-px bg-amber-200/80 my-auto"></div>
        <div>
          <div class="flex items-center gap-1 text-amber-400 text-sm">
            <span v-for="star in 5" :key="star">
              <font-awesome-icon 
                :icon="star <= Math.round(averageRating) ? ['fas', 'star'] : ['far', 'star']" 
              />
            </span>
          </div>
          <p class="text-[11px] font-bold text-slate-500 mt-0.5">
            Dựa trên {{ reviews.length }} lượt đánh giá
          </p>
        </div>
      </div>
    </div>

    <!-- Trạng thái Đang Tải -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-12 text-slate-400 text-sm">
      <div class="w-8 h-8 border-3 border-pink-500 border-t-transparent rounded-full animate-spin mb-3"></div>
      <p class="font-medium">Đang tải trải nghiệm từ người mua...</p>
    </div>

    <!-- Trạng thái Chưa Có Đánh Giá -->
    <div v-else-if="reviews.length === 0" class="text-center py-12 px-4 bg-gradient-to-b from-slate-50/80 to-white rounded-3xl border border-dashed border-slate-200">
      <div class="w-16 h-16 bg-pink-50 text-pink-500 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 shadow-sm">
        <font-awesome-icon :icon="['fas', 'comments']" />
      </div>
      <p class="text-slate-700 font-bold text-base mb-1">Chưa có đánh giá nào cho sản phẩm này</p>
      <p class="text-slate-400 text-xs max-w-sm mx-auto">
        Hãy là người đầu tiên sở hữu sản phẩm và chia sẻ cảm nhận tuyệt vời của bạn với cộng đồng nhé!
      </p>
    </div>

    <!-- Danh Sách Đánh Giá -->
    <div v-else class="space-y-4">
      <div 
        v-for="review in reviews" 
        :key="review.id"
        class="group bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-pink-100 transition-all duration-300"
      >
        <div class="flex items-start justify-between gap-4">
          <!-- Thông tin User & Tên thật -->
          <div class="flex items-center gap-3.5">
            <!-- Avatar Tên Người Dùng -->
            <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 text-white font-extrabold flex items-center justify-center text-base shadow-md shadow-pink-500/20 flex-shrink-0 transform group-hover:scale-105 transition-transform duration-300">
              {{ getAvatarText(getUserDisplayName(review)) }}
            </div>
            
            <div>
              <div class="flex items-center gap-2">
                <h4 class="font-extrabold text-slate-800 text-sm tracking-tight">
                  {{ getUserDisplayName(review) }}
                </h4>
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <font-awesome-icon :icon="['fas', 'check']" class="text-[9px]" />
                  Đã mua hàng
                </span>
              </div>

              <!-- Ngôi Sao Đánh Giá -->
              <div class="flex items-center gap-1 text-amber-400 text-xs mt-1">
                <span v-for="star in 5" :key="star">
                  <font-awesome-icon 
                    :icon="star <= review.rating ? ['fas', 'star'] : ['far', 'star']" 
                  />
                </span>
                <span class="text-xs font-bold text-slate-400 ml-1.5">
                  ({{ review.rating }}/5)
                </span>
              </div>
            </div>
          </div>

          <!-- Thời gian đánh giá -->
          <span class="text-slate-400 text-xs font-medium bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 flex-shrink-0">
            {{ formatDate(review.created_at) }}
          </span>
        </div>

        <!-- Khối Lời Nhắn / Comment -->
        <div class="mt-4 pl-0 sm:pl-[58px]">
          <div class="bg-slate-50/80 rounded-xl p-3.5 border border-slate-100/80 group-hover:bg-pink-50/20 group-hover:border-pink-100/50 transition-colors">
            <p class="text-slate-700 text-sm leading-relaxed font-normal">
              {{ review.comment || 'Khách hàng không để lại bình luận chi tiết.' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ReviewProducts',
  props: {
    productId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      reviews: [],
      isLoading: false
    };
  },
  computed: {
    averageRating() {
      if (!this.reviews.length) return 0;
      const total = this.reviews.reduce((acc, item) => acc + Number(item.rating), 0);
      return (total / this.reviews.length).toFixed(1);
    }
  },
  watch: {
    productId: {
      immediate: true,
      handler(newId) {
        if (newId) {
          this.fetchReviews(newId);
        }
      }
    }
  },
  methods: {
    async fetchReviews(id) {
      this.isLoading = true;
      try {
        const response = await axios.get(`http://localhost:3000/api/reviews/product/${id}`);
        if (response.data && response.data.success) {
          this.reviews = response.data.data;
        }
      } catch (error) {
        console.error("Lỗi khi tải đánh giá:", error);
      } finally {
        this.isLoading = false;
      }
    },

    getUserDisplayName(review) {
      if (review.user_name) return review.user_name;
      if (review.user_username) return review.user_username;
      return `Khách hàng #${review.user_id}`;
    },

    getAvatarText(name) {
      if (!name) return 'K';
      return String(name).trim().charAt(0).toUpperCase();
    },

    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
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
</style>