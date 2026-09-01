<template>
  <div class="page-container learning">
    <div class="head">
      <h2 class="title">今日学习</h2>
      <WordProgress :total="learning.queue.length" :done="learning.queueIndex" />
    </div>

    <!-- 学习方向：学习新词 / 复习 -->
    <div class="direction-switch">
      <el-segmented
        v-model="learning.direction"
        :options="directionOptions"
        size="large"
        @change="onDirectionChange"
      />
    </div>

    <div class="mode-switch">
      <el-segmented
        v-model="mode"
        :options="[
          { label: '🂡 卡片学习', value: 'card' },
          { label: '⌨️ 键盘拼写', value: 'spell' }
        ]"
        size="large"
      />
    </div>

    <!-- A. 卡片学习（不背单词风格） -->
    <template v-if="mode === 'card'">
      <div v-if="learning.current" class="stage">
        <div class="meta">
          <el-tag size="large" round :type="chipType">{{ chipText }}</el-tag>
          <span class="count">第 {{ learning.queueIndex + 1 }} / {{ learning.queue.length }} 词</span>
        </div>

        <div class="card-glows">
          <span class="glow glow-a"></span>
          <span class="glow glow-b"></span>
        </div>

        <WordCard :card="learning.current" :flipped="flipped" @flip="flipped = !flipped" />

        <transition name="fade">
          <div v-if="flipped" class="stage-bottom">
            <ReviewRating @rate="onRate" />
          </div>
          <div v-else class="tip">👆 点击卡片翻面，回忆它的释义</div>
        </transition>
      </div>

      <div v-else class="done empty-wrap">
        <el-empty :description="emptyTip">
          <el-button type="primary" round size="large" @click="$router.push('/')">
            返回首页
          </el-button>
        </el-empty>
      </div>
    </template>

    <!-- B. 键盘拼写（qwerty-learner 风格）：拼今天已学的新词 -->
    <template v-else>
      <SpellingPractice :queue="learning.learnedCards" />
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import WordCard from '@/components/word/WordCard.vue'
import ReviewRating from '@/components/word/ReviewRating.vue'
import WordProgress from '@/components/word/WordProgress.vue'
import SpellingPractice from '@/components/word/SpellingPractice.vue'
import { useLearningStore } from '@/stores/learning'

const learning = useLearningStore()
const flipped = ref(false)
const mode = ref('card') // card | spell

// 学习方向选项，展示今日可学新词数 / 到期复习数
const directionOptions = computed(() => [
  { label: `📖 学习新词 ${learning.summary.learn_count || 0}`, value: 'learn' },
  { label: `🔁 复习 ${learning.summary.total_due || 0}`, value: 'review' }
])

function onDirectionChange(dir) {
  // v-model 已把 direction 改为 dir，这里直接根据新方向重建队列
  learning.applyDirection()
  flipped.value = false
}

const isNew = computed(
  () => !learning.current?.record_id || learning.current.repetition === 0
)
const emptyTip = computed(() => {
  if (learning.queue.length) {
    return learning.direction === 'review' ? '今日复习已全部完成' : '今日新词已全部学完'
  }
  return learning.direction === 'review' ? '今天没有到期的复习词' : '今天没有待学的新词'
})
const chipText = computed(() => (isNew.value ? '🌟 新词' : '🔁 复习'))
const chipType = computed(() => (isNew.value ? 'warning' : 'primary'))

function speakWord() {
  const word = learning.current?.word
  if (!word || !('speechSynthesis' in window)) return
  try {
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(word)
    u.lang = 'en-US'
    window.speechSynthesis.speak(u)
  } catch (e) {
    /* 忽略发音失败 */
  }
}

async function onRate(quality) {
  await learning.rateCard(quality)
  flipped.value = false
}

// 换到新卡片时自动朗读一次英语单词
watch(
  () => learning.current,
  (card) => {
    if (card) speakWord()
  },
  { immediate: true }
)

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
  margin-bottom: 18px;
}
.title {
  margin: 0;
}
.mode-switch {
  display: flex;
  justify-content: center;
  margin-bottom: 26px;
}
.direction-switch {
  display: flex;
  justify-content: center;
  margin-bottom: 14px;
}
.direction-switch :deep(.el-segmented) {
  background: var(--app-fill-soft, #eceef7);
  border-radius: 999px;
  padding: 4px;
}
.direction-switch :deep(.el-segmented__item) {
  font-weight: 600;
  border-radius: 999px;
}
.mode-switch :deep(.el-segmented) {
  background: var(--app-fill-soft, #eceef7);
  border-radius: 999px;
  padding: 4px;
}
.mode-switch :deep(.el-segmented__item) {
  font-weight: 600;
  border-radius: 999px;
}
.mode-switch :deep(.el-segmented__item-selected) {
  box-shadow: 0 4px 14px rgba(79, 70, 229, 0.24);
}
.card-glows {
  position: relative;
  width: 100%;
  max-width: 460px;
  height: 0;
  display: flex;
  justify-content: center;
}
.glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.5;
  pointer-events: none;
}
.glow-a {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, #a5a4ff, transparent 65%);
  top: -40px;
  left: 12%;
}
.glow-b {
  width: 170px;
  height: 170px;
  background: radial-gradient(circle, #c7b8ff, transparent 65%);
  top: 30px;
  right: 14%;
  opacity: 0.4;
}
.meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 10px 0 18px;
}
.count {
  color: #aeb6c4;
  letter-spacing: 0.5px;
  font-size: 14px;
}
.stage {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.tip {
  margin-top: 20px;
  padding: 10px 20px;
  border-radius: 999px;
  background: var(--app-fill-soft, #f4f5ff);
  color: var(--app-text-secondary, #7c87a0);
  font-size: 14px;
  border: 1px solid var(--app-fill-soft-border, #e6e5ff);
}
.stage-bottom {
  width: 100%;
}
.done {
  display: flex;
  justify-content: center;
  padding-top: 48px;
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