import { defineConfig } from 'vitepress';
import todo from 'markdown-it-task-lists';
import { 
  Lang,
  Nav,
  BaGuIndex as BaGu,
  IOIIndex as IOI,
} from './i18n';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "CS KB",
  themeConfig: {
    outline: [2, 3],
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
  sitemap: {
    hostname: 'https://docs.alomerry.com'
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      description: "8gu docs",
      themeConfig: {
        nav: Nav(Lang.EN),
        sidebar: {
          ...BaGu(Lang.EN),
          ...IOI(Lang.EN),
        },
      },
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      themeConfig: {
        nav: Nav(Lang.ZH_CN),
        sidebar: {
          ...BaGu(Lang.ZH_CN),
          ...IOI(Lang.ZH_CN),
        },
      },
    }
  },
  markdown: {
    config: (md) => {
      md.use(todo)
    },
    math: true,
  },
  lastUpdated: true
})
