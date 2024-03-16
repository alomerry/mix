<script setup lang="ts">
import { useColumns } from "./table";
defineOptions({
  name: "ProductTodo"
});
const { columns, dataList } = useColumns();
</script>

<template>
  <div class="flex">
    <pure-table row-key="id" :data="dataList" :columns="columns" />
  </div>
</template>
