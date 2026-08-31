<template>
  <div class="word-card" :class="{ flipped }" @click="$emit('flip')">
    <div class="inner">
      <div class="face front">
        <div class="word">{{ card.word }}</div>
        <div v-if="card.phonetic" class="phonetic">{{ card.phonetic }}</div>
        <div class="hint">点击翻面 · 回忆释义</div>
      </div>
      <div class="face back">
        <div class="meaning-label">释义</div>
        <div class="meaning">{{ card.meaning }}</div>
        <div v-if="card.example" class="example">{{ card.example }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  card: { type: Object, required: true },
  flipped: { type: Boolean, default: false }
})
defineEmits(['flip'])
</script>

<style scoped>
.word-card {
  perspective: 1000px;
  width: 420px;
  height: 260px;
  cursor: pointer;
}
@media (max-width: 520px) {
  .word-card { width: 320px; height: 220px; }
}
.inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.5s cubic-bezier(0.4, 0.2, 0.2, 1);
  transform-style: preserve-3d;
}
.flipped .inner {
  transform: rotateY(180deg);
}
.face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #eef1f6;
  box-shadow: 0 12px 32px rgba(30, 41, 59, 0.1);
}
.front {
  background: linear-gradient(140deg, #6366f1 0%, #4f46e5 55%, #3730a3 100%);
  color: #fff;
}
.word {
  font-size: 46px;
  font-weight: 800;
  letter-spacing: 0.5px;
}
.phonetic {
  margin-top: 14px;
  font-size: 17px;
  opacity: 0.9;
  color: #e3e2ff;
}
.hint {
  margin-top: 28px;
  font-size: 12px;
  opacity: 0.65;
}
.back {
  background: #fafbff;
  transform: rotateY(180deg);
}
.meaning-label {
  font-size: 12px;
  color: #9aa3b2;
  letter-spacing: 2px;
  margin-bottom: 10px;
}
.meaning {
  font-size: 24px;
  font-weight: 600;
  color: #1f2430;
  text-align: center;
  line-height: 1.5;
}
.example {
  margin-top: 14px;
  font-size: 13px;
  color: #8a93a6;
  text-align: center;
  font-style: italic;
}
</style>