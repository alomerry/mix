import { http } from "@/utils/http";

type SgsMergeReq = {
  code: string;
  type: string;
};

type SgsCodeReq = {
  code: string;
};

export const sgsMerge = (data: SgsMergeReq) => {
  return http.request<object>("post", "/v0/sgs/merge", { data });
};

export const sgsDelaySummary = (data: SgsCodeReq) => {
  return http.request<object>("post", `/v0/sgs/delay-summary`, {
    data
  });
};

export const sgsDelaySummaryStatus = (code: string) => {
  return http.request<object>("get", `/v0/sgs/status?code=${code}`);
};
