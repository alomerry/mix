import { k8s } from "@/router/enums";

const IFrame = () => import("@/layout/frameView.vue");

export default {
  path: "/k8s",
  redirect: "/k8s/index",
  meta: {
    icon: "bxl:kubernetes",
    title: "Kubernetes",
    rank: k8s
  },
  children: [
    {
      path: "/k8s/index",
      name: "k8s",
      component: IFrame,
      meta: {
        icon: "carbon:kubernetes",
        title: "k8s",
        frameSrc: "https://www.baidu.com",
        keepAlive: true
      }
    },
    {
      path: "/k8s/istio",
      name: "Istio",
      component: IFrame,
      meta: {
        icon: "simple-icons:istio",
        title: "Istio",
        frameSrc: "https://www.baidu.com",
        keepAlive: true
      }
    },
    {
      path: "/k8s/serverless",
      name: "Serverless",
      component: IFrame,
      meta: {
        icon: "gg:serverless",
        title: "Serverless",
        frameSrc: "https://www.baidu.com",
        keepAlive: true
      }
    }
  ]
} satisfies RouteConfigsTable;
