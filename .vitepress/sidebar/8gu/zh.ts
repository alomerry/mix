import { type DefaultTheme } from 'vitepress'

export function BaGuZh(): DefaultTheme.SidebarItem[] {
  return [
    { text: '八股文', link: '/' },
    {
      text: '面经',
      link: 'case/index',
      collapsed: true,
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
      collapsed: true,
      items: [
        { 
          text: 'Golang',
          link: 'language/golang/',
          items: [
            { text: '函数调用', link: 'language/golang/function-call' },
          ]
        },
      ]
    },
    {
      text: '数据库',
      collapsed: true,
      link: '/',
      base: '/zh/8gu/database/',
      items: [
        { text: 'MySQL', link: 'mysql/' },
        { text: 'Redis', link: 'redis/' },
        { text: 'MongoDB', link: 'mongodb/' },
        { text: 'ElasticSearch', link: 'elastic-search/' }
      ]
    },
    {
      text: '消息队列',
      collapsed: true,
      link: '/',
      base: '/zh/8gu/message-queue/',
      items: [
        { text: 'RocketMQ', link: '' },
      ]
    },
    {
      text: '云原生',
      collapsed: true,
      base: '/zh/8gu/cloud-native/',
      items: [
        { text: 'Docker', link: '' },
        { text: 'Kubernetes', link: '' },
        { text: 'CAP', link: 'cap' },
      ]
    },
    {
      text: '计算机基础',
      collapsed: true,
      base: '/zh/8gu/',
      items: [
        { text: '操作系统', link: 'system/' },
        { text: '计算机网络', link: 'network/' },
        { text: '数据结构与算法', link: 'algorithm/' },
      ]
    }
  ]
}
