<script setup lang="ts">
import { KubernetesResourceType } from "@/views/alomerry/k8s/k8s/constant";
import { namespacePods } from "@/api/k8s";
import { watch, ref } from "vue";
import { useColumns } from "@/views/alomerry/k8s/k8s/components/resource-table/columns";

interface tableItem {
  namespace: string;
  type: KubernetesResourceType;
  name: string;
  ip?: string;
  imageVersion?: string;
  restartTimes?: number;
  status?: string;
  createdAt: string;
}

const props = defineProps({
  data: {
    type: Array<namespacePods>
  }
});

const {
  columns,
  search,
  loading,
  loadingConfig,
  adaptiveConfig,
  pagination,
  onSizeChange,
  onCurrentChange
} = useColumns();
const resources = ref([]);

watch(
  () => props.data,
  newResources => {
    setupResources(newResources);
  }
);

const setupResources = (v: namespacePods[]) => {
  resources.value = v.flatMap(item => {
    if (item.pods) {
      return item.pods.map(pod => {
        return {
          namespace: pod.namespace,
          type: KubernetesResourceType.Pod,
          name: pod.name,
          status: pod.status,
          ip: pod?.ip,
          imageVersion: pod?.imageVersion,
          createdAt: pod.createdAt
        } as tableItem;
      });
    }
  });
};
</script>

<template>
  <pure-table
    stripe
    adaptive
    :data="resources"
    table-layout="auto"
    :columns="columns"
    :adaptiveConfig="adaptiveConfig"
    :default-sort="{ prop: 'createdAt', order: 'descending' }"
    :loading="loading"
    :loading-config="loadingConfig"
    :pagination="pagination"
    @page-size-change="onSizeChange"
    @page-current-change="onCurrentChange"
  />
</template>

<style scoped lang="scss"></style>
