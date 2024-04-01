<script setup lang="ts">
import { onMounted, ref } from "vue";
import plan from "./plan.vue";
import { genRandomStr } from "@/utils/alomerry";
import { ElMessage, UploadInstance } from "element-plus";
import { Check, Picture, Upload } from "@element-plus/icons-vue";
import type { UploadUserFile } from "element-plus";
import { sgsDelaySummary, sgsDelaySummaryStatus, sgsMerge } from "@/api/sgs";
import {
  delaySummarySuccess,
  STEP_A,
  STEP_B,
  STEP_REASON,
  STEP_RESULT,
  validFileTypes,
  GuideStep,
  beforeUpload
} from "./constant";
import qrcode from "./qrcode.vue";
import barcode from "./barcode.vue";
import intro from "intro.js";
import "intro.js/minified/introjs.min.css";

defineOptions({
  name: "ProductSgsDelaySummary"
});

const onGuide = () => {
  intro()
    .setOptions({
      steps: [
        {
          element: document.querySelector(".delay-help-upload") as
            | string
            | HTMLElement,
          title: "上传【月报】必需项",
          intro: "可多选，会自动合并。",
          position: "left"
        },
        {
          element: document.querySelector(".delay-help-handle") as
            | string
            | HTMLElement,
          title: "处理月报必需项",
          intro: "如果上传多个文件，需要等待后代合并完成后才能进入下一项。",
          position: "right"
        },
        {
          element: document.querySelector(".delay-help-reset") as
            | string
            | HTMLElement,
          title: "重置流程",
          intro: "如果操作错误，可重置重新开始流程。",
          position: "right"
        },
        {
          element: document.querySelector(".delay-help-exec") as
            | string
            | HTMLElement,
          title: "计算生成月报/下载月报",
          intro:
            "准备好所有必需项后，方可以执行。执行后等待任务完成后即可下载。",
          position: "right"
        }
      ]
    })
    .start();
};

const currentStep = ref(0); // 当前步骤
const nextStep = (idx: number | null) => {
  if (idx !== null) {
    if (idx === 0) {
      randomString.value = genRandomStr(10);
      queryFlag.value = false;
    }
    currentStep.value = idx;
    return;
  }
  if (currentStep.value < 3) {
    currentStep.value++;
  }
};
const randomString = ref(genRandomStr(10));
const loading = ref<Map<string, boolean>>(
  new Map<string, boolean>([
    ["A", false],
    ["B", false],
    ["Reason", false],
    ["Result", false],
    ["Download", false]
  ])
);
const dataA = ref<UploadUserFile[]>([]); // 数据源 A
const dataB = ref<UploadUserFile[]>([]); // 数据源 B
const dataReason = ref<UploadUserFile[]>([]); // 未出数据
const uploadA = ref<UploadInstance>();
const uploadB = ref<UploadInstance>();
const uploadReason = ref<UploadInstance>();

const merge = async (step: string) => {
  loading.value.set(step, true);
  try {
    await sgsMerge({
      code: randomString.value,
      type: step
    });
  } catch (e) {
    ElMessage.error(e.data);
  } finally {
    nextStep(null);
    loading.value.set(step, false);
    switch (step) {
      case STEP_A:
        dataA.value = [];
      case STEP_B:
        dataB.value = [];
      case STEP_REASON:
        dataReason.value = [];
    }
  }
};
const doDelaySummary = () => {
  loading.value.set(STEP_RESULT, true);
  sgsDelaySummary({ code: randomString.value }).catch(e =>
    ElMessage.error(e.data)
  );
  queryFlag.value = true;
  queryStatus();
};

const queryFlag = ref(false);
const queryStatusInterval = 5000;
const queryStatus = () => {
  if (queryFlag.value) {
    sgsDelaySummaryStatus(randomString.value)
      .then(resp => {
        return resp.status as number;
      })
      .then(status => {
        if (status < delaySummarySuccess) {
          setTimeout(queryStatus, queryStatusInterval);
        } else {
          nextStep(4);
          loading.value.set(STEP_RESULT, false);
          nextStep(5);
        }
      })
      .catch(error => {
        console.error("Error:", error);
        setTimeout(queryStatus, queryStatusInterval);
      });
  }
};

const apiUnhealthy = ref(false);
onMounted(() => {
  // check apiHealth
  setTimeout(function () {
    apiUnhealthy.value = true;
  }, 1000);
});
</script>

<template>
  <el-card class="sgs-delay-summary" shadow="never" :disabled="apiUnhealthy">
    <template #header>
      <el-button
        type="primary"
        tag="div"
        color="#626aef"
        plain
        @click="onGuide"
      >
        操作说明
      </el-button>
      <el-button type="primary" tag="div" color="red" plain>
        机器状态：不可用
      </el-button>
    </template>
    <plan />
    <el-steps
      :active="currentStep"
      :disabled="apiUnhealthy"
      class="mt-8 mb-6"
      align-center
      finish-status="success"
    >
      <el-step
        v-loading="loading.get(STEP_A)"
        title="上传【数据源 A】"
        :icon="Upload"
      >
        <template #description>
          <el-card v-if="currentStep === 0" shadow="never" class="mt-8">
            <template #default>
              <el-upload
                ref="uploadA"
                v-model:file-list="dataA"
                name="excels"
                multiple
                :action="`/v0/sgs/upload?type=${STEP_A}&code=${randomString}`"
                :before-upload="value => beforeUpload(validFileTypes)(value)"
              >
                <template #trigger>
                  <div>
                    <el-button
                      class="delay-help-upload"
                      type="primary"
                      size="small"
                      color="#626aef"
                    >
                      上传
                    </el-button>
                  </div>
                </template>
                &nbsp;
                <el-button
                  class="delay-help-handle"
                  type="primary"
                  size="small"
                  @click="merge(STEP_A)"
                >
                  处理
                </el-button>
                <template #tip>
                  <div class="el-upload__tip">
                    仅支持
                    <template
                      v-for="(fileType, idx) in validFileTypes"
                      :key="fileType"
                    >
                      <template v-if="idx !== 0"> /</template>
                      {{ fileType }}
                    </template>
                  </div>
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
        </template>
      </el-step>
      <el-step
        v-loading="loading.get(STEP_B)"
        title="上传【数据源 B】"
        :icon="Upload"
      >
        <template #description>
          <el-card v-if="currentStep === 1" shadow="never" class="mt-8">
            <template #default>
              <el-upload
                ref="uploadB"
                v-model:file-list="dataB"
                name="excels"
                :action="`/v0/sgs/upload?type=${STEP_B}&code=${randomString}`"
                multiple
                :before-upload="value => beforeUpload(validFileTypes)(value)"
              >
                <template #trigger>
                  <el-button type="primary" size="small" color="#626aef"
                    >上传
                  </el-button>
                </template>
                &nbsp;
                <el-button type="primary" size="small" @click="merge(STEP_B)">
                  处理
                </el-button>
                <template #tip>
                  <div class="el-upload__tip">
                    仅支持
                    <template
                      v-for="(fileType, idx) in validFileTypes"
                      :key="fileType"
                    >
                      <template v-if="idx !== 0"> /</template>
                      {{ fileType }}
                    </template>
                  </div>
                </template>
              </el-upload>
            </template>
          </el-card>
          <el-button
            v-if="currentStep > 1"
            size="large"
            class="mt-8"
            type="success"
            :icon="Check"
            circle
          />
        </template>
      </el-step>
      <el-step
        v-loading="loading.get(STEP_REASON)"
        title="上传【未出数据】"
        :icon="Upload"
      >
        <template #description>
          <el-card v-if="currentStep === 2" shadow="never" class="mt-8">
            <template #default>
              <el-upload
                ref="uploadReason"
                v-model:file-list="dataReason"
                name="excels"
                :action="`/v0/sgs/upload?type=${STEP_REASON}&code=${randomString}`"
                multiple
                :before-upload="value => beforeUpload(validFileTypes)(value)"
              >
                <template #trigger>
                  <el-button type="primary" size="small" color="#626aef"
                    >上传
                  </el-button>
                </template>
                &nbsp;
                <el-button
                  type="primary"
                  size="small"
                  @click="merge(STEP_REASON)"
                >
                  处理
                </el-button>
                <template #tip>
                  <div class="el-upload__tip">
                    仅支持
                    <template
                      v-for="(fileType, idx) in validFileTypes"
                      :key="fileType"
                    >
                      <template v-if="idx !== 0"> /</template>
                      {{ fileType }}
                    </template>
                  </div>
                </template>
              </el-upload>
            </template>
          </el-card>
          <el-button
            v-if="currentStep > 2"
            size="large"
            class="mt-8"
            type="success"
            :icon="Check"
            circle
          />
        </template>
      </el-step>
      <el-step
        v-loading="loading.get(STEP_RESULT)"
        title="执行"
        :icon="Picture"
        description="Some description"
      >
        <template v-if="currentStep === 4" #description>
          <el-button
            size="large"
            class="mt-8"
            type="success"
            :icon="Check"
            circle
          />
        </template>
      </el-step>
    </el-steps>
    <el-row class="mb-8 mt-8" justify="center">
      <el-col :span="12" :offset="6">
        <el-button
          class="delay-help-reset"
          :disabled="apiUnhealthy"
          @click="nextStep(0)"
        >
          重置
        </el-button>
        <el-button
          v-if="currentStep < 5"
          class="delay-help-exec"
          type="success"
          :disabled="
            currentStep < 3 ||
            loading.get(STEP_RESULT) ||
            (false && apiUnhealthy)
          "
          plain
          @click="doDelaySummary()"
        >
          执行
        </el-button>
        <el-link v-else :href="`/v0/sgs/download/${randomString}.zip`">
          <el-button type="primary" plain> 下载</el-button>
        </el-link>
      </el-col>
    </el-row>
    <qrcode />
    <barcode />
  </el-card>
</template>
