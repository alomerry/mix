import { http } from "@/utils/http";

export type listNamespacesResp = {
  namespaces: Array<string>;
};

export type listResourcesResp = {
  pods: namespacePods[];
};

export const listNamespaces = (keyword: string) => {
  return http.request<listNamespacesResp>("get", `/v0/mix/k8s/namespaces`);
};

export const listResources = () => {
  return http.request<listResourcesResp>("get", `/v0/mix/k8s/namespaces`);
};

export type namespacePods = {
  namespace: string;
  pods: pod[];
};

export type pod = {
  name: string;
  namespace: string;
  ip?: string;
  imageVersion?: string;
  createdAt: string;
  status: string;
};
