import { ElMessage, type UploadProps, type UploadRawFile } from "element-plus";
import { getFileTypeByName } from "@/utils/alomerry";

export const delaySummaryEmpty = 0;
export const delaySummaryFailed = 1;
export const delaySummaryProgress = 2;
export const delaySummarySuccess = 3;

export const STEP_A = "A";
export const STEP_B = "B";
export const STEP_REASON = "Reason";
export const STEP_RESULT = "Result";
export const STEP_DOWNLOAD = "Download";

export const validFileTypes = ["xlsx", "csv"];

// 上传文件之前的钩子，参数为上传的文件， 若返回false或者返回 Promise 且被 reject，则停止上传。
export const beforeUpload = (
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
