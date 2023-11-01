import { type DefaultTheme } from 'vitepress'

export function BaGuZhLanguage(): DefaultTheme.SidebarItem[] {
  return [
    { 
      text: 'Golang',
      link: 'language/golang/',
      items: [
        { text: '函数调用', link: 'language/golang/function-call' },
      ]
    },
  ]
}
