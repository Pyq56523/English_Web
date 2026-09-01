<template>
  <div class="page-container home">
    <!-- Hero 欢迎区 -->
    <section class="hero">
      <div class="hero-left">
        <h1 class="hello">
          欢迎回来，
          <span class="name">{{ userStore.user?.username || '同学' }}</span>
        </h1>
        <p class="sub">保持节奏，每天记一点，积少成多 🌱</p>
        <div class="cta">
          <el-button type="primary" size="large" round @click="$router.push('/learning')">
            🚀 开始今日学习
          </el-button>
          <el-button size="large" round @click="$router.push('/books')">选择单词书</el-button>
        </div>
      </div>
      <div class="hero-right">
        <StreakBadge :days="streak.current_streak_days" />
        <div class="hero-note">最长连续 {{ streak.max_streak_days }} 天</div>
      </div>
    </section>

    <!-- 今日概览 -->
    <section class="stat-grid">
      <el-card shadow="hover" class="stat-card new" body-class="stat-body">
        <div class="stat-icon">📖</div>
        <el-statistic title="今日新学 / 目标" :value="todayStats.learned">
          <template #suffix><span class="suffix">/ {{ settings.dailyTarget }}</span></template>
        </el-statistic>
      </el-card>
      <el-card shadow="hover" class="stat-card due" body-class="stat-body">
        <div class="stat-icon">🔁</div>
        <el-statistic title="今日复习" :value="todayStats.reviewed" />
      </el-card>
      <el-card shadow="hover" class="stat-card mastered" body-class="stat-body">
        <div class="stat-icon">🏆</div>
        <el-statistic title="已掌握" :value="totalStats.mastered" />
      </el-card>
    </section>

    <el-card class="progress-panel" body-class="progress-body">
      <div class="progress-head">
        <span class="prog-title">📌 今日词汇任务</span>
        <span class="prog-tip">完成全部卡片即可打卡</span>
      </div>
      <el-progress :percentage="computedProgress" :stroke-width="14" :show-text="false"
        class="prog-bar" />
      <div class="progress-foot">
        <span class="done-text">已完成 <b>{{ doneCount }}</b> / {{ totalCount }} 张</span>
        <el-button text type="primary" @click="$router.push('/learning')">去学习 →</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue'
import { useLearningStore } from '@/stores/learning'
import { useUserStore } from '@/stores/user'
import { useSettingsStore } from '@/stores/settings'
import StreakBadge from '@/components/common/StreakBadge.vue'
import { getDashboardStats } from '@/api/stats'

const learning = useLearningStore()
const userStore = useUserStore()
const settings = useSettingsStore()

// 每日打卡数据（复用 stats 接口）
const streak = reactive({ current_streak_days: 0, max_streak_days: 0 })
const todayStats = reactive({ learned: 0, reviewed: 0 })
const totalStats = reactive({ mastered: 0 })

const totalCount = computed(() => learning.queue.length)
const doneCount = computed(() => learning.queueIndex)
const computedProgress = computed(() =>
  totalCount.value > 0 ? Math.round((doneCount.value / totalCount.value) * 100) : 0
)

onMounted(async () => {
  settings.init()
  learning.fetchTodayCards()
  try {
    const stats = await getDashboardStats()
    if (stats?.streak) {
      streak.current_streak_days = stats.streak.current_streak_days || 0
      streak.max_streak_days = stats.streak.max_streak_days || 0
    }
    if (stats?.today) {
      todayStats.learned = stats.today.learned || 0
      todayStats.reviewed = stats.today.reviewed || 0
    }
    if (stats?.total) {
      totalStats.mastered = stats.total.words_mastered || 0
    }
  } catch (e) {
    /* 登录态正常时应可获取，静默处理 */
  }
})
</script>

<style scoped>
.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  background: linear-gradient(135deg, #eef0ff 0%, #f5f3ff 50%, #eef7ff 100%);
  border: 1px solid #e3e6ff;
  border-radius: 18px;
  padding: 32px 36px;
  margin-bottom: 22px;
  position: relative;
  overflow: hidden;
}
.hero::after {
  content: '';
  position: absolute;
  right: -60px;
  top: -60px;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.12), transparent 70%);
}
.hello {
  margin: 0 0 8px;
  font-size: 28px;
  font-weight: 800;
  color: #1f2430;
}
.hello .name {
  color: #4f46e5;
}
.sub {
  margin: 0 0 20px;
  color: #6b7280;
  font-size: 15px;
}
.cta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.hero-right {
  text-align: center;
  flex-shrink: 0;
}
.hero-note {
  margin-top: 10px;
  color: #8a93a6;
  font-size: 13px;
}
.stat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-bottom: 22px;
}
.stat-card {
  border-radius: 16px;
  border: 1px solid #eef1f6;
}
.stat-card :deep(.el-card__body.stat-body) {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 22px;
}
.stat-icon {
  font-size: 30px;
  width: 52px;
  height: 52px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  flex-shrink: 0;
}
.stat-card.new .stat-icon { background: #eef0ff; }
.stat-card.due .stat-icon { background: #fff4e5; }
.stat-card.mastered .stat-icon { background: #e8f8ee; }
.stat-card :deep(.el-statistic__head) {
  color: #8a93a6;
  font-size: 13px;
  margin-bottom: 2px;
}
.stat-card :deep(.el-statistic__content) {
  font-size: 28px;
  font-weight: 800;
}
.stat-card.new :deep(.el-statistic__content) { color: #4f46e5; }
.stat-card :deep(.el-statistic__content .suffix) {
  font-size: 16px;
  font-weight: 600;
  margin-left: 2px;
}
.stat-card.due :deep(.el-statistic__content) { color: #f59e0b; }
.stat-card.mastered :deep(.el-statistic__content) { color: #22c55e; }
.progress-panel {
  border-radius: 16px;
  border: 1px solid #eef1f6;
}
.progress-panel :deep(.el-card__body.progress-body) {
  padding: 24px;
}
.progress-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.prog-title {
  font-weight: 700;
  font-size: 16px;
}
.prog-tip {
  color: #9aa3b2;
  font-size: 12px;
}
.prog-bar :deep(.el-progress-bar__outer) {
  background: #eef1f6;
}
.progress-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}
.done-text {
  color: #8a93a6;
  font-size: 13px;
}
.done-text b {
  color: #4f46e5;
}
@media (max-width: 720px) {
  .hero { flex-direction: column; align-items: flex-start; }
  .stat-grid { grid-template-columns: 1fr; }
}
</style>