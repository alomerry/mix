import { mq } from "@/router/enums";

const IFrame = () => import("@/layout/frameView.vue");

export default {
  path: "/mq",
  redirect: "/mq/index",
  meta: {
    icon: "carbon:message-queue",
    title: "消息队列",
    rank: mq
  },
  children: [
    {
      path: "/mq/kafka",
      name: "Kafka",
      component: IFrame,
      meta: {
        icon: "mdi:apache-kafka",
        title: "Kafka",
        frameSrc: "https://www.baidu.com",
        keepAlive: true
      }
    },
    {
      path: "/log/index",
      name: "Log",
      component: () => import("@/views/alomerry/log/index.vue"),
      meta: {
        title: "TODO"
      }
    }
  ]
} satisfies RouteConfigsTable;
