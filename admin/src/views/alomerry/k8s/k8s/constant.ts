export enum KubernetesNamespace {
  Default = "default"
}

export enum KubernetesResourceType {
  Pod = "Pod",
  Service = "Service",
  Deployment = "Deployment",
  Ingress = "Ingress"
}

export enum KubernetesPodStatus {
  Pending = "Pending",
  Running = "Running",
  Terminating = "Terminating"
}

export const KubernetesPodStatusColor = new Map([
  [KubernetesPodStatus.Running, "#28a745"],
  [KubernetesPodStatus.Pending, "#c9c6c6"],
  [KubernetesPodStatus.Terminating, "#ee3f4d"]
]);

export const colors = [
  "#74759b",
  "#d0351a",
  "#e58441",
  "#dec109",
  "#02be90",
  "#ee3f4d",
  "#1EC79D",
  "#0f59a4",
  "#14CCCC",
  "#158bb8",
  "#ffa60f",
  "#2bae85",
  "#efafad",
  "#1a6840",
  "#FF6600",
  "#4167F0",
  "#6222C9"
];
