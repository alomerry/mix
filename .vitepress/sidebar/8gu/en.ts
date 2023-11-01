import { type DefaultTheme } from 'vitepress'
import { BaGuLanguage } from "./language/index.js"

export function BaGu(): DefaultTheme.SidebarItem[] {
  return [
    { text: '8gu', link: '/' },
    {
      text: 'Case',
      link: 'case/index',
      collapsed: false,
      items: [
        { text: 'ucloud', link: 'case/ucloud' },
        { text: 'mihoyo', link: 'case/mihoyo' },
        { text: '智慧树', link: 'case/zhihuishu' },
        { text: '流利说', link: 'case/liulishuo' },
        { text: '悠星', link: 'case/yostar' },
        { text: '趋动科技', link: 'case/virtaitech' },
      ]
    },
    {
      text: 'Language',
      collapsed: false,
      items: BaGuLanguage()
    },
    {
      text: 'Database',
      collapsed: false,
      link: 'database/',
      items: [
        { text: 'MySQL', link: 'database/mysql/' },
        { text: 'Redis', link: 'database/redis/' },
        { text: 'MongoDB', link: 'database/mongodb/' },
        { text: 'ElasticSearch', link: 'database/elastic-search/' }
      ]
    },
    {
      text: 'MessageQueue',
      collapsed: false,
      link: 'message-queue/',
      items: [
        { text: 'RocketMQ', link: '' },
      ]
    },
    {
      text: 'CloudNative',
      collapsed: false,
      items: [
        { text: 'Docker', link: '' },
        { text: 'Kubernetes', link: '' },
        { text: 'CAP', link: 'cloud-native/cap' },
      ]
    },
    {
      text: 'CS',
      collapsed: false,
      items: [
        { text: 'System', link: 'system/' },
        { text: 'Network', link: 'network/' },
        { text: 'Algorithm', link: 'algorithm/' },
      ]
    }
  ]
}
