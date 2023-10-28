import { defineConfig } from 'vitepress'

import navbar from './navbar.js'
import { SGet, SidebarType} from './sidebar/index.js'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "CS KB",
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
    search: {
			provider: 'local',
			options: {
				locales: {
					zh: {
						translations: {
							button: {
								buttonText: '搜索文档',
								buttonAriaLabel: '搜索文档',
							},
							modal: {
								noResultsText: '无法找到相关结果',
								resetButtonTitle: '清除查询条件',
								footer: {
									selectText: '选择',
									navigateText: '切换',
								},
							},
						},
					},
				},
			},
		},
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      description: "8gu docs",
      themeConfig: {
        nav: navbar.Nav(), // https://vitepress.dev/reference/default-theme-config
        sidebar: {
          '/8gu/': { base: '/8gu/', items: SGet(SidebarType.BaGu) },
          '/ioi/': { base: '/ioi/', items: SGet(SidebarType.IOI) },
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
          '/zh/8gu/': { base: '/zh/8gu/', items: SGet(SidebarType.BaGuZh) },
          '/zh/ioi/': { base: '/zh/ioi/', items: SGet(SidebarType.IOIZh) },
        },
      },
    }
  },
  markdown: {
    math: true,
  },
  lastUpdated: true
})
