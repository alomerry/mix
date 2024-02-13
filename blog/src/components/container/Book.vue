<script setup lang="ts">
defineProps<{
  title?: string
  desc?: string
  logo?: string
  link?: string
}>()

onMounted(() => {
})
</script>

<template>
  <div class="">
    <a :href="link" target="_blank" class="book-card">
      <img class="book-card-logo" :src="logo">
      <div class="book-card-content">
        <div class="book-card-title">{{ title }}</div>
        <hr>
        <div class="book-card-desc">
          {{ desc }}
        </div>
      </div>
    </a>
  </div>
</template>
