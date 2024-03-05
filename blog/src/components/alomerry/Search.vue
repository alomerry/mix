<script setup lang="ts">
import { ref } from "vue";
import { ElDialog, ElInput, ElCard, ElScrollbar, ElEmpty } from "element-plus";

const loading = ref(true);
const state = ref("");
const dialogVisible = ref(false);
const doSearch = () => {
  loading.value = true;
  console.log("searching");
  setTimeout(function () {
    loading.value = false;
    console.log("search done");
  }, 3000);
  // 防抖
  if (state.value.length === 0) {
    return;
  }
  if (state.value.length === 3) {
    res.value = [];
  } else {
    res.value = [
      {
        content: "1234",
      },
      {
        content: "1234",
      },
      {
        content: "1234",
      },
      {
        content: "1234",
      },
      {
        content: "1234",
      },
      {
        content: "1234",
      },
      {
        content: "1234",
      },
    ];
  }
};
const res = ref([
  {
    content: "1234",
  },
  {
    content: "1234",
  },
  {
    content: "1234",
  },
  {
    content: "1234",
  },
  {
    content: "1234",
  },
  {
    content: "1234",
  },
  {
    content: "1234",
  },
]);
</script>

<template>
  <div class="nav-search" @click="dialogVisible = true">
    <div i-ion-search />
  </div>

  <el-dialog
    class="nav-search nav-search-modal"
    v-model="dialogVisible"
    :show-close="false"
  >
    <template #header>
      <div class>
        <el-input
          class="nav-search nav-search-input"
          v-model="state"
          :clearable="true"
          @change="doSearch"
          @input="doSearch"
          placeholder="搜索"
        >
          <template #prefix>
            <div i-ion-search />
          </template>
        </el-input>
      </div>
    </template>
    <template v-if="res.length === 0 && state.length !== 0">
      <el-empty description="没有找到结果" />
    </template>
    <template v-else>
      <el-scrollbar v-load="loading" style="height: calc(100% - 50px)">
        <el-card
          v-for="(post, idx) in res"
          :key="idx"
          class="nav-search nav-search-result-item"
        >
          <p>{{ post.content }}</p>
        </el-card>
      </el-scrollbar>
    </template>
  </el-dialog>
</template>

<style scoped>
.nav-search {
  color: inherit;
  transition: opacity 0.2s ease;
  opacity: 0.6;
}
</style>
