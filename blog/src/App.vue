<script lang="ts" setup>
import { useCodeGroup, useCopyCode } from './alomerry'

const route = useRoute()

const imageModel = ref<HTMLImageElement>()

const timeoutIdMap = new WeakMap()

useEventListener('click', async (e) => {
  const path = Array.from(e.composedPath())
  const first = path[0]
  if (!(first instanceof HTMLElement))
    return
  if (first.tagName !== 'IMG')
    return
  if (first.classList.contains('no-preview'))
    return
  if (
    path.some(
      el => el instanceof HTMLElement && ['A', 'BUTTON'].includes(el.tagName),
    )
  )
    return
  if (
    !path.some(
      el => el instanceof HTMLElement && el.classList.contains('prose'),
    )
  )
    return

  // Do not open image when they are moving. Mainly for mobile to avoid conflict with hovering behavior.
  const pos = first.getBoundingClientRect()
  await new Promise(resolve => setTimeout(resolve, 50))
  const newPos = first.getBoundingClientRect()
  if (pos.left !== newPos.left || pos.top !== newPos.top)
    return

  imageModel.value = first as HTMLImageElement
})

useEventListener('click', useCodeGroup)
useEventListener('click', (e) => {
  useCopyCode(e, timeoutIdMap)
})

onKeyStroke('Escape', (e) => {
  if (imageModel.value) {
    imageModel.value = undefined
    e.preventDefault()
  }
})
</script>

<template>
  <NavBar />

  <main class="px-7 py-10 of-x-hidden">
    <RouterView />
    <Footer :key="route.path" />
  </main>
  <Transition name="fade">
    <div
      v-if="imageModel"
      backdrop-blur-7
      bottom-0
      fixed
      left-0
      right-0
      top-0
      z-500
      @click="imageModel = undefined"
    >
      <div absolute bg-black:30 bottom-0 left-0 right-0 top-0 z--1 />
      <img
        :alt="imageModel.alt"
        :src="imageModel.src"
        h-full
        object-contain
        w-full
      >
    </div>
  </Transition>
</template>
