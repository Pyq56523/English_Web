<template>
  <div class="page-container">
    <div class="head">
      <h2 class="title">选择单词书</h2>
      <el-select v-model="category" placeholder="按类别筛选" clearable size="large"
        class="filter" @change="loadBooks">
        <el-option v-for="c in categories" :key="c" :label="c" :value="c" />
      </el-select>
    </div>

    <div v-if="wordBook.books.length" class="books">
      <div v-for="b in wordBook.books" :key="b.id" class="book" tabindex="0"
        :class="{ picked: pickedId === b.id }" @click="select(b)"
        @keydown.enter="select(b)">
        <div class="book-top">
          <el-tag size="small" effect="light" class="cat">{{ b.category }}</el-tag>
          <el-icon v-if="pickedId === b.id" class="check"><CircleCheckFilled /></el-icon>
        </div>
        <div class="name">{{ b.name }}</div>
        <div class="desc">{{ b.description || '精选高频单词，助你高效学习' }}</div>
        <div class="foot">
          <span class="count"><el-icon><Notebook /></el-icon> {{ b.word_count }} 词</span>
          <el-button v-if="pickedId === b.id" type="primary" size="small" round plain>
            当前使用
          </el-button>
          <span v-else class="hover-cta">选择 →</span>
        </div>
      </div>
    </div>
    <el-empty v-else description="暂无单词书" />

    <div class="actions">
      <el-button v-if="wordBook.current" type="primary" size="large" round @click="goLearning">
        🚀 继续学习「{{ wordBook.current.name }}」
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useWordBookStore } from '@/stores/wordBook'
import { useSettingsStore } from '@/stores/settings'
import { startLearning } from '@/api/learning'
import { Notebook, CircleCheckFilled } from '@element-plus/icons-vue'

const router = useRouter()
const wordBook = useWordBookStore()
const category = ref('')
const pickedId = ref(null)

const categories = computed(() =>
  [...new Set(wordBook.books.map((b) => b.category).filter(Boolean))]
)

async function loadBooks() {
  const params = {}
  if (category.value) params.category = category.value
  await wordBook.fetchBooks(params)
  // 恢复之前选中的词书（跨页面跳转后 pickedId 仍正确）
  const settings = useSettingsStore()
  if (settings.currentBookId) {
    pickedId.value = settings.currentBookId
    wordBook.restoreCurrent(settings.currentBookId)
  }
}
async function select(book) {
  pickedId.value = book.id
  await wordBook.selectBook(book.id)
  await startLearning(book.id) // 初始化学习记录
}
function goLearning() {
  router.push('/learning')
}

loadBooks()
</script>

<style scoped>
.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.title {
  margin: 0;
}
.filter {
  width: 200px;
}
.books {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}
.books {
  gap: 18px;
}
.book {
  background: var(--app-card, #fff);
  border: 1px solid var(--app-border, #eef1f6);
  border-radius: 16px;
  padding: 22px;
  cursor: pointer;
  min-height: 158px;
  display: flex;
  flex-direction: column;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  box-shadow: 0 2px 8px rgba(30, 41, 59, 0.04);
}
.book:hover {
  transform: translateY(-4px);
  border-color: var(--app-border-accent, #c7d2fe);
  box-shadow: 0 12px 28px rgba(79, 70, 229, 0.12);
}
.book.picked {
  border-color: var(--app-primary, #6366f1);
  box-shadow: 0 8px 26px rgba(99, 102, 241, 0.18);
}
.book-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.cat {
  border-radius: 999px;
}
.check {
  color: var(--app-primary, #4f46e5);
  font-size: 20px;
}
.name {
  font-size: 20px;
  font-weight: 700;
  color: var(--app-text, #1f2430);
}
.desc {
  margin-top: 6px;
  font-size: 13px;
  color: var(--app-text-secondary, #8a93a6);
  line-height: 1.5;
  flex: 1;
}
.foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
}
.count {
  color: var(--app-text-muted, #9aa3b2);
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.hover-cta {
  color: var(--app-primary, #6366f1);
  font-size: 13px;
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.2s;
}
.book:hover .hover-cta {
  opacity: 1;
}
.actions {
  text-align: center;
  margin-top: 24px;
}
</style>