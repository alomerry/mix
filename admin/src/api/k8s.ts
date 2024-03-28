import { http } from "@/utils/http";

export type listResourcesReq = {
  namespaces: string[];
};

export type listResourcesResp = {
  namespacePods: namespacePods[];
};

export const listResources = (data?: listResourcesReq) => {
  return http.request<listResourcesResp>("post", `/v0/mix/k8s/resources`, {
    data
  });
};

export type listNamespacesResp = {
  namespaces: Array<string>;
};

export type listNamespacesReq = {
  namespaces: string[];
};

export const listNamespaces = (data?: listNamespacesReq) => {
  return http.request<listNamespacesResp>("post", `/v0/mix/k8s/namespaces`, {
    data
  });
};

export type restartResourcesReq = {
  namespace: string;
  deployment: string;
};

export const restartDeployment = (data?: restartResourcesReq) => {
  return http.request<listNamespacesResp>(
    "post",
    `/v0/mix/k8s/deployment/restart`,
    {
      data
    }
  );
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
