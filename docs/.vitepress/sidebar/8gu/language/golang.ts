import { type DefaultTheme } from 'vitepress'
import { BaGu } from '../8gu'

export function BaGuLanguageGolang(): DefaultTheme.SidebarItem[] {
  return [
    ...BaGu(),
    {
      text: 'Golang',
      // link: '/8gu/language/golang/',
      items: [
        { text: 'Function Call', link: '/8gu/language/golang/function-call' },
        {
          text: 'Goroutine',
          items: [
            { text: 'Intro', link: '/8gu/language/golang/goroutine/' },
          ]
        },
      ]
    },
  ]
}