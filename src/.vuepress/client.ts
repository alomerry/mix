import { defineClientConfig } from "@vuepress/client";
import { defineAsyncComponent } from 'vue';

import Slot from "./layouts/slot.vue";
import { setupFootnotePopup } from "./components/footnotePopup/popup.js";


export default defineClientConfig({
  enhance: ({ app }) => {
  },
  setup() {
    setupFootnotePopup()
  },
  layouts: { Slot },
});