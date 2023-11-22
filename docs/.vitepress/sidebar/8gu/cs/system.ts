import { type DefaultTheme } from 'vitepress'
import { BaGu } from '../8gu'

export function BaGuSystem(): DefaultTheme.SidebarItem[] {
  return [
    ...BaGu(),
    { text: 'System', link: '/8gu/system/' },
  ]
}