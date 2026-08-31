<template>
  <el-progress :percentage="percentage" :stroke-width="12" />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  total: { type: Number, default: 0 },
  done: { type: Number, default: 0 }
})

const percentage = computed(() =>
  props.total > 0 ? Math.round((props.done / props.total) * 100) : 0
)
</script>