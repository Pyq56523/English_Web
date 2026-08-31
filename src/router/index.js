import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { meApi } from '@/api/auth'

// 本次会话内的 token 校验结果缓存（只向后端校验一次，避免每次跳转都请求）
let validatedToken = null

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { public: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: { public: true }
  },
  {
    path: '/',
    component: () => import('@/components/layout/AppLayout.vue'),
    children: [
      { path: '', name: 'Home', component: () => import('@/views/Home.vue') },
      { path: 'books', name: 'WordBooks', component: () => import('@/views/WordBooks.vue') },
      { path: 'learning', name: 'Learning', component: () => import('@/views/Learning.vue') },
      { path: 'settings', name: 'Settings', component: () => import('@/views/Settings.vue') },
      { path: 'stats', name: 'Statistics', component: () => import('@/views/Statistics.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 导航守卫：未登录访问受保护页 → 跳转登录
router.beforeEach(async (to) => {
  if (to.meta.public) return true
  const userStore = useUserStore()

  // 无 token → 登出并回登录页
  if (!userStore.token) {
    userStore.logout()
    return { name: 'Login' }
  }

  // 本会话内未校验过该 token，则向后端 /auth/me 校验其有效性
  if (validatedToken !== userStore.token) {
    try {
      const user = await meApi()
      userStore.user = user
      localStorage.setItem('el_user', JSON.stringify(user))
      validatedToken = userStore.token
    } catch (e) {
      validatedToken = null
      userStore.logout()
      return { name: 'Login' }
    }
  }
  return true
})

export default router