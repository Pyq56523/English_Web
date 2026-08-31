<template>
  <el-aside width="220px" class="sidebar">
    <div class="logo">
      <span class="logo-badge">E</span>
      <span class="logo-text">English Learner</span>
    </div>
    <el-menu :default-active="$route.path" router class="menu">
      <el-menu-item index="/">
        <el-icon><HomeFilled /></el-icon>
        <span>学习仪表盘</span>
      </el-menu-item>
      <el-menu-item index="/books">
        <el-icon><Notebook /></el-icon>
        <span>选择单词书</span>
      </el-menu-item>
      <el-menu-item index="/learning">
        <el-icon><Reading /></el-icon>
        <span>开始学习</span>
      </el-menu-item>
      <el-menu-item index="/grammar">
        <el-icon><EditPen /></el-icon>
        <span>语法课</span>
      </el-menu-item>
      <el-menu-item index="/phrases">
        <el-icon><ChatDotRound /></el-icon>
        <span>常用短语</span>
      </el-menu-item>
      <el-menu-item index="/stats">
        <el-icon><DataAnalysis /></el-icon>
        <span>学习统计</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup>
import {
  HomeFilled,
  Notebook,
  Reading,
  EditPen,
  ChatDotRound,
  DataAnalysis
} from '@element-plus/icons-vue'
</script>

<style scoped>
.sidebar {
  background: #fff;
  border-right: 1px solid #eef1f6;
}
.logo {
  height: 64px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 20px;
}
.logo-badge {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: #fff;
  font-weight: 800;
  font-size: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(79, 70, 229, 0.35);
}
.logo-text {
  font-size: 16px;
  font-weight: 700;
  color: #1f2430;
}
.menu {
  border-right: none;
  padding: 8px;
}
.menu :deep(.el-menu-item) {
  border-radius: 10px;
  margin-bottom: 4px;
  height: 46px;
}
.menu :deep(.el-menu-item.is-active) {
  background: #eef0ff;
  color: #4f46e5;
  font-weight: 600;
}
.menu :deep(.el-menu-item:hover) {
  background: #f4f5ff;
}
</style>