import { type DefaultTheme } from 'vitepress'
import { BaGu } from '../8gu'

export function BaGuMySQL(): DefaultTheme.SidebarItem[] {
  return [
    ...BaGu(),
    {
      text: 'MySQL',
      items: [
        { text: 'Intro', link: '/8gu/database/mysql/' },
      ]
    },
  ]
}