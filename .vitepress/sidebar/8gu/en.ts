import { type DefaultTheme } from 'vitepress'

export function BaGu(): DefaultTheme.SidebarItem[] {
  return [
    { text: '8gu', link: '/' },
    {
      text: 'Case',
      link: 'case/index',
      base: 'case/',
      collapsed: true,
      items: [
        { text: 'ucloud', link: 'ucloud' },
        { text: 'mihoyo', link: 'mihoyo' },
        { text: '智慧树', link: 'zhihuishu' },
        { text: '流利说', link: 'liulishuo' },
        { text: '悠星', link: 'yostar' },
        { text: '趋动科技', link: 'virtaitech' },
      ]
    },
    {
      text: 'Language',
      collapsed: true,
      base: 'language/golang/',
      items: [
        { 
          text: 'Golang',
          link: '/',
          items: [
            { text: 'Function Call', link: 'function-call' },
          ]
        },
      ]
    },
    {
      text: 'Database',
      collapsed: true,
      link: '/',
      base: 'database/',
      items: [
        { text: 'MySQL', link: 'mysql/' },
        { text: 'Redis', link: 'redis/' },
        { text: 'MongoDB', link: 'mongodb/' },
        { text: 'ElasticSearch', link: 'elastic-search/' }
      ]
    },
    {
      text: 'MessageQueue',
      collapsed: true,
      link: 'message-queue/',
      items: [
        { text: 'RocketMQ', link: '' },
      ]
    },
    {
      text: 'CloudNative',
      collapsed: true,
      items: [
        { text: 'Docker', link: '' },
        { text: 'Kubernetes', link: '' },
        { text: 'CAP', link: 'cloud-native/cap' },
      ]
    },
    {
      text: 'CS',
      collapsed: true,
      items: [
        { text: 'System', link: 'system/' },
        { text: 'Network', link: 'network/' },
        { text: 'Algorithm', link: 'algorithm/' },
      ]
    }
  ]
}
