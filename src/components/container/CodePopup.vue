<script lang="ts" setup>
import { ElPopover } from "element-plus";

defineProps<{
  name: string;
}>();
</script>

<template>
  <el-popover trigger="hover">
    <slot/>
    <template #reference>
      <span>
        {{ `${name} ` }}
      </span>
    </template>
  </el-popover>
</template>

<style scoped></style>
