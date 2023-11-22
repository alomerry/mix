import { type DefaultTheme } from 'vitepress'
import { BaGu } from '../8gu'

export function BaGuElasticSearch(): DefaultTheme.SidebarItem[] {
  return [
    ...BaGu(),
    {
      text: 'Elastic Search',
      items: [
        { text: 'Intro', link: '/8gu/database/elastic-search/' },
      ]
    },
  ]
}