<template>
  <div class="page-container settings">
    <h2 class="title">学习设置</h2>

    <!-- 每日学习目标 -->
    <el-card shadow="never" class="set-card">
      <div class="set-head">
        <div class="set-icon">🎯</div>
        <div class="set-meta">
          <div class="set-name">每日学习目标</div>
          <div class="set-desc">设置每天固定学习多少个单词，作为今日学习进度的目标参考。</div>
        </div>
      </div>
      <div class="set-control">
        <el-input-number
          v-model="daily"
          :min="1"
          :max="200"
          :step="5"
          :precision="0"
          size="large"
          @change="onDailyChange"
        />
        <span class="unit">个 / 天</span>
        <el-button round type="primary" @click="saveDaily">保存目标</el-button>
      </div>
    </el-card>

    <!-- 页面模式 -->
    <el-card shadow="never" class="set-card">
      <div class="set-head">
        <div class="set-icon">🌗</div>
        <div class="set-meta">
          <div class="set-name">页面模式</div>
          <div class="set-desc">切换白天 / 夜晚模式，切换后即时生效并自动保存。</div>
        </div>
      </div>
      <div class="set-control">
        <el-radio-group v-model="theme" size="large" @change="onThemeChange">
          <el-radio-button value="light">☀️ 白天模式</el-radio-button>
          <el-radio-button value="dark">🌙 夜晚模式</el-radio-button>
        </el-radio-group>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { ElMessage } from 'element-plus'

const settings = useSettingsStore()
const daily = ref(settings.dailyTarget)
const theme = ref(settings.theme)

function saveDaily() {
  settings.setDailyTarget(daily.value)
  ElMessage.success(`每日学习目标已设为 ${settings.dailyTarget} 个`)
}

function onDailyChange() {
  // 输入变化即保存，保证刷新后仍沿用
  settings.setDailyTarget(daily.value)
}

function onThemeChange() {
  settings.setTheme(theme.value)
  ElMessage.success(theme.value === 'dark' ? '已切换到夜晚模式' : '已切换到白天模式')
}
</script>

<style scoped>
.settings {
  max-width: 760px;
  margin: 0 auto;
}
.title {
  margin: 0 0 22px;
}
.set-card {
  border-radius: 16px;
  border: 1px solid #eef1f6;
  margin-bottom: 20px;
  background: var(--app-card, #fff);
}
.set-card :deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 22px 26px;
}
.set-head {
  display: flex;
  align-items: center;
  gap: 16px;
}
.set-icon {
  width: 48px;
  height: 48px;
  border-radius: 13px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: var(--app-fill-soft, #f4f5ff);
  flex-shrink: 0;
}
.set-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.set-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--app-text, #1f2430);
}
.set-desc {
  font-size: 13px;
  color: var(--app-text-secondary, #8a93a6);
}
.set-control {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}
.unit {
  font-size: 14px;
  color: var(--app-text-secondary, #8a93a6);
}
</style>