import { ref } from "vue";

export const KubernetesResourceType = [
  "Pod",
  "Service",
  "Deployment",
  "Ingress"
];

export const KubernetesResourceTypeOptions = ref(
  Array.from(KubernetesResourceType).map(value => ({
    value: value,
    label: value
  }))
);

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
