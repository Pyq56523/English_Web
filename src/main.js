import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import App from './App.vue'
import router from './router'
import { useSettingsStore } from './stores/settings'
import './assets/styles/main.scss'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(ElementPlus, { locale: zhCn })
app.mount('#app')

// 挂载后应用持久化的主题，保证刷新后深色/白天模式立即生效
useSettingsStore().applyTheme()