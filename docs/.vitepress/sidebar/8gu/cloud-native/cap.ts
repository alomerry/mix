import { type DefaultTheme } from 'vitepress'
import { BaGu } from '../8gu'

export function BaGuCAP(): DefaultTheme.SidebarItem[] {
  return [
    ...BaGu(),
    {
      text: 'CAP',
      link: '/8gu/cloud-native/cap',
      items: []
    },
  ]
}
