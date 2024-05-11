<script lang="ts" setup>
import { pageviewCount } from '@waline/client'
import {
  ALOMERRY_BLOG_WALINE_DOMAIN,
  displayComment,
  getFromNow,
  setDefaultDisplayComment,
} from '~/alomerry'
import { formatDate } from '~/logics'
import Comment from '~/components/container/Comment.vue'
import { DEFAULT_LANG } from '~/alomerry/setting'

const { frontmatter } = defineProps({
  frontmatter: {
    type: Object,
    required: true,
  },
})

const displayWaline = ref(
  frontmatter.comment === undefined ? displayComment() : frontmatter.comment,
)
const router = useRouter()
const route = useRoute()
const content = ref<HTMLDivElement>()

function reverseWaline() {
  setDefaultDisplayComment(!displayWaline.value)
  displayWaline.value = !displayWaline.value
}

onMounted(() => {
  const navigate = () => {
    if (location.hash) {
      const el = document.querySelector(decodeURIComponent(location.hash))
      if (el) {
        const rect = el.getBoundingClientRect()
        const y = window.scrollY + rect.top - 40
        window.scrollTo({
          top: y,
          behavior: 'smooth',
        })
        return true
      }
    }
  }

  const handleAnchors = (event: MouseEvent & { target: HTMLElement }) => {
    const link = event.target.closest('a')

    if (
      !event.defaultPrevented
      && link
      && event.button === 0
      && link.target !== '_blank'
      && link.fix !== 'alomerry-component'
      && link.rel !== 'external'
      && !link.download
      && !event.metaKey
      && !event.ctrlKey
      && !event.shiftKey
      && !event.altKey
    ) {
      const url = new URL(link.href)
      if (url.origin !== window.location.origin)
        return

      event.preventDefault()
      const { pathname, hash } = url
      if (hash && (!pathname || pathname === location.pathname)) {
        window.history.replaceState({}, '', hash)
        navigate()
      }
      else {
        router.push({ path: pathname, hash })
      }
    }
  }

  useEventListener(window, 'hashchange', navigate)
  useEventListener(content.value!, 'click', handleAnchors, { passive: false })

  setTimeout(() => {
    if (!navigate())
      setTimeout(navigate, 1000)
  }, 1)

  pageviewCount({
    serverURL: ALOMERRY_BLOG_WALINE_DOMAIN,
    path: window.location.pathname,
  })
})

const ArtComponent = computed(() => {
  let art = frontmatter.art
  if (art === 'random')
    art = Math.random() > 0.5 ? 'plum' : 'dots'
  if (typeof window !== 'undefined') {
    if (art === 'plum')
      return defineAsyncComponent(() => import('./ArtPlum.vue'))
    else if (art === 'dots')
      return defineAsyncComponent(() => import('./ArtDots.vue'))
  }
  return undefined
})
</script>

<template>
  <ClientOnly v-if="ArtComponent">
    <component :is="ArtComponent" />
  </ClientOnly>
  <div
    v-if="frontmatter.display ?? frontmatter.title"
    :class="[frontmatter.wrapperClass]"
    class="prose m-auto mb-8"
  >
    <h1 class="mb-0 slide-enter-50">
      {{ frontmatter.display ?? frontmatter.title }}
    </h1>
    <p v-if="frontmatter.date" class="opacity-50 !-mt-6 slide-enter-50">
      {{ formatDate(frontmatter.date, false) }}
      <span v-if="frontmatter.duration">
        · <span class="i-lets-icons-time-atack" />
        {{ frontmatter.duration }}</span>
      <span v-if="frontmatter.wordCount">
        · <span class="i-icon-park-outline-word" />
        {{ frontmatter.wordCount }}</span>
      <span>
        · <span class="i-carbon-view-filled" />
        <span class="waline-pageview-count" ml-1 />
      </span>
      <span v-if="frontmatter.update" style="font-size: 0.8rem">
        · updated at {{ getFromNow(frontmatter.update) }}</span>
    </p>
    <p v-if="frontmatter.place" class="mt--4!">
      <span op50>at </span>
      <a
        v-if="frontmatter.placeLink"
        :href="frontmatter.placeLink"
        target="_blank"
      >
        {{ frontmatter.place }}
      </a>
      <span v-else font-bold>
        {{ frontmatter.place }}
      </span>
    </p>
    <p
      v-if="frontmatter.subtitle"
      class="!opacity-50 !-mt-4 italic slide-enter"
    >
      {{ frontmatter.subtitle }}
    </p>
    <p
      v-if="frontmatter.draft"
      bg-orange-4:10
      border="l-3 orange-4"
      class="slide-enter"
      px4
      py2
      text-orange-4
    >
      This is a draft post, the content may be incomplete. Please check back
      later.
    </p>
  </div>
  <article
    ref="content"
    :class="[
      (frontmatter.tocAlwaysOn !== undefined ? frontmatter.tocAlwaysOn : true)
        ? 'toc-always-on'
        : '',
      frontmatter.class,
    ]"
  >
    <slot />
  </article>
  <div
    v-if="route.path !== '/'"
    class="prose m-auto mt-8 mb-8 slide-enter animate-delay-500 print:hidden"
  >
    <span class="i-mingcute-right-fill" font-mono op50 />&nbsp;
    <RouterLink
      :to="route.path.split('/').slice(0, 2).join('/') || '/'"
      class="font-mono op50 hover:op75"
      v-text="'cd ..'"
    />
    <br>
    <template v-if="frontmatter.duration">
      <div @click="reverseWaline()">
        <span
          :class="
            displayWaline ? 'i-mingcute-down-fill' : 'i-mingcute-right-fill'
          "
          font-mono
          op50
        />
        <span
          class="alomerry-breath-opacity"
          font-mono
          hover:op75
          style="color: var(--fg-deeper)"
        >&nbsp;comment..</span>
      </div>
      <Transition>
        <Comment
          v-show="route.path.endsWith('/comment') || displayWaline"
          :lang="frontmatter.lang || DEFAULT_LANG"
        />
      </Transition>
    </template>
  </div>
</template>
