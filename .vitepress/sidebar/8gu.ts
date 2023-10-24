import { type DefaultTheme } from 'vitepress'

function Sidebar(): DefaultTheme.SidebarItem[] {
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
      ]
    },
    {
      text: 'Middleware',
      collapsed: false,
      items: [
        { text: 'MessageQueue', link: 'message-queue/' },
        { text: 'ElasticSearch', link: 'elastic-search/' }
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

function SidebarZh(): DefaultTheme.SidebarItem[] {
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
      ]
    },
    {
      text: '中间件',
      collapsed: false,
      items: [
        { text: 'MessageQueue', link: 'message-queue/' },
        { text: 'ElasticSearch', link: 'elastic-search/' }
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


export default {
  Sidebar, SidebarZh
}