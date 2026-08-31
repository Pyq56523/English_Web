import { defineStore } from 'pinia'

const DAILY_KEY = 'el_daily_target'
const THEME_KEY = 'el_theme'

/** 读取已保存主题；无则跟随系统深色偏好，默认 light */
function loadTheme() {
  const saved = localStorage.getItem(THEME_KEY)
  if (saved === 'light' || saved === 'dark') return saved
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    dailyTarget: Number(localStorage.getItem(DAILY_KEY) || 20),
    theme: loadTheme()
  }),
  actions: {
    /** 把 theme 同步到 <html class="dark">，供 Element Plus 深色变量适配 */
    applyTheme() {
      const root = document.documentElement
      if (this.theme === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    },
    setDailyTarget(value) {
      this.dailyTarget = Number(value)
      localStorage.setItem(DAILY_KEY, String(this.dailyTarget))
    },
    setTheme(theme) {
      this.theme = theme === 'dark' ? 'dark' : 'light'
      localStorage.setItem(THEME_KEY, this.theme)
      this.applyTheme()
    }
  }
})