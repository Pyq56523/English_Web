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
        <el-tag size="small" effect="plain" class="cat">{{ b.category }}</el-tag>
        <div class="name">{{ b.name }}</div>
        <div class="desc">{{ b.description || '精选高频单词，助你高效学习' }}</div>
        <div class="foot">
          <span class="count">{{ b.word_count }} 词</span>
          <span v-if="pickedId === b.id" class="picked-tag">当前使用</span>
        </div>
      </div>
    </div>
    <el-empty v-else description="暂无单词书" />

    <div class="actions">
      <el-button v-if="wordBook.current" type="primary" size="large" round @click="goLearning">
        继续学习「{{ wordBook.current.name }}」
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useWordBookStore } from '@/stores/wordBook'
import { startLearning } from '@/api/learning'

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
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}
.book {
  background: #fff;
  border: 1px solid #eef1f6;
  border-radius: 14px;
  padding: 20px;
  cursor: pointer;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(30, 41, 59, 0.04);
}
.book:hover {
  transform: translateY(-3px);
  border-color: #c7d2fe;
  box-shadow: 0 10px 24px rgba(79, 70, 229, 0.12);
}
.book.picked {
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.18);
}
.cat {
  align-self: flex-start;
  margin-bottom: 12px;
  border-radius: 999px;
}
.name {
  font-size: 20px;
  font-weight: 700;
  color: #1f2430;
}
.desc {
  margin-top: 6px;
  font-size: 13px;
  color: #8a93a6;
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
  color: #9aa3b2;
  font-size: 13px;
}
.picked-tag {
  color: #6366f1;
  font-size: 12px;
  font-weight: 600;
}
.actions {
  text-align: center;
  margin-top: 24px;
}
</style>