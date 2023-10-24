import { type DefaultTheme } from 'vitepress'

function Sidebar(): DefaultTheme.SidebarItem[] {
  return [
    { text: 'Knowledge', link: '/' },
    {
      text: 'Database',
      collapsed: false,
      link: 'database/',
      items: [
        { text: 'MongoDB', link: 'database/mongodb/' },
      ]
    },
  ]
}

function SidebarZh(): DefaultTheme.SidebarItem[] {
  return [
    { text: '知识', link: '/' },
    {
      text: '数据库',
      collapsed: false,
      link: 'database/',
      items: [
        { text: 'MongoDB', link: 'database/mongodb/' },
      ]
    },
  ]
}


export default {
  Sidebar, SidebarZh
}