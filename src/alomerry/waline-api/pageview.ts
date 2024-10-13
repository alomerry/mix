/*
import { getPageview } from "@waline/api";
import { errorHandler, getServerURL } from "~/alomerry/waline-api/utils";
import { ALOMERRY_BLOG_WALINE_DOMAIN } from "~/alomerry";

export const loadPageView = (lang: string) => {
  getPageview({
    serverURL: getServerURL(ALOMERRY_BLOG_WALINE_DOMAIN),
    lang: lang,
    paths: [window.location.pathname],
  })
    .then((counts) => {
      const el = document.querySelector<HTMLElement>(".waline-pageview-count");
      renderVisitorCount(counts, el);
    })
    .catch(errorHandler);
};

const renderVisitorCount = (
  counts: number[],
  countElement: HTMLElement | null,
): void => {
  if (countElement) {
    countElement.innerText = counts[0].data[0].time.toString();
    console.log(countElement)
  }
};
*/
