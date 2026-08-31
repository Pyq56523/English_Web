<template>
  <div class="page-container learning">
    <div class="head">
      <h2 class="title">今日学习</h2>
      <WordProgress :total="learning.queue.length" :done="learning.queueIndex" />
    </div>

    <div v-if="learning.current" class="stage">
      <div class="meta">
        <span class="chip new" v-if="!learning.current.record_id || learning.current.repetition === 0">新词</span>
        <span class="chip due" v-else>复习</span>
        <span class="count">{{ learning.queueIndex + 1 }} / {{ learning.queue.length }}</span>
      </div>

      <WordCard :card="learning.current" :flipped="flipped" @flip="flipped = !flipped" />

      <transition name="fade">
        <div v-if="flipped" class="stage-bottom">
          <ReviewRating @rate="onRate" />
        </div>
        <div v-else class="tip">点击卡片翻面，回忆它的释义</div>
      </transition>
    </div>

    <div v-else class="done empty-wrap">
      <el-empty :description="learning.queue.length ? '今日卡片已全部完成' : '今天还没有待学卡片'">
        <el-button type="primary" round size="large" @click="$router.push('/')">
          返回首页
        </el-button>
      </el-empty>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import WordCard from '@/components/word/WordCard.vue'
import ReviewRating from '@/components/word/ReviewRating.vue'
import WordProgress from '@/components/word/WordProgress.vue'
import { useLearningStore } from '@/stores/learning'

const learning = useLearningStore()
const flipped = ref(false)

async function onRate(quality) {
  await learning.rateCard(quality)
  flipped.value = false
}

onMounted(async () => {
  if (!learning.loaded) await learning.fetchTodayCards()
})
</script>

<style scoped>
.learning {
  max-width: 720px;
  margin: 0 auto;
}
.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.title {
  margin: 0;
}
.meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 8px 0 16px;
  color: #909399;
  font-size: 14px;
}
.chip {
  padding: 2px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}
.chip.new {
  background: #fff2e8;
  color: #ff7a3d;
}
.chip.due {
  background: #e8f4ff;
  color: #4090ff;
}
.count {
  color: #aeb6c4;
  letter-spacing: 0.5px;
}
.stage {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.tip {
  margin-top: 18px;
  color: #b0b7c3;
  font-size: 14px;
}
.stage-bottom {
  width: 100%;
}
.done {
  display: flex;
  justify-content: center;
  padding-top: 40px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>