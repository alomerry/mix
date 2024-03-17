import { cicd } from "@/router/enums";

export default {
  path: "/cicd",
  redirect: "/cicd/deploy/index",
  meta: {
    icon: "material-symbols:cloudbuild",
    title: "CI/CD",
    rank: cicd
  },
  children: [
    {
      path: "/cicd/deploy/index",
      name: "CiCdDeploy",
      component: () => import("@/views/alomerry/cicd/deploy/index.vue"),
      meta: {
        icon: "logos:deployhq-icon",
        title: "发布"
      }
    },
    {
      path: "/cicd/build/index",
      name: "CiCdBuild",
      component: () => import("@/views/alomerry/cicd/build/index.vue"),
      meta: {
        icon: "logos:buildkite-icon",
        title: "构建"
      }
    }
  ]
} satisfies RouteConfigsTable;
