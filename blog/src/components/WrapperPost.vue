<script setup lang="ts">
import {
  ALOMERRY_BLOG_WALINE_DOMAIN,
  displayComment,
  formatDateByAlomerry,
  setDefaultDisplayComment,
} from "~/alomerry";
import Comment from "~/components/container/Comment.vue";
import { pageviewCount } from "@waline/client";

const { frontmatter } = defineProps({
  frontmatter: {
    type: Object,
    required: true,
  },
});

const displayWaline = ref(displayComment());
const router = useRouter();
const route = useRoute();
const content = ref<HTMLDivElement>();

function reverseWaline() {
  setDefaultDisplayComment(!displayWaline.value);
  displayWaline.value = !displayWaline.value;
}

onMounted(() => {
  const navigate = () => {
    if (location.hash) {
      const el = document.querySelector(decodeURIComponent(location.hash));
      if (el) {
        const rect = el.getBoundingClientRect();
        const y = window.scrollY + rect.top - 40;
        window.scrollTo({
          top: y,
          behavior: "smooth",
        });
        return true;
      }
    }
  };

  const handleAnchors = (event: MouseEvent & { target: HTMLElement }) => {
    const link = event.target.closest("a");

    if (
      !event.defaultPrevented &&
      link &&
      event.button === 0 &&
      link.target !== "_blank" &&
      link.rel !== "external" &&
      !link.download &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey
    ) {
      const url = new URL(link.href);
      if (url.origin !== window.location.origin) return;

      event.preventDefault();
      const { pathname, hash } = url;
      if (hash && (!pathname || pathname === location.pathname)) {
        window.history.replaceState({}, "", hash);
        navigate();
      } else {
        router.push({ path: pathname, hash });
      }
    }
  };

  useEventListener(window, "hashchange", navigate);
  useEventListener(content.value!, "click", handleAnchors, { passive: false });

  setTimeout(() => {
    if (!navigate()) setTimeout(navigate, 1000);
  }, 1);

  pageviewCount({
    serverURL: ALOMERRY_BLOG_WALINE_DOMAIN,
    path: window.location.pathname,
  });
});
</script>

<template>
  <ClientOnly v-if="frontmatter.plum">
    <Plum />
  </ClientOnly>
  <div
    v-if="frontmatter.display ?? frontmatter.title"
    class="prose m-auto mb-8"
    :class="[frontmatter.wrapperClass]"
  >
    <h1 class="mb-0 slide-enter-50">
      {{ frontmatter.display ?? frontmatter.title }}
    </h1>
    <p v-if="frontmatter.date" class="opacity-50 !-mt-6 slide-enter-50">
      {{ formatDateByAlomerry(frontmatter.date, false) }}
      <span v-if="frontmatter.duration">· {{ frontmatter.duration }}</span>
      <span>
        · <span class="i-carbon-view-filled" />
        <span class="waline-pageview-count" ml-1 />
      </span>
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
    <p v-if="frontmatter.subtitle" class="opacity-50 !-mt-6 italic slide-enter">
      {{ frontmatter.subtitle }}
    </p>
    <p
      v-if="frontmatter.draft"
      class="slide-enter"
      bg-orange-4:10
      text-orange-4
      border="l-3 orange-4"
      px4
      py2
    >
      This is a draft post, the content may be incomplete. Please check back
      later.
    </p>
  </div>
  <article
    ref="content"
    :class="[frontmatter.tocAlwaysOn ? 'toc-always-on' : '', frontmatter.class]"
  >
    <slot />
  </article>
  <div
    v-if="route.path !== '/'"
    class="prose m-auto mt-8 mb-8 slide-enter animate-delay-500 print:hidden"
  >
    <span font-mono op50 class="i-mingcute-right-fill" />&nbsp;
    <RouterLink
      :to="route.path.split('/').slice(0, 2).join('/') || '/'"
      class="font-mono op50 hover:op75"
      v-text="'cd ..'"
    />
    <br />
    <template v-if="frontmatter.duration">
      <div @click="reverseWaline()">
        <span
          font-mono
          op50
          :class="
            displayWaline ? 'i-mingcute-down-fill' : 'i-mingcute-right-fill'
          "
        />
        <span font-mono op50 hover:op75 style="color: var(--fg-deeper)"
          >&nbsp;comment..</span
        >
      </div>
      <Transition>
        <Comment v-show="displayWaline" :lang="frontmatter.lang" />
      </Transition>
    </template>
  </div>
</template>
