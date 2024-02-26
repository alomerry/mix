<template>
  <el-timeline>
    <el-timeline-item
      v-for="(act, idx) in acts"
      :key="idx"
      :type="act.type || 'info'"
      :hollow="act.hollow !== undefined ? act.hollow : idx + 1 !== acts.length"
      :timestamp="act.time"
    >
      {{ act.content }}
    </el-timeline-item>
  </el-timeline>
</template>
<script setup lang="ts">
import { ElTimeline, ElTimelineItem } from "element-plus";
import { timeline } from "~/alomerry";

const props = defineProps<{
  acts: timeline[];
}>();
</script>
