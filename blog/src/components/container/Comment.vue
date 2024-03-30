<script setup lang="ts">
import { Waline } from '@waline/client/component'
import '@waline/client/style'

defineProps<{
  lang?: string
}>()

const serverURL = 'https://waline-blog.alomerry.com'
const path = computed(() => useRoute().path)
const reaction = [
  'https://cdn.alomerry.com/blog/assets/comment/clear-day.svg',
  'https://cdn.alomerry.com/blog/assets/comment/dust-day.svg',
  'https://cdn.alomerry.com/blog/assets/comment/extreme-haze.svg',
  'https://cdn.alomerry.com/blog/assets/comment/dust-wind.svg',
  'https://cdn.alomerry.com/blog/assets/comment/extreme-snow.svg',
  'https://cdn.alomerry.com/blog/assets/comment/hurricane.svg',
  'https://cdn.alomerry.com/blog/assets/comment/starry-night.svg',
]
const emoji = [
  '//unpkg.com/@waline/emojis@1.2.0/weibo',
  '//unpkg.com/@waline/emojis@1.2.0/bmoji',
  '//unpkg.com/@waline/emojis@1.2.0/tieba',
  '//unpkg.com/@waline/emojis@1.2.0/qq',
  '//unpkg.com/@waline/emojis@1.2.0/bilibili',
]
onMounted(() => {
  const els = document.querySelectorAll('.wl-reaction-img>img')
  els.forEach((el) => {
    el.classList.add('no-preview')
  })
})
</script>

<template>
  <Waline
    dark="html[class=&quot;dark&quot;]"
    :search="false"
    :server-u-r-l="serverURL"
    :path="path"
    :lang="lang"
    :reaction="reaction"
    :emoji="emoji"
  />
</template>
