import { type DefaultTheme } from 'vitepress'

export function BaGuZh(): DefaultTheme.SidebarItem[] {
  return [
    { text: '八股文', link: '/' },
    {
      text: '编程语言',
      collapsed: false,
      items: [
        { text: 'Golang', link: 'language/golang/' },
      ]
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
