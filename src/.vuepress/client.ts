import { defineClientConfig } from "@vuepress/client";
import { usePageData } from '@vuepress/client'
// import Slot from "./layouts/slot.vue";
import { setupFootnotePopup } from "./components/footnotePopup/popup.js";
import UmamiLink from "./components/navItem/umami.js";

declare const __VUEPRESS_DEV__: boolean;

export default defineClientConfig({
  enhance: ({ app, router, siteData }) => {
    app.component("UmamiLink", UmamiLink);
  },
  setup() {
    setupFootnotePopup()
  },
  // layouts: { Slot },
});