// 这里存放本地图标，在 src/layout/index.vue 文件中加载，避免在首启动加载
import { addIcon } from "@iconify/vue/dist/offline";

// 本地菜单图标，后端在路由的 icon 中返回对应的图标字符串并且前端在此处使用 addIcon 添加即可渲染菜单图标
// @iconify-icons/ep
import Menu from "@iconify-icons/ep/menu";
import Edit from "@iconify-icons/ep/edit";
import SetUp from "@iconify-icons/ep/set-up";
import Monitor from "@iconify-icons/ep/monitor";
import Lollipop from "@iconify-icons/ep/lollipop";
import HomeFilled from "@iconify-icons/ep/home-filled";
addIcon("ep:menu", Menu);
addIcon("ep:edit", Edit);
addIcon("ep:set-up", SetUp);
addIcon("ep:monitor", Monitor);
addIcon("ep:lollipop", Lollipop);
addIcon("ep:home-filled", HomeFilled);
// @iconify-icons/ri
import Tag from "@iconify-icons/ri/bookmark-2-line";
import Ppt from "@iconify-icons/ri/file-ppt-2-line";
import Card from "@iconify-icons/ri/bank-card-line";
import Role from "@iconify-icons/ri/admin-fill";
import Dept from "@iconify-icons/ri/git-branch-line";
import Table from "@iconify-icons/ri/table-line";
import Search from "@iconify-icons/ri/search-line";
import FlUser from "@iconify-icons/ri/admin-line";
import Setting from "@iconify-icons/ri/settings-3-line";
import ListCheck from "@iconify-icons/ri/list-check";
import UbuntuFill from "@iconify-icons/ri/ubuntu-fill";
import InformationLine from "@iconify-icons/ri/information-line";
import TerminalWindowLine from "@iconify-icons/ri/terminal-window-line";
import CheckboxCircleLine from "@iconify-icons/ri/checkbox-circle-line";
addIcon("ri:bookmark-2-line", Tag);
addIcon("ri:file-ppt-2-line", Ppt);
addIcon("ri:bank-card-line", Card);
addIcon("ri:admin-fill", Role);
addIcon("ri:git-branch-line", Dept);
addIcon("ri:table-line", Table);
addIcon("ri:search-line", Search);
addIcon("ri:admin-line", FlUser);
addIcon("ri:settings-3-line", Setting);
addIcon("ri:list-check", ListCheck);
addIcon("ri:ubuntu-fill", UbuntuFill);
addIcon("ri:information-line", InformationLine);
addIcon("ri:terminal-window-line", TerminalWindowLine);
addIcon("ri:checkbox-circle-line", CheckboxCircleLine);
