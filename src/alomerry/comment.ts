const DISPLAY_COMMENT = "display_comment";

// 是否展示评论
export function displayComment(): boolean {
  return getLocalStorage(DISPLAY_COMMENT) === "true";
}

// 缓存 localStorage 展示评论
export function setDefaultDisplayComment(displayComment: boolean) {
  setLocalStorage(DISPLAY_COMMENT, displayComment ? "true" : "false");
}

function getLocalStorage(key: string): any {
  return typeof localStorage === "undefined" ? null : localStorage.getItem(key);
}

function setLocalStorage(key: string, value: string) {
  if (typeof localStorage !== "undefined") {
    localStorage?.setItem(key, value);
  }
}
