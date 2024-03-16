import { database } from "@/router/enums";

const IFrame = () => import("@/layout/frameView.vue");

export default {
  path: "/database",
  redirect: "/database/influxdb",
  meta: {
    icon: "carbon:cloud-monitoring",
    title: "数据库",
    rank: database
  },
  children: [
    {
      path: "/database/influxdb",
      name: "DatabaseInfluxDB",
      // component: () => import("@/views/alomerry/database/influxdb.vue"),
      component: IFrame,
      meta: {
        icon: "simple-icons:influxdb",
        title: "InfluxDB",
        frameSrc: "https://influxdb.alomerry.com",
        keepAlive: true
      }
    },
    {
      path: "/database/mysql",
      name: "DatabaseMySQL",
      component: () => import("@/views/alomerry/database/mysql.vue"),
      meta: {
        title: "MySQL",
        icon: "logos:mysql-icon"
      }
    },
    {
      path: "/database/redis",
      name: "DatabaseRedis",
      component: () => import("@/views/alomerry/database/redis.vue"),
      meta: {
        title: "Redis",
        icon: "devicon:redis"
      }
    },
    {
      path: "/database/clickhouse",
      name: "DatabaseClickhouse",
      component: () => import("@/views/alomerry/database/clickhouse.vue"),
      meta: {
        title: "Clickhouse",
        icon: "simple-icons:clickhouse"
      }
    },
    {
      path: "/database/mongodb",
      name: "DatabaseMongoDB",
      component: () => import("@/views/alomerry/database/mongodb.vue"),
      meta: {
        title: "MongoDB",
        icon: "devicon:mongodb"
      }
    }
  ]
} satisfies RouteConfigsTable;
