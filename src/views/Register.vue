<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="brand">
        <span class="badge">E</span>
        <span class="brand-text">English Learner</span>
      </div>
      <h2 class="title">创建账号 ✨</h2>
      <p class="subtitle">只需几秒，开启你的每日词汇旅程</p>

      <el-form :model="form" :rules="rules" ref="formRef" class="form" @submit.prevent="onSubmit">
        <el-form-item prop="username">
          <el-input v-model="form.username" size="large" placeholder="用户名（至少 3 个字符）"
            :prefix-icon="User" />
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model="form.email" size="large" placeholder="邮箱 example@mail.com"
            :prefix-icon="Message" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" size="large" type="password" placeholder="密码（至少 6 位）"
            show-password :prefix-icon="Lock" />
        </el-form-item>
        <el-button type="primary" size="large" class="full" round :loading="loading" @click="onSubmit">
          注册
        </el-button>
      </el-form>

      <div class="footer">
        已有账号？
        <router-link to="/login">去登录</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, Message } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref()
const form = reactive({ username: '', email: '', password: '' })
const loading = ref(false)

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '用户名至少 3 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少 6 位', trigger: 'blur' }
  ]
}

async function onSubmit() {
  formRef.value?.validate((valid) => { if (!valid) return })
  if (!form.username || !form.email || !form.password) {
    ElMessage.warning('请填写完整信息')
    return
  }
  loading.value = true
  try {
    await userStore.register(form)
    ElMessage.success('注册成功，请登录')
    router.push('/login')
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
  padding: 24px;
  background:
    radial-gradient(40rem 28rem at 12% 12%, rgba(99, 102, 241, 0.14), transparent 60%),
    radial-gradient(36rem 26rem at 88% 90%, rgba(34, 197, 94, 0.12), transparent 60%),
    linear-gradient(150deg, #eef0ff 0%, #f5f3ff 50%, #eef7ff 100%);
}
.auth-card {
  width: 400px;
  max-width: 92vw;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  border-radius: 20px;
  padding: 40px 38px;
  box-shadow: 0 20px 60px rgba(79, 70, 229, 0.14);
  border: 1px solid rgba(226, 227, 255, 0.9);
}
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
}
.badge {
  width: 44px;
  height: 44px;
  border-radius: 13px;
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
  font-size: 20px;
  font-weight: 800;
  color: #1f2430;
}
.title {
  margin: 0 0 6px;
  font-size: 26px;
  font-weight: 800;
  color: #1f2430;
}
.subtitle {
  margin: 0 0 26px;
  color: #8a93a6;
  font-size: 14px;
}
.form :deep(.el-input__wrapper) {
  border-radius: 12px;
  padding: 4px 14px;
}
.full {
  width: 100%;
  margin-top: 6px;
  height: 46px;
  font-weight: 600;
}
.footer {
  margin-top: 20px;
  text-align: center;
  color: #8a93a6;
  font-size: 14px;
}
.footer a {
  color: #4f46e5;
  font-weight: 600;
  text-decoration: none;
}
</style>