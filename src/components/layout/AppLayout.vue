<template>
  <el-container class="layout">
    <AppSidebar />
    <el-container>
      <AppHeader />
      <el-main>
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
</script>

<style scoped>
.layout {
  height: 100vh;
}
</style>