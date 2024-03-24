<script setup lang="ts">
import {
  KubernetesPodStatus,
  KubernetesResourceType
} from "@/views/alomerry/k8s/k8s/constant";
import { listResourcesResp } from "@/api/k8s";
import { onMounted, toRefs, watch, ref } from "vue";
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
    type: Object as () => listResourcesResp
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
const { data } = toRefs(props);
const resources = ref([]);

watch(data, async (newData, oldData) => {
  setupResources(newData);
});

const setupResources = (v: listResourcesResp) => {
  resources.value = [...(v?.pods || [])].flatMap(item => {
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

onMounted(() => {
  setupResources(data.value);
});
</script>

<template>
  <pure-table
    stripe
    adaptive
    :data="resources"
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
