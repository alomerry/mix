import { message } from "@/utils/message";
import {
  KubernetesPodStatus,
  KubernetesPodStatusColor,
  KubernetesResourceType
} from "@/views/alomerry/k8s/k8s/constant";
import { onMounted, ref, reactive } from "vue";
import type {
  LoadingConfig,
  AdaptiveConfig,
  PaginationProps
} from "@pureadmin/table";
import { delay } from "@pureadmin/utils";

export function useColumns() {
  const search = ref("");
  const loading = ref(true);
  const columns: TableColumnList = [
    {
      label: "命名空间",
      prop: "namespace",
      formatter: ({ namespace }) => `格式化后的内容：${namespace}`,
      sortable: true
    },
    {
      label: "类型",
      prop: "type",
      filters: Object.values(KubernetesResourceType).map(item => {
        return { text: item, value: item };
      }),
      filterMethod(value, row) {
        return row.type === value;
      }
    },
    {
      label: "名称",
      prop: "name"
    },
    {
      label: "ip",
      prop: "ip"
    },
    {
      label: "镜像版本",
      prop: "imageVersion"
    },
    {
      label: "状态",
      prop: "status",
      filters: Object.values(KubernetesPodStatus).map(item => {
        return { text: item, value: item };
      }),
      filterMethod(value, row) {
        return row.status === value;
      },
      cellRenderer: ({ index, row }) => (
        <>
          <el-tag
            effect="dark"
            empty={index}
            style={
              "border-width: 0!important; padding: 0 6px; font-weight: 400; font-size: 13px"
            }
            color={KubernetesPodStatusColor.get(row.status)}
          >
            {row.status}
          </el-tag>
        </>
      )
    },
    {
      label: "重启次数",
      prop: "restartTimes",
      sortable: true
    },
    {
      label: "创建时间",
      prop: "createdAt",
      sortable: true
    },
    {
      label: "操作",
      headerRenderer: () => (
        <el-input
          v-model={search.value}
          size="small"
          clearable
          placeholder="过滤"
        />
      ),
      cellRenderer: ({ index, row }) => (
        <>
          <el-button size="small" onClick={() => handleEdit(index + 1, row)}>
            日志
          </el-button>
          {row.type === KubernetesResourceType.Deployment ? (
            <el-button
              size="small"
              type="danger"
              onClick={() => handleDelete(index + 1, row)}
            >
              重启
            </el-button>
          ) : null}
        </>
      )
    }
  ];

  const handleEdit = (index: number, row) => {
    message(`您修改了第 ${index} 行，数据为：${JSON.stringify(row)}`, {
      type: "success"
    });
  };

  const handleDelete = (index: number, row) => {
    message(`您重启了第 ${index} 行，数据为：${JSON.stringify(row)}`);
  };

  /** 撑满内容区自适应高度相关配置 */
  const adaptiveConfig: AdaptiveConfig = {
    /** 表格距离页面底部的偏移量，默认值为 `96` */
    offsetBottom: 96
    /** 是否固定表头，默认值为 `true`（如果不想固定表头，fixHeader设置为false并且表格要设置table-layout="auto"） */
    // fixHeader: true
    /** 页面 `resize` 时的防抖时间，默认值为 `60` ms */
    // timeout: 60
    /** 表头的 `z-index`，默认值为 `100` */
    // zIndex: 100
  };

  /** 加载动画配置 */
  const loadingConfig = reactive<LoadingConfig>({
    text: "正在加载第一页...",
    viewBox: "-10, -10, 50, 50",
    spinner: `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `
    // svg: "",
    // background: rgba()
  });

  /** 分页配置 */
  const pagination = reactive<PaginationProps>({
    pageSize: 20,
    currentPage: 1,
    pageSizes: [20, 40, 60],
    total: 0,
    align: "right",
    background: true,
    small: false
  });

  function onSizeChange(val) {
    console.log("onSizeChange", val);
  }

  function onCurrentChange(val) {
    loadingConfig.text = `正在加载第${val}页...`;
    loading.value = true;
    delay(1000).then(() => {
      loading.value = false;
    });
  }

  onMounted(() => {
    delay(1000).then(() => {
      loading.value = false;
    });
  });

  return {
    columns,
    search,
    pagination,
    adaptiveConfig,
    loading,
    loadingConfig,
    onSizeChange,
    onCurrentChange
  };
}
