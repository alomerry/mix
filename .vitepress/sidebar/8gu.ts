import { type DefaultTheme } from 'vitepress'

function Sidebar(): DefaultTheme.SidebarItem[] {
  return [
    { text: '8gu', link: 'README' },
    {
      text: 'Language',
      collapsed: false,
      items: [
        { text: 'Golang', link: 'golang/README' },
      ]
    },
    {
      text: 'Database',
      collapsed: false,
      items: [
        { text: 'MySQL', link: 'mysql/README' },
        { text: 'Redis', link: 'redis/README' },
        { text: 'MongoDB', link: 'mongodb/README' },
      ]
    },
    {
      text: 'Middleware',
      collapsed: false,
      items: [
        { text: 'MessageQueue', link: 'message-queue/README' },
        { text: 'ElasticSearch', link: 'elastic-search/README' }
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
        { text: 'System', link: 'system/README' },
        { text: 'Network', link: 'network/README' },
        { text: 'Algorithm', link: 'algorithm/README' },
      ]
    }
  ]
}


export default {
  Sidebar
}