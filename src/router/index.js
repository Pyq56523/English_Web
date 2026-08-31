import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

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
      { path: 'grammar', name: 'Grammar', component: () => import('@/views/Grammar.vue') },
      { path: 'phrases', name: 'Phrase', component: () => import('@/views/Phrase.vue') },
      { path: 'stats', name: 'Statistics', component: () => import('@/views/Statistics.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 导航守卫：未登录访问受保护页 → 跳转登录
router.beforeEach((to) => {
  if (to.meta.public) return true
  const userStore = useUserStore()
  if (!userStore.token) return { name: 'Login' }
  return true
})

export default router