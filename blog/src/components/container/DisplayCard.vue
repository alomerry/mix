<script setup lang="ts">
defineProps<{ cards: any[] }>()

</script>

<template>
  <div class="project-flex flex py-2 max-w-800 gap-4" flex="~ wrap">
    <a v-for="item, idx in cards" :key="idx" class="item relative flex items-center" :href="item.link"
      :class="!item.link ? 'opacity-0 pointer-events-none h-0 -mt-8 -mb-4' : ''" :title="item.name">
      <div v-if="item.icon" class="pt-2 pr-5">
        <Slidev v-if="item.icon === 'slidev'" class="text-4xl opacity-80" />
        <VueUse v-else-if="item.icon === 'vueuse'" class="text-4xl opacity-80" />
        <VueReactivity v-else-if="item.icon === 'vue-reactivity'" class="text-4xl opacity-80" />
        <VueDemi v-else-if="item.icon === 'vue-demi'" class="text-4xl opacity-80" />
        <Unocss v-else-if="item.icon === 'unocss'" class="text-4xl opacity-80" />
        <Vitest v-else-if="item.icon === 'vitest'" class="text-4xl opacity-80" />
        <Elk v-else-if="item.icon === 'elk'" class="text-4xl opacity-80" />
        <AnthonyFu v-else-if="item.icon === 'af'" class="text-4xl opacity-80" />
        <img v-else-if="item.icon.startsWith('http')" class="text-4xl display-card-icon-img opacity-80"
          :src="item.icon" />
        <div v-else class="text-4xl opacity-80" :class="item.icon || 'i-carbon-unknown'" />
      </div>
      <div class="flex-auto">
        <div class="text-normal">{{ item.name }}</div>
        <div class="alomerry-limit-max desc text-sm opacity-80 font-normal" v-html="item.desc" />
      </div>
    </a>
  </div>
</template>

<style scoped>
.project-flex a.item {
  background: transparent;
  font-size: 1.1rem;
  min-width: 80px;
  padding: 0.5rem 0.875rem 0.875rem;
  border-radius: 6px;
}

.project-flex a.item:hover {
  background: #88888811;
}

.project-flex img.display-card-icon-img {
  margin-top: 0;
  margin-bottom: 0;
  height: 1.2em;
  width: 1.2em;
  border-radius: 6px;
}
</style>
