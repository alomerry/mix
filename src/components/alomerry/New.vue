<script setup lang="ts">
import { ElBadge } from "element-plus";

defineProps<{
  txt?: string;
}>();
</script>

<template>
  <el-badge :value="txt || 'New'">
    <slot />
  </el-badge>
</template>
