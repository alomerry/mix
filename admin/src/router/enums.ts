// 完整版菜单比较多，将 rank 抽离出来，在此方便维护

const home = 0, // 平台规定只有 home 路由的 rank 才能为 0 ，所以后端在返回 rank 的时候需要从非 0 开始
  monitor = 1, // START
  product = 1,
  cicd = 1,
  gateway = 1,
  log = 1,
  frp = 1,
  blog = 1,
  k8s = 1,
  mq = 1,
  database = 1, // END
  components = 1,
  able = 2,
  table = 3,
  list = 4,
  result = 5,
  error = 6,
  frame = 7,
  permission = 9,
  system = 10,
  tabs = 11,
  editor = 13,
  flowchart = 14,
  ppt = 17,
  guide = 18;

export {
  home,
  monitor, // START
  product,
  cicd,
  log,
  gateway,
  frp,
  mq,
  k8s,
  blog,
  database, // END
  components,
  able,
  table,
  list,
  result,
  error,
  frame,
  permission,
  system,
  tabs,
  editor,
  flowchart,
  ppt,
  guide
};
