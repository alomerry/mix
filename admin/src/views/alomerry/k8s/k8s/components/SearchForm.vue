<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { KubernetesResourceType } from "@/views/alomerry/k8s/k8s/constant";
import Resource from "@/views/alomerry/k8s/k8s/components/search-form/Resource.vue";
import Namespace from "@/views/alomerry/k8s/k8s/components/search-form/Namespace.vue";
import { listResources, listResourcesResp } from "@/api/k8s";

const searchForm = reactive({
  namespaces: [],
  resourceType: KubernetesResourceType.Pod as string
});

const searchLoading = ref(false);

const emit = defineEmits(["resources-changed", "resources-type-changed"]);

const resourceTypeChanged = (newType: string) => {
  searchForm.resourceType = newType;
  emit("resources-type-changed", newType);
  queryKubernetes();
};

const namespacesChanged = (namespaces: string[]) => {
  searchForm.namespaces = namespaces;
  queryKubernetes();
};

const queryKubernetes = () => {
  // TODO 防抖
  searchLoading.value = true;
  listResources({
    namespaces: searchForm.namespaces,
    resourceTypes: searchForm.resourceType
      ? [searchForm.resourceType as string]
      : []
  })
    .then((res: listResourcesResp) => {
      emit("resources-changed", res.namespacePods);
    })
    .finally(() => {
      searchLoading.value = false;
    });
};

onMounted(() => {
  queryKubernetes();
});
</script>

<template>
  <el-form :model="searchForm" :inline="true" label-width="auto">
    <Namespace
      :namespaces="searchForm.namespaces"
      @namespace-changed="namespaces => namespacesChanged(namespaces)"
    />
    <Resource
      :types="searchForm.resourceType"
      @type-changed="newType => resourceTypeChanged(newType)"
    />
    <!--
    <el-form-item>
      <el-button :loading="searchLoading" @click="queryKubernetes"
        >查询</el-button
      >
    </el-form-item>
    -->
  </el-form>
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
