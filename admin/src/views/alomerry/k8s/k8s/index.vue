<script setup lang="ts">
import {
  KubernetesResourceTypeOptions,
  colors
} from "@/views/alomerry/k8s/k8s/constant";
import { ref, reactive, onMounted } from "vue";
import { getK8sNamespaces } from "@/api/k8s";
defineOptions({
  name: "KubernetesIndex"
});

// do not use same name with ref
const form = reactive({
  name: "",
  region: "",
  date1: "",
  date2: "",
  delivery: false,
  type: [],
  resource: "",
  desc: ""
});

const k8sResourceTypes = ref([]);

const onSubmit = () => {
  console.log("submit!");
};

onMounted(() => {
  fetchNamespaces("");
});

const selectedNamespace = ref([]);
const namespaces = ref([]);
const namespaceSelectLoading = ref(false);
const queryNamespaces = (query: string) => {
  if (!query) {
    return;
  }
  fetchNamespaces(query);
};

const fetchNamespaces = (query: string) => {
  namespaceSelectLoading.value = true;
  getK8sNamespaces(query)
    .then(resp => {
      namespaces.value = Array.from(resp.namespaces).map(value => ({
        value: value,
        label: value
      }));
    })
    .catch(error => {
      console.error("Error:", error);
    })
    .finally(() => {
      namespaceSelectLoading.value = false;
    });
};
</script>

<template>
  <el-card>
    <el-form :model="form" :inline="true" label-width="auto">
      <el-form-item>
        <el-select
          v-model="selectedNamespace"
          multiple
          clearable
          filterable
          remote
          reserve-keyword
          placeholder="命名空间"
          :remote-method="queryNamespaces"
          :loading="namespaceSelectLoading"
          style="width: 240px"
        >
          <el-option
            v-for="(item, idx) in namespaces"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <div class="flex items-center">
              <el-tag
                :color="colors[idx]"
                style="margin-right: 8px"
                size="small"
              />
              <span :style="{ color: colors[idx] }">{{ item.label }}</span>
            </div>
          </el-option>
          <template #loading>
            <el-icon class="is-loading">
              <svg class="circular" viewBox="0 0 20 20">
                <g
                  class="path2 loading-path"
                  stroke-width="0"
                  style="animation: none; stroke: none"
                >
                  <circle r="3.375" class="dot1" rx="0" ry="0" />
                  <circle r="3.375" class="dot2" rx="0" ry="0" />
                  <circle r="3.375" class="dot4" rx="0" ry="0" />
                  <circle r="3.375" class="dot3" rx="0" ry="0" />
                </g>
              </svg>
            </el-icon>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="k8sResourceTypes"
          placeholder="资源类型"
          style="width: 240px"
          filterable
          clearable
          multiple
        >
          <el-option
            v-for="(item, idx) in KubernetesResourceTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <div class="flex items-center">
              <el-tag
                :color="colors[idx]"
                style="margin-right: 8px"
                size="small"
              />
              <span :style="{ color: colors[idx] }">{{ item.label }}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-divider />
    xxx
  </el-card>
</template>
<style>
.el-select-dropdown__loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  font-size: 20px;
}

.circular {
  display: inline;
  height: 30px;
  width: 30px;
  animation: loading-rotate 2s linear infinite;
}
.path {
  animation: loading-dash 1.5s ease-in-out infinite;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  stroke-width: 2;
  stroke: var(--el-color-primary);
  stroke-linecap: round;
}
.loading-path .dot1 {
  transform: translate(3.75px, 3.75px);
  fill: var(--el-color-primary);
  animation: custom-spin-move 1s infinite linear alternate;
  opacity: 0.3;
}
.loading-path .dot2 {
  transform: translate(calc(100% - 3.75px), 3.75px);
  fill: var(--el-color-primary);
  animation: custom-spin-move 1s infinite linear alternate;
  opacity: 0.3;
  animation-delay: 0.4s;
}
.loading-path .dot3 {
  transform: translate(3.75px, calc(100% - 3.75px));
  fill: var(--el-color-primary);
  animation: custom-spin-move 1s infinite linear alternate;
  opacity: 0.3;
  animation-delay: 1.2s;
}
.loading-path .dot4 {
  transform: translate(calc(100% - 3.75px), calc(100% - 3.75px));
  fill: var(--el-color-primary);
  animation: custom-spin-move 1s infinite linear alternate;
  opacity: 0.3;
  animation-delay: 0.8s;
}
@keyframes loading-rotate {
  to {
    transform: rotate(360deg);
  }
}
@keyframes loading-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -40px;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -120px;
  }
}
@keyframes custom-spin-move {
  to {
    opacity: 1;
  }
}
</style>
<style scoped>
.el-tag {
  border: none;
  aspect-ratio: 1;
}
</style>
