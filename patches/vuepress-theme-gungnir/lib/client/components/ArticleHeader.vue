<template>
  <div
    class="article-header"
    :style="headerStyle()"
    :class="{ 'use-image': frontmatter.useHeaderImage }"
  >
    <div
      v-if="frontmatter.useHeaderImage && frontmatter.headerMask"
      class="article-header-mask"
      :style="{ background: frontmatter.headerMask }"
    />

    <div class="article-header-content">
      <div v-if="frontmatter.tags" class="article-tags">
        <RouterLink
          v-for="(item, index) in frontmatter.tags"
          :key="index"
          class="article-tag"
          :class="{ active: currentTag == item }"
          :to="getPathByTag(item)"
        >
          {{ item }}
        </RouterLink>
      </div>

      <h1 class="article-title">
        {{ frontmatter.title }}
      </h1>

      <p v-if="frontmatter.subtitle" class="article-subtitle">
        {{ frontmatter.subtitle }}
      </p>

      <div class="article-icons">
        <div
          v-if="frontmatter.author || personalInfo.name"
          class="article-icon"
        >
          <VIcon name="fa-regular-user" />
          <span>{{ frontmatter.author || personalInfo.name }}</span>
        </div>

        <div v-if="frontmatter.date" class="article-icon">
          <VIcon name="md-createnewfolder-outlined" />
          <span>{{ formateDateString(frontmatter.date) }}</span>
        </div>

        <div v-if="frontmatter.update" class="article-icon">
          <VIcon name="fa-regular-calendar" />
          <span>{{ formateDateString(frontmatter.update) }}</span>
        </div>

        <div v-if="page.readingTime" class="article-icon">
          <VIcon name="ri-timer-line" />
          <span>{{ page.readingTime.minutes }} min</span>
        </div>
      </div>
    </div>
    <div
      v-if="frontmatter.useHeaderImage && frontmatter.headerImageCredit"
      class="article-image-credit"
    >
      {{ themeLocale.headerImageCredit }}
      <a
        v-if="frontmatter.headerImageCreditLink"
        :href="frontmatter.headerImageCreditLink"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ frontmatter.headerImageCredit }}
      </a>
      <span v-else>{{ frontmatter.headerImageCredit }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePageData, usePageFrontmatter, withBase } from "@vuepress/client";
import type {
  GungnirThemePageData,
  GungnirThemePostFrontmatter,
  PersonalConfig
} from "../../shared";
import { useTagMap, useThemeLocaleData } from "../composables";
import { formateDateString } from "../utils/resolveTime";

defineProps({
  currentTag: {
    type: String,
    default: ""
  }
});

const themeLocale = useThemeLocaleData();
const frontmatter = usePageFrontmatter<GungnirThemePostFrontmatter>();
const page = usePageData<GungnirThemePageData>();
const tagMap = useTagMap();

const getPathByTag = (tag: string) => {
  return tagMap.value.map[tag].path;
};

// post header style
const headerStyle = () => {
  const style = {} as { backgroundImage: string };
  if (
    frontmatter.value.layout === "Post" &&
    frontmatter.value.useHeaderImage &&
    frontmatter.value.headerImage
  ) {
    style.backgroundImage = `url(${withBase(triggerUri(frontmatter.value.headerImage))})`;
  }
  return style;
};

let lastIndex = 0;
function triggerUri(url) {
  if (typeof url === "string" && ((url || "").split("?")).length >= 2) {
    const cdn = (url || "").split("?")[0]
    const index = (url || "").split("?")[1].split("=")[1];
    const max = Math.floor(Math.random() * index + 1);
    if (lastIndex == 0) {
      lastIndex = max
    }
    return cdn + "/" + lastIndex + ".jpg";
  }

  return url;
}

const personalInfo = themeLocale.value.personalInfo as PersonalConfig;
</script>
