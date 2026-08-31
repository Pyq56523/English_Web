<template>
  <div class="auth-page">
    <div class="brand-panel">
      <div class="brand">
        <span class="badge">E</span>
        <span class="brand-text">English Learner</span>
      </div>
      <p class="tagline">把背单词，变成每天都会坚持下去的小习惯。</p>
    </div>

    <div class="auth-card">
      <h2 class="title">欢迎回来</h2>
      <p class="subtitle">登录你的账号，继续今日学习</p>
      <el-form :model="form" @submit.prevent="onSubmit">
        <el-form-item>
          <el-input v-model="form.username" size="large" placeholder="用户名或邮箱" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.password" size="large" type="password" placeholder="密码" show-password />
        </el-form-item>
        <el-button type="primary" size="large" class="full" round :loading="loading" @click="onSubmit">
          登录
        </el-button>
      </el-form>
      <div class="footer">
        还没有账号？
        <router-link to="/register">立即注册</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const form = reactive({ username: '', password: '' })
const loading = ref(false)

async function onSubmit() {
  if (!form.username || !form.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }
  loading.value = true
  try {
    await userStore.login(form)
    router.push('/')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 64px;
  padding: 24px;
  background: linear-gradient(140deg, #eef0ff 0%, #f5f3ff 45%, #eef7ff 100%);
}
.brand-panel {
  max-width: 340px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}
.badge {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: #fff;
  font-weight: 800;
  font-size: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.35);
}
.brand-text {
  font-size: 22px;
  font-weight: 800;
  color: #1f2430;
}
.tagline {
  margin-top: 18px;
  color: #5b5f6e;
  font-size: 16px;
  line-height: 1.7;
}
.auth-card {
  width: 380px;
  background: #fff;
  border-radius: 20px;
  padding: 36px 32px;
  box-shadow: 0 20px 60px rgba(30, 41, 59, 0.1);
  border: 1px solid #eef1f6;
}
.title {
  margin: 0 0 4px;
  font-size: 24px;
  font-weight: 800;
  color: #1f2430;
}
.subtitle {
  margin: 0 0 24px;
  color: #8a93a6;
  font-size: 14px;
}
.full {
  width: 100%;
}
.footer {
  margin-top: 16px;
  text-align: center;
  color: #8a93a6;
  font-size: 14px;
}
.footer a {
  color: #4f46e5;
  font-weight: 600;
  text-decoration: none;
}
@media (max-width: 720px) {
  .auth-page { flex-direction: column; gap: 32px; }
  .brand-panel { text-align: center; }
  .brand { justify-content: center; }
}
</style>