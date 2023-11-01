import { type DefaultTheme } from 'vitepress'
import { BaGuZhLanguage } from "./language/index.js"

export function BaGuZh(): DefaultTheme.SidebarItem[] {
  return [
    { text: '八股文', link: '/' },
    {
      text: '面经',
      link: 'case/index',
      collapsed: false,
      items: [
        { text: '优刻得', link: 'case/ucloud' },
        { text: '米哈游', link: 'case/mihoyo' },
        { text: '智慧树', link: 'case/zhihuishu' },
        { text: '流利说', link: 'case/liulishuo' },
        { text: '悠星', link: 'case/yostar' },
        { text: '趋动科技', link: 'case/virtaitech' },
      ]
    },
    {
      text: '编程语言',
      collapsed: false,
      items: BaGuZhLanguage()
    },
    {
      text: '数据库',
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
      text: '消息队列',
      collapsed: false,
      link: 'message-queue/',
      items: [
        { text: 'RocketMQ', link: '' },
      ]
    },
    {
      text: '云原生',
      collapsed: false,
      items: [
        { text: 'Docker', link: '' },
        { text: 'Kubernetes', link: '' },
        { text: 'CAP', link: 'cloud-native/cap' },
      ]
    },
    {
      text: '计算机基础',
      collapsed: false,
      items: [
        { text: '操作系统', link: 'system/' },
        { text: '计算机网络', link: 'network/' },
        { text: '数据结构与算法', link: 'algorithm/' },
      ]
    }
  ]
}
