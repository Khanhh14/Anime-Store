import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

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
    // ĐÃ CẬP NHẬT: Thêm route dành riêng cho trang quản trị Admin
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminDashboardView.vue'), 
      meta: { requiresAdmin: true } 
    },
  ],
})

// ĐÃ CẬP NHẬT: Middleware (Navigation Guard) kiểm tra quyền truy cập Admin tự động
router.beforeEach((to, from, next) => {
  
  if (to.meta.requiresAdmin) {
    const token = localStorage.getItem('token');
    const userStorage = localStorage.getItem('user');
    
    if (!token || !userStorage) {
      alert('Vui lòng đăng nhập tài khoản Quản trị viên!');
      return next({ name: 'login' });
    }

    try {
      const user = JSON.parse(userStorage);
      if (user && user.role === 'admin') {
        next(); 
      } else {
        alert('Bạn không có quyền truy cập vào khu vực quản trị!');
        next({ name: 'home' }); 
      }
    } catch (error) {
      console.error('Lỗi kiểm tra quyền Admin:', error);
      next({ name: 'login' });
    }
  } else {
    next(); 
  }
})

export default router