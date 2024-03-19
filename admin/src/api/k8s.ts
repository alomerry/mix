import { http } from "@/utils/http";

type getK8sNamespacesResp = {
  namespaces: Array<string>;
};

export const getK8sNamespaces = (keyword: string) => {
  return http.request<getK8sNamespacesResp>("get", `/v0/mix/k8s/namespaces`);
};
