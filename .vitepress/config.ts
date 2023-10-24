import { defineConfig } from 'vitepress'

import navbar from './navbar.js'
import { SidebarConfig, SidebarType} from './sidebar/index.js'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "8gu",
  themeConfig:{
    outline: 2,
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-present Alomerry Wu',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/alomerry/docs' },
      // { icon: 'discord', link: '' },
      // { icon: 'facebook', link: '' },
      // { icon: 'instagram', link: '' },
      // { icon: 'linkedin', link: '' },
      // { icon: 'slack', link: '' },
      // { icon: 'twitter', link: '' },
      // { icon: 'youtube', link: '' },
      // { icon: { svg: "" }, link: '' },
    ],
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      description: "8gu docs",
      themeConfig: {
        nav: navbar.Nav(), // https://vitepress.dev/reference/default-theme-config
        sidebar: {
          '/8gu/': { base: '/8gu/', items: SidebarConfig.Get(SidebarType.BaGu) },
          '/knowledge/': { base: '/knowledge/', items: SidebarConfig.Get(SidebarType.Knowledge) },
        },
      },
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      themeConfig: {
        nav: navbar.Nav_Zh(),
        sidebar: {
          '/zh/8gu/': { base: '/zh/8gu/', items: SidebarConfig.Get(SidebarType.BaGu_Zh) },
          '/zh/knowledge/': { base: '/zh/knowledge/', items: SidebarConfig.Get(SidebarType.Knowledge_Zh) },
        },
      },
    }
  },
  markdown: {
    math: true,
  },
  lastUpdated: true
})