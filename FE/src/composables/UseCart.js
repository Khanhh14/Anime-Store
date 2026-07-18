import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; // 1. Import Auth Store vào đây

export function useCart(apiUrl) {
  const router = useRouter();
  const authStore = useAuthStore(); // 2. Kích hoạt Store
  
  const quantity = ref(1);
  const isSubmitting = ref(false);
  const cartMessage = ref('');
  const isSuccess = ref(true);

  const increaseQuantity = (stock) => {
    if (quantity.value < stock) quantity.value++;
  };

  const decreaseQuantity = () => {
    if (quantity.value > 1) quantity.value--;
  };

  const handleAddToCart = async (productId, stock) => {
    if (!productId || stock <= 0) return;

    isSubmitting.value = true;
    cartMessage.value = '';

    // 3. Lấy token trực tiếp từ Pinia thay vì LocalStorage
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
        
        // 4. Gọi hàm logout của Pinia (Nó sẽ tự xóa sạch LocalStorage cho bạn)
        authStore.logout(); 
        
        setTimeout(() => {
          router.push({ name: 'login' });
        }, 2000);
        return;
      }

      const data = await response.json();
      if (data.success) {
        isSuccess.value = true;
        cartMessage.value = data.message || "Thêm vào giỏ hàng thành công!";
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
    if (isSuccess.value) {
      router.push({ name: 'cart' });
    }
  };

  return {
    quantity,
    isSubmitting,
    cartMessage,
    isSuccess,
    increaseQuantity,
    decreaseQuantity,
    handleAddToCart,
    handleBuyNow
  };
}