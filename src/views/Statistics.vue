<template>
  <div class="page-container stats">
    <div class="head">
      <h2 class="title">学习统计</h2>
      <StreakBadge :days="stats?.streak?.current_streak_days || 0" />
    </div>

    <section class="stat-grid">
      <div class="stat-card">
        <div class="stat-icon">📚</div>
        <div class="v">{{ stats?.total?.words_learned || 0 }}</div>
        <div class="l">已学单词</div>
      </div>
      <div class="stat-card mastered">
        <div class="stat-icon">🏆</div>
        <div class="v">{{ stats?.total?.words_mastered || 0 }}</div>
        <div class="l">已掌握</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🔁</div>
        <div class="v">{{ stats?.today?.reviewed || 0 }}</div>
        <div class="l">今日复习</div>
      </div>
      <div class="stat-card accurate">
        <div class="stat-icon">🎯</div>
        <div class="v">{{ formatPercent(stats?.today?.accuracy_rate) }}</div>
        <div class="l">今日准确率</div>
      </div>
    </section>

    <section class="heatmap-card card">
      <div class="heatmap-head">
        <span class="heatmap-title">近 365 天学习热力图</span>
        <span class="heatmap-sub">连续打卡 {{ stats?.streak?.max_streak_days || 0 }} 天</span>
      </div>
      <Heatmap :dates="heatmap.dates" :counts="heatmap.counts" />
    </section>
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
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}
.stat-card {
  background: #fff;
  border: 1px solid #eef1f6;
  border-radius: 14px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(30, 41, 59, 0.05);
}
.stat-icon {
  font-size: 26px;
}
.stat-card .v {
  font-size: 28px;
  font-weight: 800;
  color: #4f46e5;
  margin: 6px 0 2px;
}
.stat-card.mastered .v { color: #22c55e; }
.stat-card.accurate .v { color: #f59e0b; }
.stat-card .l {
  color: #8a93a6;
  font-size: 13px;
}
.heatmap-card {
  padding: 20px;
}
.heatmap-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.heatmap-title {
  font-weight: 700;
}
.heatmap-sub {
  color: #9aa3b2;
  font-size: 13px;
}
</style>