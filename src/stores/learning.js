import { defineStore } from 'pinia'
import { getTodayCards, submitReview, startLearning, getProgress } from '@/api/learning'

export const useLearningStore = defineStore('learning', {
  state: () => ({
    newCards: [],      // 今日可学新词（数量受 daily_target 限制）
    dueCards: [],      // 到期复习词（不限量）
    learnedCards: [],  // 今日已学新词（供键盘拼写，不受每日配额影响）
    summary: { daily_target: 0, learn_count: 0, total_new: 0, total_due: 0, mastered: 0 },
    direction: 'learn', // learn=学习新词 | review=复习
    queue: [],        // 当前方向对应的卡片队列
    queueIndex: 0,
    current: null,    // 当前卡片
    loaded: false
  }),
  actions: {
    async fetchTodayCards() {
      const data = await getTodayCards()
      this.newCards = data.new_cards || []
      this.dueCards = data.due_cards || []
      this.learnedCards = data.learned_cards || []
      this.summary = data.summary || { daily_target: 0, learn_count: 0, total_new: 0, total_due: 0, mastered: 0 }
      this.applyDirection()
      this.loaded = true
    },
    /** 让 queue 跟随当前方向（learn→新词 / review→复习） */
    applyDirection() {
      const source = this.direction === 'review' ? this.dueCards : this.newCards
      this.queue = source
      this.queueIndex = 0
      this.current = this.queue[0] || null
    },
    setDirection(dir) {
      if (this.direction === dir) return
      this.direction = dir
      this.applyDirection()
    },
    nextCard() {
      this.queueIndex += 1
      this.current = this.queue[this.queueIndex] || null
    },
    async rateCard(quality) {
      if (!this.current || !this.current.record_id) {
        // 新卡片无 record_id，直接跳到下一张
        this.nextCard()
        return null
      }
      const res = await submitReview({ record_id: this.current.record_id, quality })
      this.nextCard()
      return res
    },
    reset() {
      this.queue = []
      this.queueIndex = 0
      this.current = null
      this.loaded = false
    }
  }
})