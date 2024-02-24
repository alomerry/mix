<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { ElDialog } from 'element-plus'
import type { htmlItem } from '~/alomerry'

defineProps<{
  html?: htmlItem[]
}>()

const showHtml = ref(false)
const jumpToNewPage = ref(document.documentElement.clientWidth < 1000)
const currentPage = ref({
  page: {} as htmlItem,
  appendTo: 'body',
})

function showDialog(item: htmlItem) {
  if (jumpToNewPage.value) {
    window.open(item.url)
    return
  }

  currentPage.value = {
    page: item,
    appendTo: '#dialog',
  }

  showHtml.value = true
}

onMounted(() => {
  useEventListener(window, 'resize', () => {
    jumpToNewPage.value = document.documentElement.clientWidth < 1000
  })
})
</script>

<template>
  <a
    v-for="page in html"
    :key="`${page.url}${page.title}`"
    @click="showDialog(page)"
  >
    {{ page.title }}
  </a>
  <client-only>
    <ElDialog
      v-model="showHtml"
      :width="currentPage.page.width || '80%'"
      :fullscreen="false"
      :append-to="currentPage.appendTo"
    >
      <div class="html-content">
        <iframe :src="currentPage.page.url" class="html-content" />
      </div>
    </ElDialog>
  </client-only>
</template>

<style scoped>
.html-content {
  width: 100%;
  height: 100%;
}
</style>
