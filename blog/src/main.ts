import '@unocss/reset/tailwind.css'
import 'floating-vue/dist/style.css'
import 'markdown-it-github-alerts/styles/github-colors-light.css'
import 'markdown-it-github-alerts/styles/github-colors-dark-class.css'
import 'markdown-it-github-alerts/styles/github-base.css'
import '@shikijs/twoslash/style-rich.css'
import './styles/font.css'
import './styles/main.css'
import './styles/prose.css'
import './styles/markdown.css'
import './styles/container.css'
import './styles/vitepress/vars.css'
import './styles/vitepress/vp-code-group.css'
import './styles/vitepress/custom-block.css'
import './styles/vitepress/alomerry.css'
import './styles/vitepress/vp-copy-code.css'
import 'uno.css'

import 'element-plus/es/components/dialog/style/css'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/popover/style/css'
import 'element-plus/es/components/drawer/style/css'
import 'element-plus/es/components/input/style/css'
import 'element-plus/es/components/card/style/css'
import 'element-plus/es/components/empty/style/css'
import 'element-plus/es/components/loading/style/css'
import 'element-plus/es/components/scrollbar/style/css'
import 'element-plus/es/components/tag/style/css'
import 'element-plus/es/components/badge/style/css'
import 'element-plus/es/components/timeline/style/css'
import 'element-plus/es/components/timeline-item/style/css'
import 'element-plus/es/components/badge/style/css'

import { vLoading } from "element-plus/es/components/loading/src/directive";

import { routes } from 'vue-router/auto-routes'
import NProgress from 'nprogress'
import { ViteSSG } from 'vite-ssg'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat.js'
import { setupRouterScroller } from 'vue-router-better-scroller'
import FloatingVue from 'floating-vue'
import App from './App.vue'

import './styles/alomerry/custom.css'
import './styles/alomerry/breath.css'
import './styles/alomerry/max-limit.css'
import './styles/alomerry/nav-search.css'

export const createApp = ViteSSG(
  App,
  {
    routes,
  },
  ({ router, app, isClient }) => {
    dayjs.extend(LocalizedFormat)

    app.directive('load', vLoading);
    app.use(FloatingVue)

    if (isClient) {
      const html = document.querySelector('html')!
      setupRouterScroller(router, {
        selectors: {
          html(ctx) {
            // only do the sliding transition when the scroll position is not 0
            if (ctx.savedPosition?.top)
              html.classList.add('no-sliding')
            else html.classList.remove('no-sliding')
            return true
          },
        },
        behavior: 'auto',
      })
      router.beforeEach(() => {
        NProgress.start()
      })
      router.afterEach(() => {
        NProgress.done()
      })
    }
  },
)
