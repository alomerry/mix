<script lang="ts" setup>
import { useRouter } from "vue-router";
import { englishOnly, formatDate } from "~/logics";
import type { Post } from "~/types";
import { DEFAULT_LANG } from "~/alomerry";

const props = defineProps<{
  type?: string;
  posts?: Post[];
  extra?: Post[];
}>();

const router = useRouter();
const routes: Post[] = router
  .getRoutes()
  .filter(
    (i) =>
      i.path.startsWith(`/${props.type}`) &&
      i.meta.frontmatter.date &&
      !i.meta.frontmatter.draft,
  )
  .filter(
    (i) =>
      !i.path.endsWith(".html") &&
      (i.meta.frontmatter.type || props.type || "// empty")
        .split("+")
        .some((i: string[]) => i.includes(props.type || "")),
  )
  .map((i) => ({
    path: i.meta.frontmatter.redirect || i.path,
    title: i.meta.frontmatter.title,
    date: i.meta.frontmatter.date,
    pinned: i.meta.frontmatter.pinned,
    lang: i.meta.frontmatter.lang || DEFAULT_LANG,
    duration: i.meta.frontmatter.duration,
    recording: i.meta.frontmatter.recording,
    upcoming: i.meta.frontmatter.upcoming,
    redirect: i.meta.frontmatter.redirect,
    desc: i.meta.frontmatter.desc,
    place: i.meta.frontmatter.place,
  }));

const posts = computed(() =>
  [...(props.posts || routes), ...(props.extra || [])]
    .sort((a, b) => {
      const pinnedA = a.pinned ?? false; // Use false if pinnedA is undefined
      const pinnedB = b.pinned ?? false; // Use false if pinnedB is undefined
      if (pinnedA !== pinnedB) return pinnedA ? -1 : 1;
      return +new Date(b.date) - +new Date(a.date);
    })
    .filter((i) => !englishOnly.value || i.lang !== "zh"),
);

const getYear = (a: Date | string | number) => new Date(a).getFullYear();
const isFuture = (a?: Date | string | number) => a && new Date(a) > new Date();

function isSameYear(a?: Date | string | number, b?: Date | string | number) {
  return a && b && getYear(a) === getYear(b);
}

function isSameGroup(a: Post, b?: Post) {
  return (
    (a?.pinned && b?.pinned) ||
    (isFuture(a.date) === isFuture(b?.date) && isSameYear(a.date, b?.date))
  );
}

function getGroupName(p: Post) {
  if (p.pinned) return "Pinned";
  if (isFuture(p.date)) return "Upcoming";
  return getYear(p.date);
}
</script>

<template>
  <ul>
    <template v-if="!posts.length">
      <div op50 py2>空空如也</div>
    </template>

    <template v-for="(route, idx) in posts" :key="route.path">
      <div
        v-if="!isSameGroup(route, posts[idx - 1])"
        :style="{
          '--enter-stage': idx - 2,
          '--enter-step': '60ms',
        }"
        h16
        pointer-events-none
        relative
        select-none
        slide-enter
      >
        <span
          absolute
          color-transparent
          font-bold
          left--3rem
          op25
          text-8em
          text-stroke-2
          text-stroke-hex-aaa
          top--1rem
          >{{ getGroupName(route) }}</span
        >
      </div>
      <div
        :style="{
          '--enter-stage': idx,
          '--enter-step': '60ms',
        }"
        class="slide-enter"
      >
        <component
          :is="route.path.includes('://') ? 'a' : 'RouterLink'"
          class="item block font-normal mb-6 mt-2 no-underline"
          v-bind="
            route.path.includes('://')
              ? {
                  href: route.path,
                  target: '_blank',
                  rel: 'noopener noreferrer',
                }
              : {
                  to: route.path,
                }
          "
        >
          <li class="no-underline" flex="~ col md:row gap-2 md:items-center">
            <div class="title text-lg leading-1.2em" flex="~ gap-2 wrap">
              <span
                v-if="route.lang === 'zh'"
                align-middle
                class="text-xs bg-zinc:15 text-zinc5 rounded px-1 py-0.5 ml--12 mr2 my-auto hidden md:block"
                flex-none
                >中文</span
              >
              <span align-middle>{{ route.title }}</span>
            </div>

            <div flex="~ gap-2 items-center">
              <span
                v-if="route.redirect"
                align-middle
                flex-none
                i-carbon-arrow-up-right
                ml--1
                mt--1
                op50
                text-xs
                title="External"
              />
              <span
                v-if="route.inperson"
                align-middle
                flex-none
                i-ri:group-2-line
                op50
                title="In person"
              />
              <span
                v-if="route.recording || route.video"
                align-middle
                flex-none
                i-ri:film-line
                op50
                title="Provided in video"
              />
              <span
                v-if="route.radio"
                align-middle
                flex-none
                i-ri:radio-line
                op50
                title="Provided in radio"
              />

              <span op50 text-sm ws-nowrap>
                {{ formatDate(route.date, true) }}
              </span>
              <span v-if="route.duration" op40 text-sm ws-nowrap
                >· {{ route.duration }}</span
              >
              <span v-if="route.platform" op40 text-sm ws-nowrap
                >· {{ route.platform }}</span
              >
              <span v-if="route.place" md:hidden op40 text-sm ws-nowrap
                >· {{ route.place }}</span
              >
              <span
                v-if="route.lang === 'zh'"
                align-middle
                class="text-xs bg-zinc:15 text-zinc5 rounded px-1 py-0.5 my-auto md:hidden"
                flex-none
                >中文</span
              >
            </div>
          </li>
          <div v-if="route.desc" hidden md:block mt--2 op50 text-sm>
            {{ route.desc }}
          </div>
          <div v-if="route.place" hidden md:block mt--1 op50 text-sm>
            {{ route.place }}
          </div>
        </component>
      </div>
    </template>
  </ul>
</template>
