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
      <div class="stat-card new">
        <div class="stat-icon">📖</div>
        <div>
          <div class="stat-num">{{ learning.summary.total_new }}</div>
          <div class="stat-label">今日新学</div>
        </div>
      </div>
      <div class="stat-card due">
        <div class="stat-icon">🔁</div>
        <div>
          <div class="stat-num">{{ learning.summary.total_due }}</div>
          <div class="stat-label">今日复习</div>
        </div>
      </div>
      <div class="stat-card mastered">
        <div class="stat-icon">🏆</div>
        <div>
          <div class="stat-num">{{ learning.summary.mastered }}</div>
          <div class="stat-label">已掌握</div>
        </div>
      </div>
    </section>

    <section class="progress-panel card">
      <div class="progress-head">
        <span class="prog-title">今日词汇任务</span>
        <span class="prog-tip">完成全部卡片即可打卡</span>
      </div>
      <el-progress :percentage="computedProgress" :stroke-width="14" :show-text="false" />
      <div class="progress-foot">
        <span>{{ doneCount }} / {{ totalCount }} 张</span>
        <el-button text type="primary" @click="$router.push('/learning')">去学习 →</el-button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue'
import { useLearningStore } from '@/stores/learning'
import { useUserStore } from '@/stores/user'
import StreakBadge from '@/components/common/StreakBadge.vue'
import { getDashboardStats } from '@/api/stats'

const learning = useLearningStore()
const userStore = useUserStore()

// 每日打卡数据（复用 stats 接口）
const streak = reactive({ current_streak_days: 0, max_streak_days: 0 })

const totalCount = computed(() => learning.queue.length)
const doneCount = computed(() => learning.queueIndex)
const computedProgress = computed(() =>
  totalCount.value > 0 ? Math.round((doneCount.value / totalCount.value) * 100) : 0
)

onMounted(async () => {
  learning.fetchTodayCards()
  try {
    const stats = await getDashboardStats()
    if (stats?.streak) {
      streak.current_streak_days = stats.streak.current_streak_days || 0
      streak.max_streak_days = stats.streak.max_streak_days || 0
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
  background: linear-gradient(135deg, #eef0ff 0%, #f5f3ff 50%, #eef7ff 100%);
  border: 1px solid #e3e6ff;
  border-radius: 18px;
  padding: 28px 32px;
  margin-bottom: 20px;
}
.hello {
  margin: 0 0 6px;
  font-size: 26px;
  font-weight: 800;
  color: #1f2430;
}
.hello .name {
  color: #4f46e5;
}
.sub {
  margin: 0 0 18px;
  color: #6b7280;
}
.cta {
  display: flex;
  gap: 12px;
}
.hero-right {
  text-align: center;
}
.hero-note {
  margin-top: 8px;
  color: #8a93a6;
  font-size: 13px;
}
.stat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}
.stat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #fff;
  border: 1px solid #eef1f6;
  border-radius: 14px;
  padding: 18px 20px;
  box-shadow: 0 2px 8px rgba(30, 41, 59, 0.05);
}
.stat-icon {
  font-size: 28px;
}
.stat-num {
  font-size: 26px;
  font-weight: 800;
}
.stat-card.new .stat-num { color: #4f46e5; }
.stat-card.due .stat-num { color: #f59e0b; }
.stat-card.mastered .stat-num { color: #22c55e; }
.stat-label {
  color: #8a93a6;
  font-size: 13px;
  margin-top: 2px;
}
.progress-panel {
  padding: 18px 20px;
}
.progress-head {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}
.prog-title {
  font-weight: 700;
}
.prog-tip {
  color: #9aa3b2;
  font-size: 12px;
}
.progress-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  color: #8a93a6;
  font-size: 13px;
}
</style>