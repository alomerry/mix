import { defineFakeRoute } from "vite-plugin-fake-server/client";

export default defineFakeRoute([
  {
    url: "/v0/mix/k8s/resources",
    method: "post",
    response: ({}) => {
      return {
        namespacePods: [
          {
            namespace: "alomerry",
            pods: [
              {
                namespace: "alomerry",
                name: "mix-gw-deployment-68d584cb46-pkpml",
                status: "Running",
                createdAt: "2024-03-27 21:00:50"
              },
              {
                namespace: "alomerry",
                name: "mix-module-admin-deployment-686bc666f-s77z4",
                status: "Running",
                createdAt: "2024-03-27 21:08:05"
              },
              {
                namespace: "alomerry",
                name: "mix-module-blog-deployment-65bd8f586-kdnd6",
                status: "Running",
                createdAt: "2024-03-27 21:01:59"
              },
              {
                namespace: "alomerry",
                name: "mix-module-k8s-deployment-5f7c679f5-mksml",
                status: "Running",
                createdAt: "2024-03-27 21:00:48"
              },
              {
                namespace: "alomerry",
                name: "mysql-8-deployment-fdb87d4bb-jjbtf",
                status: "Running",
                createdAt: "2024-03-24 07:29:53"
              },
              {
                namespace: "alomerry",
                name: "redis-deployment-single-f786cd845-8rzrk",
                status: "Running",
                createdAt: "2024-03-25 09:28:13"
              },
              {
                namespace: "alomerry",
                name: "redis6-alomerry-0",
                status: "Running",
                createdAt: "2024-03-24 19:21:26"
              },
              {
                namespace: "alomerry",
                name: "redis6-alomerry-1",
                status: "Running",
                createdAt: "2024-03-24 19:21:51"
              },
              {
                namespace: "alomerry",
                name: "redis6-alomerry-2",
                status: "Running",
                createdAt: "2024-03-24 19:22:17"
              },
              {
                namespace: "alomerry",
                name: "redis6-alomerry-3",
                status: "Running",
                createdAt: "2024-03-24 19:22:44"
              },
              {
                namespace: "alomerry",
                name: "redis6-alomerry-4",
                status: "Running",
                createdAt: "2024-03-24 19:23:09"
              },
              {
                namespace: "alomerry",
                name: "redis6-alomerry-5",
                status: "Running",
                createdAt: "2024-03-24 19:23:11"
              },
              {
                namespace: "alomerry",
                name: "umami-deployment-7898cbdf69-ljp9w",
                status: "Running",
                createdAt: "2024-03-24 07:35:00"
              },
              {
                namespace: "alomerry",
                name: "waline-blog-deployment-564cfbf7ff-22hjt",
                status: "Running",
                createdAt: "2024-03-24 07:49:03"
              }
            ]
          },
          {
            namespace: "default",
            pods: [
              {
                namespace: "default",
                name: "elasticsearch-es-default-0",
                status: "Running",
                createdAt: "2024-03-24 09:53:21"
              },
              {
                namespace: "default",
                name: "elasticsearch-es-default-1",
                status: "Running",
                createdAt: "2024-03-24 09:53:22"
              },
              {
                namespace: "default",
                name: "elasticsearch-es-default-2",
                status: "Running",
                createdAt: "2024-03-24 09:53:22"
              },
              {
                namespace: "default",
                name: "kibana-kb-5ccff484c7-jvwmq",
                status: "Running",
                createdAt: "2024-03-24 12:49:01"
              }
            ]
          }
        ]
      };
    }
  },
  {
    url: "/v0/mix/k8s/namespaces",
    method: "post",
    response: ({}) => {
      return {
        namespaces: ["namespace1", "namespace2", "default"]
      };
    }
  }
]);
