import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth' // 1. Import Pinia Auth Store của bạn

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
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
  ],
})


router.beforeEach((to, from, next) => {
  // Kiểm tra nếu route yêu cầu quyền admin
  if (to.meta.requiresAdmin) {
    
    const authStore = useAuthStore()
    
    const token = authStore.token || localStorage.getItem('token')
    const user = authStore.user

    
    if (!token || !user) {
      alert('Vui lòng đăng nhập tài khoản Quản trị viên!');
      return next({ name: 'login' })
    }

    
    if (user.role === 'admin') {
      next() 
    } else {
      alert('Bạn không có quyền truy cập vào khu vực quản trị!');
      next({ name: 'home' }) 
    }
  } else {
    next() 
  }
})

export default router