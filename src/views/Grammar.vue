<template>
  <div class="page-container">
    <h2 class="title">语法课</h2>
    <el-select v-model="category" placeholder="分类" clearable @change="load">
      <el-option v-for="c in categories" :key="c" :label="c" :value="c" />
    </el-select>

    <el-table :data="lessons" class="list" @row-click="openDetail">
      <el-table-column prop="title" label="课程标题" />
      <el-table-column prop="category" label="分类" width="120" />
      <el-table-column prop="level" label="难度" width="120">
        <template #default="{ row }">
          <el-tag>{{ row.level }}</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <el-drawer v-model="drawer" size="50%">
      <template #header>
        <b>{{ detail.title }}</b>
      </template>
      <div v-html="renderMarkdown(detail.content)" />
    </el-drawer>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { getGrammarLessons, getGrammarLesson } from '@/api/grammar'

const lessons = ref([])
const detail = ref({})
const category = ref('')
const drawer = ref(false)

const categories = computed(() =>
  [...new Set(lessons.value.map((l) => l.category).filter(Boolean))]
)

async function load() {
  const params = {}
  if (category.value) params.category = category.value
  lessons.value = await getGrammarLessons(params)
}

async function openDetail(row) {
  detail.value = await getGrammarLesson(row.id)
  drawer.value = true
}

function renderMarkdown(text) {
  // 简易 Markdown 渲染（生产可替换为 marked 库）
  if (!text) return ''
  return text
    .replace(/^### (.*)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
    .replace(/\n/g, '<br/>')
}

load()
</script>

<style scoped>
.list {
  margin-top: 16px;
  cursor: pointer;
}
</style>