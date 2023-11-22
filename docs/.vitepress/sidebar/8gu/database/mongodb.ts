import { type DefaultTheme } from 'vitepress'
import { BaGu } from '../8gu'

export function BaGuMongoDB(): DefaultTheme.SidebarItem[] {
  return [
    ...BaGu(),
    {
      text: 'MongoDB',
      items: [
        { text: 'Intro', link: '/8gu/database/mongodb/' },
      ]
    },
  ]
}