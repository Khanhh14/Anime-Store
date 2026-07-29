import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

export const toastOptions = {
  position: 'top-right', // 👈 Đổi từ 'bottom-right' sang 'top-right' (Trên cùng bên phải)
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true
}

export default Toast