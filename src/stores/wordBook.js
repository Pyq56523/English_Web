import { defineStore } from 'pinia'
import { getWordBooks, getWordBookDetail } from '@/api/wordBook'

export const useWordBookStore = defineStore('wordBook', {
  state: () => ({
    books: [],
    current: null,        // 当前选中单词书
    progress: null
  }),
  actions: {
    async fetchBooks(params = {}) {
      this.books = await getWordBooks(params)
    },
    async selectBook(bookId) {
      const detail = await getWordBookDetail(bookId)
      this.current = detail
      return detail
    }
  }
})