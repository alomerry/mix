<script setup lang="ts">
import { ref } from "vue";
import API from "~/alomerry/api";
import { ElDialog, ElInput, ElCard, ElScrollbar, ElEmpty } from "element-plus";
import { AxiosResponse } from "axios";
import { debounce } from "lodash-es";

const h1svg = `<svg width="1rem" viewBox="0 0 16 24"><path d="M13 13h4-4V8H7v5h6v4-4H7V8H3h4V3v5h6V3v5h4-4v5zm-6 0v4-4H3h4z" stroke="currentColor" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>&nbsp;`;
const loading = ref(false);
const searchInput = ref(null);
const keyword = ref("");
const showDialog = ref(false);
const searchRes = ref<blog[]>([]);

interface highlight {
  content: Array<string>;
  title: Array<string>;
  description: Array<string>;
}

interface blog {
  markdownPath: string;
  title: string;
  place: string;
  highlight: highlight;
  createdAt: string;
  updatedAt: string;
}

const queryEs = () => {
  if (keyword.value.length > 0) {
    API.post(`/v0/mix/blog/search`, { keyword: keyword.value })
      .then((resp: AxiosResponse) => {
        searchRes.value = resp.data.markdowns as blog[];
      })
      .finally(() => {
        loading.value = false;
      });
  }
};

const search = () => {
  loading.value = true;
  doSearch();
};
const doSearch = debounce(queryEs, 500);

const init = () => {
  loading.value = false;
  keyword.value = "";
  searchRes.value = [];
};

const focus = () => {
  (searchInput.value as any).focus();
};
</script>

<template>
  <div class="nav-search-icon" @click="showDialog = true">
    <div i-ion-search />
  </div>

  <el-dialog
    class="nav-search nav-search-modal"
    v-model="showDialog"
    @closed="init"
    @opened="focus"
    :show-close="false"
  >
    <template #header>
      <div class>
        <el-input
          ref="searchInput"
          class="nav-search nav-search-input"
          v-model="keyword"
          :clearable="true"
          @input="search"
          placeholder="搜索"
        >
          <template #prefix>
            <div i-ion-search />
          </template>
        </el-input>
      </div>
    </template>
    <el-scrollbar
      v-show="keyword?.length === 0 || loading || searchRes.length > 0"
      v-load="loading"
      style="height: calc(100% - 50px)"
    >
      <el-card
        v-for="(post, idx) in searchRes"
        :key="idx"
        shadow="hover"
        class="nav-search nav-search-result-item"
      >
        <a :href="post.markdownPath.replace('.md', '.html')">
          <h1
            v-show="post.highlight.title?.length > 0"
            v-html="
              post.highlight.title ? h1svg + post.highlight.title[0] : undefined
            "
          />
          <h2
            v-show="post.highlight.description?.length > 0"
            v-html="
              post.highlight.description
                ? post.highlight.description[0]
                : undefined
            "
          />
          <h3
            v-show="post.highlight.content?.length > 0"
            v-html="
              post.highlight.content ? post.highlight.content[0] : undefined
            "
          />
        </a>
      </el-card>
    </el-scrollbar>
    <el-empty
      v-show="keyword.length > 0 && !loading && searchRes.length === 0"
      description="没有找到结果"
    />
  </el-dialog>
</template>

<style scoped>
.nav-search-icon {
  color: inherit;
  transition: opacity 0.2s ease;
  opacity: 0.6;
}
</style>
