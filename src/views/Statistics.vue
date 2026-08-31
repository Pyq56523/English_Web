<template>
  <div class="page-container stats">
    <div class="head">
      <h2 class="title">学习统计</h2>
      <StreakBadge :days="stats?.streak?.current_streak_days || 0" />
    </div>

    <el-card :body-style="{ padding: 0 }" class="stat-grid">
      <div class="stat-cell">
        <span class="stat-icon">📚</span>
        <el-statistic title="累计已学" :value="stats?.total?.words_learned || 0" />
      </div>
      <div class="stat-cell mastered">
        <span class="stat-icon">🏆</span>
        <el-statistic title="累计掌握" :value="stats?.total?.words_mastered || 0" />
      </div>
      <div class="stat-cell">
        <span class="stat-icon">🔁</span>
        <el-statistic title="今日复习" :value="stats?.today?.reviewed || 0" />
      </div>
      <div class="stat-cell accurate">
        <span class="stat-icon">🎯</span>
        <el-statistic title="今日准确率" :value="formatPercent(stats?.today?.accuracy_rate)" />
      </div>
    </el-card>

    <el-card class="heatmap-card" body-class="heatmap-body">
      <div class="heatmap-head">
        <span class="heatmap-title">🔥 近 365 天学习热力图</span>
        <span class="heatmap-sub">最长连续打卡 {{ stats?.streak?.max_streak_days || 0 }} 天</span>
      </div>
      <Heatmap :dates="heatmap.dates" :counts="heatmap.counts" />
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Heatmap from '@/components/common/Heatmap.vue'
import StreakBadge from '@/components/common/StreakBadge.vue'
import { getDashboardStats, getHeatmap } from '@/api/stats'
import { formatPercent } from '@/utils/format'

const stats = ref(null)
const heatmap = ref({ dates: [], counts: [] })

onMounted(async () => {
  stats.value = await getDashboardStats()
  heatmap.value = await getHeatmap()
})
</script>

<style scoped>
.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.stat-grid {
  border-radius: 16px;
  border: 1px solid #eef1f6;
  margin-bottom: 22px;
}
.stat-grid :deep(.el-card__body) {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}
.stat-cell {
  padding: 22px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.stat-cell + .stat-cell {
  border-left: 1px solid #eef1f6;
}
.stat-icon {
  font-size: 26px;
  margin-bottom: 6px;
}
.stat-cell :deep(.el-statistic__head) {
  color: #8a93a6;
  font-size: 13px;
  margin-bottom: 2px;
}
.stat-cell :deep(.el-statistic__content) {
  font-size: 28px;
  font-weight: 800;
  color: #4f46e5;
}
.stat-cell.mastered :deep(.el-statistic__content) { color: #22c55e; }
.stat-cell.accurate :deep(.el-statistic__content) { color: #f59e0b; }
.heatmap-card {
  border-radius: 16px;
  border: 1px solid #eef1f6;
}
.heatmap-card :deep(.el-card__body.heatmap-body) {
  padding: 24px;
}
.heatmap-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.heatmap-title {
  font-weight: 700;
  font-size: 16px;
}
.heatmap-sub {
  color: #9aa3b2;
  font-size: 13px;
}
@media (max-width: 720px) {
  .stat-grid :deep(.el-card__body) {
    grid-template-columns: repeat(2, 1fr);
  }
  .stat-cell:nth-child(2n) {
    border-left: 1px solid #eef1f6;
  }
  .stat-cell + .stat-cell {
    border-left: none;
  }
}
</style>