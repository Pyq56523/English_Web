<template>
  <div class="page-container">
    <h2 class="title">常用短语</h2>
    <el-select v-model="category" placeholder="分类" clearable @change="load">
      <el-option v-for="c in categories" :key="c" :label="c" :value="c" />
    </el-select>

    <el-row :gutter="16" class="list">
      <el-col v-for="p in phrases" :key="p.id" :span="8">
        <el-card class="item" @click="showDetail(p)">
          <div class="phrase">{{ p.phrase }}</div>
          <div class="meaning">{{ p.meaning }}</div>
          <el-tag size="small">{{ p.category }}</el-tag>
        </el-card>
      </el-col>
    </el-row>

    <el-drawer v-model="drawer" size="40%">
      <template #header><b>{{ current.phrase }}</b></template>
      <p>{{ current.meaning }}</p>
      <p v-if="current.example" class="example">{{ current.example }}</p>
    </el-drawer>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { getPhrases } from '@/api/phrase'

const phrases = ref([])
const category = ref('')
const drawer = ref(false)
const current = ref({})

const categories = computed(() =>
  [...new Set(phrases.value.map((p) => p.category).filter(Boolean))]
)

async function load() {
  const params = { page: 1, page_size: 30 }
  if (category.value) params.category = category.value
  const res = await getPhrases(params)
  phrases.value = res.items || []
}

function showDetail(p) {
  current.value = p
  drawer.value = true
}

load()
</script>

<style scoped>
.list {
  margin-top: 16px;
}
.item {
  margin-bottom: 16px;
  cursor: pointer;
}
.phrase {
  font-size: 18px;
  font-weight: 700;
}
.meaning {
  margin: 8px 0;
  color: #606266;
}
.example {
  color: #909399;
}
</style>