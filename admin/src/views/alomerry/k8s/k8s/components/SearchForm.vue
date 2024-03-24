<script setup lang="ts">
import { reactive } from "vue";
import {
  KubernetesNamespace,
  KubernetesResourceType
} from "@/views/alomerry/k8s/k8s/constant";
import Resource from "@/views/alomerry/k8s/k8s/components/search-form/Resource.vue";
import Namespace from "@/views/alomerry/k8s/k8s/components/search-form/Namespace.vue";

const searchForm = reactive({
  namespaces: [KubernetesNamespace.Default],
  resourceTypes: [KubernetesResourceType.Pod]
});

const emit = defineEmits(["data-changed"]);

const queryKubernetes = () => {
  let length = Math.ceil(Math.random() * 10);
  let data = ["123"];
  for (let i = 0; i < length; i++) {
    data.push(`${i}`);
  }
  emit("data-changed", data);
};
</script>

<template>
  <el-form :model="searchForm" :inline="true" label-width="auto">
    <Namespace
      :namespaces="searchForm.namespaces"
      @namespace-changed="namespaces => (searchForm.namespaces = namespaces)"
    />
    <Resource
      :types="searchForm.resourceTypes"
      @type-changed="types => (searchForm.resourceTypes = types)"
    />
    <el-button @click="queryKubernetes">查询</el-button>
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
