<script setup lang="ts">
// import { Waline } from '@waline/client/component'
import '@waline/client/style'

defineProps<{
  dark?: string
}>()

const serverURL = 'https://waline-blog.alomerry.com'
const path = computed(() => useRoute().path)
const reaction = [
  '/assets/clear-day.svg',
  '/assets/dust-day.svg',
  '/assets/extreme-haze.svg',
  '/assets/dust-wind.svg',
  '/assets/extreme-snow.svg',
  '/assets/hurricane.svg',
  '/assets/starry-night.svg',
]
const emoji = [
  '//unpkg.com/@waline/emojis@1.2.0/weibo',
  '//unpkg.com/@waline/emojis@1.2.0/bmoji',
  '//unpkg.com/@waline/emojis@1.2.0/tieba',
  '//unpkg.com/@waline/emojis@1.2.0/qq',
  '//unpkg.com/@waline/emojis@1.2.0/bilibili',

]
</script>

<template>
  <Waline
    :dark="dark || 'auto'"
    :search="false"
    :pageview="true"
    :server-u-r-l="serverURL"
    :path="path"
    :reaction="reaction"
    :emoji="emoji"
  />
</template>
