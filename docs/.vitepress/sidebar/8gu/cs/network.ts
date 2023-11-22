import { type DefaultTheme } from 'vitepress'
import { BaGu } from '../8gu'

export function BaGuNetwork(): DefaultTheme.SidebarItem[] {
  return [
    ...BaGu(),
    { text: 'Network', link: '/8gu/network/' },
  ]
}