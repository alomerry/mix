<script setup lang="ts">
import { ref } from "vue";
import { getFileTypeByName } from "@/utils/alomerry/files";
import { ElMessage } from "element-plus";
import { Check } from "@element-plus/icons-vue";
import type { UploadProps, UploadUserFile, UploadRawFile } from "element-plus";

defineOptions({
  name: "ProductSgsMergeExcel"
});

const STEP_A = "A";

const currentStep = ref(0); // 当前步骤
const nextStep = (idx: number | null) => {
  if (idx !== null) {
    currentStep.value = idx;
    return;
  }
  if (currentStep.value < 3) {
    currentStep.value++;
  }
};

const loading = ref<Map<string, boolean>>(
  new Map<string, boolean>([
    ["A", false],
    ["B", false],
    ["Reason", false],
    ["Do", false]
  ])
);
const dataA = ref<UploadUserFile[]>([]); // 数据源 A
const dataB = ref<UploadUserFile[]>([]); // 数据源 B
const dataReason = ref<UploadUserFile[]>([]); // 未出数据
const fileList = ref<UploadUserFile[]>([
  {
    name: "element-plus-logo.svg",
    url: "https://element-plus.org/images/element-plus-logo.svg"
  },
  {
    name: "element-plus-logo2.svg",
    url: "https://element-plus.org/images/element-plus-logo.svg"
  }
]);

// 删除文件之前的钩子，参数为上传的文件和文件列表， 若返回 false 或者返回 Promise 且被 reject，则停止删除。
const handleRemove: UploadProps["onRemove"] = (file, uploadFiles) => {
  console.log(file, uploadFiles);
};

// 上传文件之前的钩子，参数为上传的文件， 若返回false或者返回 Promise 且被 reject，则停止上传。
const beforeUpload = (
  validFileTypes: string[]
): UploadProps["beforeUpload"] => {
  return function (rawFile: UploadRawFile) {
    if (
      !validFileTypes.some(
        validType => getFileTypeByName(rawFile.name) == validType
      )
    ) {
      ElMessage.warning(`仅支持文件类型: ${validFileTypes}`);
      return false;
    }
  };
};

const merge = (step: string) => {
  loading.value.set(step, true);
  // call api to merge
  // get download url for merge file
  // go next step
  sleep(1000).then(() => {
    console.log("merged");
    fileList.value = [
      {
        name: "element-plus-logo.svg",
        url: "https://element-plus.org/images/element-plus-logo.svg"
      }
    ];
    nextStep(null);
    loading.value.set(step, false);
  });
};

function sleep(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}
</script>

<template>
  <el-card shadow="never">
    <el-card v-if="currentStep === 0" shadow="never" class="mt-8">
      <template #default>
        <el-upload
          v-model:file-list="dataA"
          :before-upload="value => beforeUpload(['xlsx', 'csv', 'sh'])(value)"
        >
          <template #trigger>
            <el-button type="primary" size="small" color="#626aef">
              上传
            </el-button>
          </template>
          &nbsp;
          <el-button type="primary" size="small" @click="merge(STEP_A)">
            上传
          </el-button>
          <template #tip>
            <div class="el-upload__tip">仅支持 xlxs</div>
          </template>
        </el-upload>
      </template>
    </el-card>
    <el-button
      v-if="currentStep > 0"
      size="large"
      class="mt-8"
      type="success"
      :icon="Check"
      circle
    />
  </el-card>
</template>

<style lang="scss" scoped></style>
