<template>
  <el-tag :size="size" :type="type" >
    <slot />
  </el-tag>
</template>
<script lang="ts" setup>
import { ElTag } from "element-plus";

const props = defineProps<{
  t: string;
  s: string;
}>();

const size = () => {
  switch (props.t) {
    case "s":
      return "small";
    default:
      return "small";
  }
};

const type = ref("");

onMounted(() => {
  switch (props.t) {
    case "tip":
      type.value = "success";
    default:
      type.value = "success";
  }
});
</script>
