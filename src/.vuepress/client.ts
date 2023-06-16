import { defineClientConfig } from "@vuepress/client";

// import Slot from "./layouts/slot.vue";
import { setupFootnotePopup } from "./components/footnotePopup/popup.js";


export default defineClientConfig({
  enhance: ({ app, router, siteData }) => {
  },
  setup() {
    setupFootnotePopup()
  },
  // layouts: { Slot },
});