import { arraySidebar } from "vuepress-theme-hope";

export const golang = arraySidebar([
  "",
  "map",
  "function-call",
  "keyword/defer",
  "keyword/panic-recover",
  "concurrency/context",
  "concurrency/sync/mutex",
  "concurrency/sync/rwmutex",
  "concurrency/sync/map",
  "concurrency/semaphore",
  "concurrency/channel",
  "concurrency/goroutine/goroutine",
  {
    text: "Compile",
    collapsible: true,
    prefix: "compile/",
    children: [
      "boot",
      "cmd",
      "compile",
      "main",
    ],
  },
]);
