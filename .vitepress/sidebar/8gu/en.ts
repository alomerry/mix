import { type DefaultTheme } from 'vitepress'

export function BaGu(): DefaultTheme.SidebarItem[] {
  return [
    { text: '8gu', link: '/' },
    {
      text: 'Case',
      base: '/8gu/case/',
      collapsed: false,
      items: [
        { text: 'Didi 一面', link: 'didi' },
      ]
    },
    {
      text: 'Language',
      collapsed: false,
      items: [
        { text: 'Golang', link: 'language/golang/' },
      ]
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
