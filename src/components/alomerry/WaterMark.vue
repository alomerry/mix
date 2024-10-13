<script setup lang="ts">
import { ElWatermark } from "element-plus";
import "element-plus/es/components/watermark/style/css";

const config = reactive({
  content: "清欢",
  font: {
    fontSize: 24,
    fontFamily: "LXGW WenKai",
    color: "rgba(0, 0, 0, 0.15)",
  },
});
</script>

<template>
  <el-watermark :font="config.font" :content="config.content">
    <slot />
  </el-watermark>
</template>
