<template>
  <el-header class="header">
    <div class="spacer" />
    <el-dropdown @command="onCommand">
      <span class="user">
        <span class="avatar">{{ (userStore.user?.username || 'U').charAt(0).toUpperCase() }}</span>
        <span class="name">{{ userStore.user?.username || '未登录' }}</span>
        <el-icon class="arrow"><ArrowDown /></el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </el-header>
</template>

<script setup>
import { ArrowDown } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

function onCommand(cmd) {
  if (cmd === 'logout') {
    userStore.logout()
    router.push('/login')
  }
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background: #fff;
  border-bottom: 1px solid #eef1f6;
  height: 64px;
}
.user {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 999px;
  transition: background 0.2s;
}
.user:hover {
  background: #f4f5ff;
}
.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: #fff;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
}
.name {
  font-size: 14px;
  font-weight: 500;
  color: #1f2430;
}
.arrow {
  color: #9aa3b2;
  font-size: 12px;
}
</style>