import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // Tự động cuộn lên đầu trang khi chuyển Route
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../components/Auth/login.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../components/Auth/register.vue'),
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../components/Auth/ForgotPassword.vue'),
    },
    {
      path: '/wishlist',
      name: 'wishlist',
      component: () => import('../components/DashBoard/WishListUser.vue')
    },
    {
      path: '/anime',
      name: 'anime',
      component: () => import('../components/Home/Anime.vue'), 
    },
    {
      path: '/anime/:slug',
      name: 'anime-detail',
      component: () => import('../components/Home/Anime.vue'), 
    },
    // =======================================================================
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true }, 
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue'),
    },
    {
      path: '/collections',
      name: 'collections',
      component: () => import('../views/CollectionsView.vue'),
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../views/CheckoutView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/product/:id',
      name: 'DetailProducts',
      component: () => import('../components/Collections/DetailProducts.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminDashboardView.vue'), 
      meta: { requiresAdmin: true } 
    },
    // Trỏ các đường dẫn không tồn tại về trang chủ
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
})

// Navigation Guard (Bảo vệ Route)
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const token = authStore.token || localStorage.getItem('token')
  const user = authStore.user

  // 1. Kiểm tra Quyền Admin
  if (to.meta.requiresAdmin) {
    if (!token || !user) {
      alert('Vui lòng đăng nhập tài khoản Quản trị viên!')
      return next({ name: 'login' })
    }

    if (user.role === 'admin') {
      return next() 
    } else {
      alert('Bạn không có quyền truy cập vào khu vực quản trị!')
      return next({ name: 'home' }) 
    }
  } 

  // 2. Kiểm tra Yêu cầu Đăng nhập thông thường (Ví dụ: Checkout, Dashboard)
  if (to.meta.requiresAuth && !token) {
    alert('Vui lòng đăng nhập để tiếp tục!')
    return next({ name: 'login' })
  }

  // Cho phép truy cập bình thường
  next() 
})

export default router