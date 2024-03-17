import { ppt } from "@/router/enums";
import { hidden } from "@/router/hidden";
const IFrame = () => import("@/layout/frameView.vue");

export default {
  path: "/ppt",
  redirect: "/ppt/index",
  meta: {
    showLink: hidden,
    icon: "ri:file-ppt-2-line",
    title: "PPT",
    rank: ppt
  },
  children: [
    {
      path: "/ppt/index",
      name: "FramePpt",
      component: IFrame,
      meta: {
        title: "PPT",
        frameSrc: "https://pipipi-pikachu.github.io/PPTist/",
        frameLoading: false
      }
    }
  ]
} satisfies RouteConfigsTable;
