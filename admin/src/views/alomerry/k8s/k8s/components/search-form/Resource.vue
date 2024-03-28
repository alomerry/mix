<script setup lang="ts">
import { ref } from "vue";
import {
  colors,
  KubernetesResourceType
} from "@/views/alomerry/k8s/k8s/constant";
import { Option } from "@/views/alomerry/k8s/k8s/components/search-form/model";

interface ResourceProp {
  resourceType?: KubernetesResourceType; // 选中的资源类型
}

const resourceTypeOptions = ref<Array<Option>>(
  Array.from(Object.values(KubernetesResourceType)).map(
    type =>
      ({
        value: KubernetesResourceType[type],
        label: KubernetesResourceType[type]
      }) as Option
  )
);

const emit = defineEmits(["type-changed"]);
const props = withDefaults(defineProps<ResourceProp>(), {});

const resourceType = ref(props.resourceType);
</script>

<template>
  <el-form-item>
    <el-select
      v-model="resourceType"
      placeholder="资源类型"
      style="width: 240px"
      filterable
      clearable
      @change="emit('type-changed', resourceType)"
    >
      <el-option
        v-for="(type, idx) in resourceTypeOptions"
        :key="type.value"
        :label="type.label"
        :value="type.value"
      >
        <div class="flex items-center">
          <el-tag :color="colors[idx]" style="margin-right: 8px" size="small" />
          <span :style="{ color: colors[idx] }">{{ type.label }}</span>
        </div>
      </el-option>
    </el-select>
  </el-form-item>
</template>

<style scoped>
.el-tag {
  border: none;
  aspect-ratio: 1;
}
</style>
