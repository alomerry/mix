import { type DefaultTheme } from 'vitepress'
import { BaGu } from './8gu'

export function BaGuAlgorithm(): DefaultTheme.SidebarItem[] {
  return [
    ...BaGu(),
    { text: '数据结构', link: '/8gu/algorithm/data-struct' },
    { text: 'algorithm', link: '/8gu/algorithm/list.md' },
  ]
}
