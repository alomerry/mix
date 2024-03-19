import { product } from "@/router/enums";

const IFrame = () => import("@/layout/frameView.vue");

const sgs = {
  path: "/product/sgs",
  meta: {
    title: "SGS",
    icon: "material-symbols:energy-program-saving-sharp"
  },
  children: [
    {
      path: "/product/sgs/delay-summary",
      name: "ProductSgsDelaySummary",
      component: () =>
        import("@/views/alomerry/product/sgs/delay-summary/index.vue"),
      meta: {
        icon: "vscode-icons:file-type-excel2", //mdi:report-scatter-plot-hexbin
        title: "月报",
        extraIcon: "IF-pure-iconfont-new svg",
        showParent: true
      }
    }
    // {
    //   path: "/product/sgs/merge-excel",
    //   name: "ProductSgsMergeExcel",
    //   component: () =>
    //     import("@/views/alomerry/product/sgs/merge-excel/index.vue"),
    //   meta: {
    //     icon: "arcticons:wpsoffice",
    //     title: "表格合并",
    //     showParent: true
    //   }
    // }
  ]
} as RouteChildrenConfigsTable;

const infancy7k = {
  path: "/product/infancy-7K",
  meta: {
    title: "Infancy-7K",
    icon: "file-icons:adobe-flash"
  },
  children: [
    {
      path: "/product/infancy-7K/admin/index",
      name: "ProductInfancy7KAdmin",
      component: () =>
        import("@/views/alomerry/product/infancy-7K/admin/index.vue"),
      meta: {
        title: "管控"
      }
    },
    {
      path: "/product/infancy-7K/vote/index",
      name: "ProductInfancy7KVote",
      component: () =>
        import("@/views/alomerry/product/infancy-7K/vote/index.vue"),
      meta: {
        title: "投票"
      }
    },
    {
      path: "/product/infancy-7K/comment/index",
      name: "ProductInfancy7KComment",
      component: () =>
        import("@/views/alomerry/product/infancy-7K/comment/index.vue"),
      meta: {
        title: "留言"
      }
    }
  ]
} as RouteChildrenConfigsTable;

const todo = {
  path: "/product/todo",
  meta: {
    title: "Todo",
    icon: "vscode-icons:file-type-light-todo"
  },
  children: [
    {
      path: "/product/todo/index",
      name: "ProductTodo",
      component: () => import("@/views/alomerry/product/todo/index.vue"),
      meta: {
        title: "Todo"
      }
    }
  ]
} as RouteChildrenConfigsTable;

const tools = {
  path: "/product/tools",
  meta: {
    title: "Tools",
    icon: "logos:applitools-icon"
  },
  children: [
    {
      path: "/product/tools/it",
      name: "ProductToolsIt",
      component: IFrame,
      meta: {
        title: "IT 工具",
        icon: "material-symbols-light:tools-pliers-wire-stripper-outline",
        frameSrc: "https://it-tools.alomerry.com",
        keepAlive: true
      }
    },
    {
      path: "/product/tools/reference",
      name: "ProductToolsReference",
      component: IFrame,
      meta: {
        title: "知识库",
        icon: "tabler:brand-kbin",
        frameSrc: "https://ref.alomerry.com",
        keepAlive: true
      }
    }
  ]
} as RouteChildrenConfigsTable;

export default {
  path: "/product",
  meta: {
    title: "产品",
    icon: "material-symbols:app-badging-outline",
    rank: product
  },
  children: [infancy7k, sgs, tools, todo]
} as RouteConfigsTable;
