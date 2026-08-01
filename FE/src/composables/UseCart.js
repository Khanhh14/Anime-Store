import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// Tạo state cart ở ngoài hàm useCart để dùng chung (Shared State) giữa Header và các trang khác
const cart = ref([]);

export function useCart(apiUrl = 'http://localhost:3000/api') {
  const router = useRouter();
  const authStore = useAuthStore();

  const quantity = ref(1);
  const isSubmitting = ref(false);
  const cartMessage = ref('');
  const isSuccess = ref(true);

  // 1. Tính tổng số lượng tất cả mặt hàng trong giỏ
  const cartCount = computed(() => {
    if (!cart.value || !Array.isArray(cart.value)) return 0;
    return cart.value.reduce((total, item) => total + (item.quantity || 1), 0);
  });

  // 2. Hàm gọi API lấy danh sách giỏ hàng từ Server
  const fetchCart = async () => {
    const token = authStore.token;
    if (!token) {
      cart.value = [];
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/cart`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Giả định backend trả về data.cart hoặc data.data hoặc mảng data
        cart.value = data.cart || data.data || data || [];
      } else if (response.status === 401) {
        authStore.logout();
        cart.value = [];
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách giỏ hàng:", error);
    }
  };

  const increaseQuantity = (stock) => {
    if (quantity.value < stock) quantity.value++;
  };

  const decreaseQuantity = () => {
    if (quantity.value > 1) quantity.value--;
  };

  // 3. Hàm Thêm vào giỏ hàng
  const handleAddToCart = async (productId, stock) => {
    if (!productId || stock <= 0) return;

    isSubmitting.value = true;
    cartMessage.value = '';

    const token = authStore.token; 

    if (!token) {
      isSuccess.value = false;
      cartMessage.value = "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!";
      isSubmitting.value = false;
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: quantity.value
        })
      });

      if (response.status === 401) {
        isSuccess.value = false;
        cartMessage.value = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!";
        
        authStore.logout(); 
        cart.value = [];
        
        setTimeout(() => {
          if (router) router.push({ name: 'login' });
        }, 2000);
        return;
      }

      const data = await response.json();
      if (data.success) {
        isSuccess.value = true;
        cartMessage.value = data.message || "Thêm vào giỏ hàng thành công!";
        
        // CẬP NHẬT LẠI GIỎ HÀNG NGAY KHI THÊM THÀNH CÔNG
        await fetchCart();
      } else {
        isSuccess.value = false;
        cartMessage.value = data.message || "Thêm vào giỏ hàng thất bại.";
      }
    } catch (error) {
      console.error("Lỗi kết nối giỏ hàng:", error);
      isSuccess.value = false;
      cartMessage.value = "Không thể kết nối đến máy chủ backend!";
    } finally {
      isSubmitting.value = false;
      setTimeout(() => { cartMessage.value = ''; }, 3000);
    }
  };

  const handleBuyNow = async (productId, stock) => {
    await handleAddToCart(productId, stock);
    if (isSuccess.value && router) {
      router.push({ name: 'cart' });
    }
  };

  // Tự động load giỏ hàng lần đầu khi component xài Hook này mount
  onMounted(() => {
    if (authStore.token && cart.value.length === 0) {
      fetchCart();
    }
  });

  return {
    cart,           // Danh sách giỏ hàng
    cartCount,      // Tổng số lượng item để hiển thị badge
    quantity,
    isSubmitting,
    cartMessage,
    isSuccess,
    fetchCart,      // Hàm cập nhật lại giỏ hàng
    increaseQuantity,
    decreaseQuantity,
    handleAddToCart,
    handleBuyNow
  };
}