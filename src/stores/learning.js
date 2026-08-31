import { defineStore } from 'pinia'
import { getTodayCards, submitReview, startLearning, getProgress } from '@/api/learning'

export const useLearningStore = defineStore('learning', {
  state: () => ({
    newCards: [],
    dueCards: [],
    summary: { total_new: 0, total_due: 0, mastered: 0 },
    queue: [],        // 当前待学习卡片队列
    queueIndex: 0,
    current: null,    // 当前卡片
    loaded: false
  }),
  actions: {
    async fetchTodayCards() {
      const data = await getTodayCards()
      this.newCards = data.new_cards || []
      this.dueCards = data.due_cards || []
      this.summary = data.summary || { total_new: 0, total_due: 0, mastered: 0 }
      this.queue = [...this.newCards, ...this.dueCards]
      this.queueIndex = 0
      this.current = this.queue[0] || null
      this.loaded = true
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