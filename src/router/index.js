import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Home from '@/components/HomePage.vue'
import LoginForm from '@/components/LoginformPage.vue'
import Profile from '@/components/ProfilePage.vue'
import Register from '@/components/RegisterPage.vue'
import ProfileEdit from '@/components/ProfileeditPage.vue'

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/login',
    component: LoginForm,
    meta: { requiresGuest: true } // добавляем мета-поле для гостей
  },
  {
    path: '/register',
    component: Register,
    meta: { requiresGuest: true } // добавляем мета-поле для гостей
  },
  {
    path: '/profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile/edit',
    component: ProfileEdit,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Проверяем авторизацию для защищенных маршрутов
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  }
  // Проверяем маршруты для гостей (логин/регистрация)
  else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/profile')
  }
  // В остальных случаях разрешаем переход
  else {
    next()
  }
})

export default router
