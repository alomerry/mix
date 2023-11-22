import { type DefaultTheme } from 'vitepress'
import { BaGuSystem } from './system'
import { BaGuNetwork } from './network'

export function BaGuCS(): DefaultTheme.SidebarMulti {
  return {
    '/8gu/cs/system': BaGuSystem(),
    '/8gu/cs/network': BaGuNetwork(),
  }
}
