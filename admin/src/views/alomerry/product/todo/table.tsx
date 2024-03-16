import Sortable from "sortablejs";
import dayjs from "dayjs";
import { ref, nextTick } from "vue";
import { clone } from "@pureadmin/utils";

const date = dayjs(new Date()).format("YYYY-MM-DD");

const todos = [
  {
    date,
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles"
  },
  {
    date,
    name: "Jack",
    address: "No. 189, Grove St, Los Angeles"
  }
];

const tableDataDrag = clone(todos, true).map((item, index) => {
  delete item.address;
  delete item.date;
  return Object.assign(item, {
    id: index + 1,
    date: `${dayjs(new Date()).format("YYYY-MM")}-${index + 1}`
  });
});

// 行拖拽演示
export function useColumns() {
  const dataList = ref(clone(tableDataDrag, true));

  const rowDrop = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    nextTick(() => {
      const wrapper: HTMLElement = document.querySelector(
        ".el-table__body-wrapper tbody"
      );
      Sortable.create(wrapper, {
        animation: 300,
        handle: ".drag-btn",
        onEnd: ({ newIndex, oldIndex }) => {
          const currentRow = dataList.value.splice(oldIndex, 1)[0];
          dataList.value.splice(newIndex, 0, currentRow);
        }
      });
    });
  };

  const columns: TableColumnList = [
    {
      label: "ID",
      prop: "id",
      cellRenderer: ({ row }) => (
        <div class="flex items-center">
          <iconify-icon-online
            icon="icon-park-outline:drag"
            class="drag-btn cursor-grab"
            onMouseenter={(event: { preventDefault: () => void }) =>
              rowDrop(event)
            }
          />
          <p class="ml-[16px]">{row.id}</p>
        </div>
      )
    },
    {
      label: "日期",
      prop: "date"
    },
    {
      label: "姓名",
      prop: "name"
    }
  ];

  return {
    columns,
    dataList
  };
}
