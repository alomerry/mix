import { defineConfig } from 'vitepress'

import navbar from './navbar.js'
import { SidebarConfig, SidebarType} from './sidebar/index.js'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "docs",
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: navbar.nav(),

    sidebar: {
      '/8gu/': { base: '/8gu/', items: SidebarConfig.Get(SidebarType.BaGu) },
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/alomerry/docs' }
    ],
  },
  markdown: {
    math: true,
  }
})