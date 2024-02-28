<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { englishOnly } from "~/logics";
import { Category, DEFAULT_LANG } from "~/alomerry";
import { ElBadge } from "element-plus";

const inactiveStyle = "opacity-20 hover:opacity-50";
const activeStyle = "opacity-100 underline";

const route = useRoute();

const ioi: Category[] = [
  { name: "简单", to: "/ioi/leetcode-easy", dotColor: "info" },
  { name: "中等", to: "/ioi/leetcode-medium", dotColor: "info" },
  { name: "困难", to: "/ioi/leetcode-hard", dotColor: "info" },
  { name: "SQL", to: "/ioi/leetcode-sql", dotColor: "info" },
  { name: "周赛", to: "/ioi/leetcode-weekly-contest", dotColor: "info" },
  { name: "PAT", to: "/ioi/pat-a", dotColor: "info" },
];

const mds = useRouter().getRoutes();

ioi.forEach((category: Category) => {
  // 满足条件的 markdown
  const res = mds
    .filter(
      (i) =>
        i.path.startsWith(category.to) &&
        i.meta.frontmatter.date &&
        !i.meta.frontmatter.draft,
    )
    .filter(
      (i) =>
        !i.path.endsWith(".html") &&
        (i.meta.frontmatter.type || category.to || "// empty")
          .split("+")
          .some((i: string[]) => i.includes(category.to || "")),
    )
    .map((i) => ({
      path: i.meta.frontmatter.redirect || i.path,
      title: i.meta.frontmatter.title,
      date: i.meta.frontmatter.date,
      lang: i.meta.frontmatter.lang || DEFAULT_LANG,
      duration: i.meta.frontmatter.duration,
      recording: i.meta.frontmatter.recording,
      upcoming: i.meta.frontmatter.upcoming,
      redirect: i.meta.frontmatter.redirect,
      desc: i.meta.frontmatter.desc,
      place: i.meta.frontmatter.place,
    }));
  category.count = [...res].filter(
    (i) => !englishOnly.value || i.lang !== "zh",
  ).length;
});
</script>

<template>
  <div
    v-if="ioi.length > 0"
    class="prose m-auto mb-0 select-none animate-none! op100!"
  >
    <div mb-0 flex="~ col gap-1 sm:row sm:gap-3 wrap" text-2xl>
      <el-badge
        v-for="category of ioi"
        :value="category.count"
        :max="99"
        :type="category.dotColor"
        :key="category.to"
      >
        <RouterLink
          :to="category.to"
          class="!border-none"
          :class="route.path === category.to ? activeStyle : inactiveStyle"
        >
          {{ category.name }}
        </RouterLink>
      </el-badge>
    </div>
  </div>
</template>
