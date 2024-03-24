<script setup lang="ts">
import { colors } from "@/views/alomerry/k8s/k8s/constant";
import { ref, onMounted } from "vue";
import { Option } from "@/views/alomerry/k8s/k8s/components/search-form/model";
import { listNamespaces } from "@/api/k8s";

interface NamespaceProp {
  namespaces?: string[]; // 选中的命名空间
}
const emit = defineEmits(["namespace-changed"]);
const props = withDefaults(defineProps<NamespaceProp>(), {});

const namespaces = ref(props.namespaces);

const loading = ref(false);
const namespaceOpts = ref<Array<Option>>();

onMounted(() => {
  fetchNamespaces("");
});

const queryNamespaces = (query: string) => {
  if (!query) {
    return;
  }
  fetchNamespaces(query);
};

const fetchNamespaces = (query: string) => {
  loading.value = true;

  listNamespaces(query)
    .then(resp => {
      namespaceOpts.value = Array.from(resp.namespaces).map(value => ({
        value: value,
        label: value
      }));
    })
    .catch(error => {
      console.error("Error:", error);
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>

<template>
  <el-form-item>
    <el-select
      v-model="namespaces"
      multiple
      clearable
      filterable
      remote
      reserve-keyword
      placeholder="命名空间"
      :remote-method="queryNamespaces"
      :loading="loading"
      style="width: 240px"
      @change="emit('namespace-changed', namespaces)"
    >
      <el-option
        v-for="(item, idx) in namespaceOpts"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
        <div class="flex items-center">
          <el-tag :color="colors[idx]" style="margin-right: 8px" size="small" />
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
</template>

<style scoped lang="scss"></style>
