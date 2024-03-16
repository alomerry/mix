<template>
  <el-alert type="info" show-icon>
    <h3>后续计划</h3>
    <ul>
      <ol v-for="(plan, idx) in plans" :key="idx">
        -
        {{
          plan
        }}
      </ol>
    </ul>
  </el-alert>
</template>

<script setup>
const plans = [
  "计算前校验表格列是否和规范有差异，提示检查差异",
  "计算失败后提供失败原因",
  "计算时展示计算进度"
];
</script>
