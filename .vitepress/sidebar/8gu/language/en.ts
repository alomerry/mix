import { type DefaultTheme } from 'vitepress'

export function BaGuLanguage(): DefaultTheme.SidebarItem[] {
  return [
    { 
      text: 'Golang',
      link: 'language/golang/',
      items: [
        { text: 'Function Call', link: 'language/golang/function-call' },
      ]
    },
  ]
}
