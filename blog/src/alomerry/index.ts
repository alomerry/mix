import dayjs from "dayjs";

export function formatDateByAlomerry(d: string | Date, onlyDate = true) {
  const date = dayjs(d);
  if (onlyDate || date.year() === dayjs().year()) return date.format("MMM D");
  return date.format("MMM D, YYYY");
}

const DISPLAY_COMMENT = "display_comment";

export const ALOMERRY_BLOG_DOMAIN="blog.alomerry.com"
export const ALOMERRY_BLOG_WALINE_DOMAIN="https://waline-blog.alomerry.com"

export function displayComment(): boolean {
  return getLocalStorage(DISPLAY_COMMENT) === "true";
}

export function setDefaultDisplayComment(displayComment: boolean) {
  setLocalStorage(DISPLAY_COMMENT, displayComment ? "true" : "false");
}

function getLocalStorage(key: string): any {
  return localStorage.getItem(key);
}

function setLocalStorage(key: string, value: string) {
  return localStorage.setItem(key, value);
}
